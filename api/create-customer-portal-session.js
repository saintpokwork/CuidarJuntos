const Stripe = require('stripe');
const { fetchJson, getSiteUrl, json, requireSupabaseUser } = require('./_server-utils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, { error: 'Billing portal is not configured.' });
  }

  const auth = await requireSupabaseUser(req);
  if (auth.error) return json(res, auth.status, { error: auth.error });

  const subscriptionsUrl = new URL(`${auth.supabaseUrl}/rest/v1/subscriptions`);
  subscriptionsUrl.searchParams.set('select', 'stripe_customer_id');
  subscriptionsUrl.searchParams.set('user_id', `eq.${auth.user.id}`);
  subscriptionsUrl.searchParams.set('order', 'updated_at.desc');
  subscriptionsUrl.searchParams.set('limit', '1');

  const result = await fetchJson(subscriptionsUrl.toString(), {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  const customerId = Array.isArray(result.body) ? result.body[0]?.stripe_customer_id : null;
  if (!result.response.ok || !customerId) {
    return json(res, 404, { error: 'No billing account found.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover',
  });
  const siteUrl = getSiteUrl(req);
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/dashboard/definicoes`,
  });

  return json(res, 200, { url: session.url });
};
