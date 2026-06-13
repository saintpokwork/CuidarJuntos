const { json } = require('./_server-utils');
const {
  createSupabaseAdmin,
  findUserByEmail,
  getActionLink,
  getRedirectTo,
  getServerConfig,
  hasServerConfig,
  isEmailConfirmed,
  makeRequestId,
  normalizeEmail,
  parseBody,
  sendConfirmationEmail,
  validateEmail,
} = require('./_auth-email');

const logError = (requestId, step, error) => {
  console.error(`[resend-confirmation] ${requestId} ${step}:`, error?.message || error);
};

module.exports = async (req, res) => {
  const requestId = makeRequestId();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'method_not_allowed', requestId });
  }

  const config = getServerConfig();
  if (!hasServerConfig(config)) {
    return json(res, 500, { error: 'signup_not_configured', requestId });
  }

  const payload = parseBody(req.body);
  const email = normalizeEmail(payload.email);
  const name = String(payload.name || '').trim();

  if (!validateEmail(email)) {
    return json(res, 400, { error: 'invalid_email', requestId });
  }

  const supabaseAdmin = createSupabaseAdmin(config);
  const existing = await findUserByEmail(supabaseAdmin, email);

  if (existing.error) {
    logError(requestId, 'list_users_failed', existing.error);
    return json(res, 500, { error: 'supabase_lookup_failed', requestId, email });
  }

  if (!existing.user) {
    return json(res, 404, { error: 'account_not_found', requestId, email });
  }

  if (isEmailConfirmed(existing.user)) {
    return json(res, 409, { error: 'account_already_confirmed', requestId, email });
  }

  const link = await getActionLink({
    supabaseAdmin,
    type: 'magiclink',
    email,
    name,
    redirectTo: getRedirectTo(req),
  });

  if (link.error) {
    logError(requestId, 'generate_magic_link_failed', link.error);
    return json(res, 500, { error: 'supabase_link_failed', requestId, email });
  }

  const emailResult = await sendConfirmationEmail({
    config,
    email,
    actionLink: link.actionLink,
    name,
    requestId,
  });

  if (emailResult.error) {
    logError(requestId, 'resend_rejected', emailResult.error);
    return json(res, 502, { error: 'resend_rejected', requestId, email });
  }

  return json(res, 200, {
    ok: true,
    email,
    requestId,
  });
};
