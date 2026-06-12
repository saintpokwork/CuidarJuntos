const Stripe = require('stripe');
const { fetchJson, json } = require('./_server-utils');

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

const priceToPlan = () => {
  const entries = [
    [process.env.REACT_APP_STRIPE_PRICE_FAMILY_MONTHLY, ['family', 'monthly']],
    [process.env.REACT_APP_STRIPE_PRICE_FAMILY_YEARLY, ['family', 'yearly']],
    [process.env.REACT_APP_STRIPE_PRICE_HOUSEHOLDS_MONTHLY, ['households', 'monthly']],
    [process.env.REACT_APP_STRIPE_PRICE_HOUSEHOLDS_YEARLY, ['households', 'yearly']],
  ];
  return new Map(entries.filter(([price]) => Boolean(price)));
};

const upsertSubscription = async (subscription) => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error('Supabase service role is not configured.');

  const firstItem = subscription.items?.data?.[0];
  const priceId = firstItem?.price?.id || '';
  const [planKey, billingCycle] = priceToPlan().get(priceId) || [subscription.metadata?.plan_key || 'family', subscription.metadata?.billing_cycle || 'monthly'];
  const userId = subscription.metadata?.supabase_user_id;

  if (!userId) throw new Error('Missing supabase_user_id on Stripe subscription metadata.');

  const payload = {
    user_id: userId,
    stripe_customer_id: String(subscription.customer),
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    plan_key: planKey,
    billing_cycle: billingCycle,
    status: subscription.status,
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    updated_at: new Date().toISOString(),
  };

  const url = `${supabaseUrl}/rest/v1/subscriptions?on_conflict=stripe_subscription_id`;
  const result = await fetchJson(url, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(payload),
  });

  if (!result.response.ok) {
    throw new Error(`Supabase subscription upsert failed: ${JSON.stringify(result.body)}`);
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return json(res, 500, { error: 'Stripe webhook is not configured.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover',
  });

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('[stripe-webhook] Signature verification failed:', error);
    return json(res, 400, { error: 'Invalid signature.' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await upsertSubscription(subscription);
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      await upsertSubscription(event.data.object);
    }
  } catch (error) {
    console.error('[stripe-webhook] Handler failed:', error);
    return json(res, 500, { error: 'Webhook handler failed.' });
  }

  return json(res, 200, { received: true });
};
