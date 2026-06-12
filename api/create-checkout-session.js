const Stripe = require('stripe');
const { getSiteUrl, json, requireSupabaseUser } = require('./_server-utils');

const allowedPlans = new Set(['family', 'households']);
const allowedCycles = new Set(['monthly', 'yearly']);

const priceMap = {
  family: {
    monthly: process.env.REACT_APP_STRIPE_PRICE_FAMILY_MONTHLY,
    yearly: process.env.REACT_APP_STRIPE_PRICE_FAMILY_YEARLY,
  },
  households: {
    monthly: process.env.REACT_APP_STRIPE_PRICE_HOUSEHOLDS_MONTHLY,
    yearly: process.env.REACT_APP_STRIPE_PRICE_HOUSEHOLDS_YEARLY,
  },
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return json(res, 500, { error: 'Stripe checkout is not configured.' });
  }

  const auth = await requireSupabaseUser(req);
  if (auth.error) return json(res, auth.status, { error: auth.error });

  const payload = req.body || {};
  const planKey = String(payload.planKey || '');
  const billingCycle = String(payload.billingCycle || '');
  const priceId = String(payload.priceId || '');

  if (!allowedPlans.has(planKey) || !allowedCycles.has(billingCycle)) {
    return json(res, 400, { error: 'Invalid plan.' });
  }

  if (!priceId || priceMap[planKey]?.[billingCycle] !== priceId) {
    return json(res, 400, { error: 'Invalid price.' });
  }

  const siteUrl = getSiteUrl(req);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover',
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: auth.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard/definicoes?checkout=success`,
    cancel_url: `${siteUrl}/dashboard/definicoes?checkout=cancelled`,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        supabase_user_id: auth.user.id,
        plan_key: planKey,
        billing_cycle: billingCycle,
      },
    },
    metadata: {
      supabase_user_id: auth.user.id,
      plan_key: planKey,
      billing_cycle: billingCycle,
    },
  });

  return json(res, 200, { url: session.url });
};
