const { createClient } = require('@supabase/supabase-js');
const { getSiteUrl, json } = require('./_server-utils');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COMMON_DOMAIN_FIXES = new Set([
  'gmail.cor',
  'gmail.con',
  'gmail.cim',
  'gmai.com',
  'gmial.com',
  'hotmial.com',
  'hotmai.com',
  'outlok.com',
]);

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
};

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const isLikelyDuplicate = (message = '') => {
  const normalized = message.toLowerCase();
  return normalized.includes('already registered') || normalized.includes('already exists') || normalized.includes('user already');
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'method_not_allowed' });
  }

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'no-reply@cuidarjuntos.pt';

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !fromEmail) {
    return json(res, 500, { error: 'signup_not_configured' });
  }

  const payload = parseBody(req.body);
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');
  const name = String(payload.name || '').trim();
  const domain = email.split('@')[1] || '';

  if (!email || !EMAIL_PATTERN.test(email) || COMMON_DOMAIN_FIXES.has(domain)) {
    return json(res, 400, { error: 'invalid_email' });
  }
  if (password.length < 6) {
    return json(res, 400, { error: 'weak_password' });
  }

  const siteUrl = getSiteUrl(req);
  const redirectTo = `${siteUrl}/entrar?confirmed=1`;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      redirectTo,
    },
  });

  if (error) {
    console.error('[create-account] Supabase generateLink error:', error.message);
    return json(res, isLikelyDuplicate(error.message) ? 409 : 400, {
      error: isLikelyDuplicate(error.message) ? 'account_exists' : 'signup_failed',
      email,
    });
  }

  const actionLink = data?.properties?.action_link;
  if (!actionLink) {
    console.error('[create-account] Supabase generateLink did not return action_link.');
    return json(res, 500, { error: 'signup_failed', email });
  }

  const greeting = name ? `Olá ${escapeHtml(name)},` : 'Olá,';
  const subject = 'Confirme a sua conta CuidarJuntos';
  const previewText = 'Confirme o seu email para começar a guardar os cuidados da família com segurança.';
  const html = `<!doctype html>
  <html lang="pt">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${subject}</title>
    </head>
    <body style="margin:0;background:#f5efe6;font-family:Arial,Helvetica,sans-serif;color:#20352d;">
      <span style="display:none;opacity:0;visibility:hidden">${previewText}</span>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5efe6;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #eadfd1;">
              <tr>
                <td style="background:#165c46;padding:28px 32px;color:#ffffff;">
                  <div style="font-size:24px;font-weight:700;letter-spacing:.2px;">CuidarJuntos</div>
                  <div style="font-size:14px;margin-top:6px;color:#dbece5;">Organização familiar para cuidar melhor</div>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <h1 style="font-size:24px;line-height:1.25;margin:0 0 16px;color:#20352d;">Confirme a sua conta</h1>
                  <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">${greeting}</p>
                  <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Use o botão abaixo para confirmar o email e começar a guardar medicamentos, consultas, documentos e tarefas da família com segurança.</p>
                  <p style="margin:28px 0;">
                    <a href="${actionLink}" style="display:inline-block;background:#165c46;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px;">Confirmar conta</a>
                  </p>
                  <p style="font-size:14px;line-height:1.6;color:#5f6f68;margin:0;">Se o botão não funcionar, copie este link para o navegador:<br><a href="${actionLink}" style="color:#165c46;word-break:break-all;">${actionLink}</a></p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 32px;background:#fbf8f3;color:#6e6258;font-size:12px;line-height:1.5;">
                  Recebeu este email porque criou uma conta no CuidarJuntos. Se não foi você, pode ignorar este email.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `CuidarJuntos <${fromEmail}>`,
      to: email,
      subject,
      html,
      text: `${previewText}\n\nConfirme a sua conta: ${actionLink}`,
    }),
  });

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text();
    console.error('[create-account] Resend error:', errorText);
    return json(res, 502, { error: 'confirmation_email_failed', email });
  }

  return json(res, 200, {
    ok: true,
    requiresEmailConfirmation: true,
    email,
  });
};
