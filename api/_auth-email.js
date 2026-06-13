const { createClient } = require('@supabase/supabase-js');
const { getSiteUrl } = require('./_server-utils');

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

const validateEmail = (email) => {
  const domain = email.split('@')[1] || '';
  return Boolean(email && EMAIL_PATTERN.test(email) && !COMMON_DOMAIN_FIXES.has(domain));
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const makeRequestId = () =>
  `cj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const getServerConfig = () => ({
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.RESEND_FROM_EMAIL || 'no-reply@cuidarjuntos.pt',
});

const hasServerConfig = (config) =>
  Boolean(config.supabaseUrl && config.serviceRoleKey && config.resendApiKey && config.fromEmail);

const createSupabaseAdmin = (config) =>
  createClient(config.supabaseUrl, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

const findUserByEmail = async (supabaseAdmin, email) => {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return { error };

    const users = data?.users || [];
    const user = users.find((item) => normalizeEmail(item.email) === email);
    if (user) return { user };
    if (users.length < 1000) return { user: null };
  }

  return { user: null };
};

const isEmailConfirmed = (user) => Boolean(user?.email_confirmed_at || user?.confirmed_at);

const getActionLink = async ({ supabaseAdmin, type, email, password, name, redirectTo }) => {
  const params = {
    type,
    email,
    options: {
      redirectTo,
    },
  };

  if (password) params.password = password;
  if (name) {
    params.options.data = {
      full_name: name,
    };
  }

  const { data, error } = await supabaseAdmin.auth.admin.generateLink(params);
  if (error) return { error };

  const actionLink = data?.properties?.action_link;
  if (!actionLink) return { error: new Error('missing_action_link') };
  return { actionLink };
};

const buildConfirmationEmail = ({ actionLink, name, requestId }) => {
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
                  Recebeu este email porque criou uma conta no CuidarJuntos. Se não foi você, pode ignorar este email.<br>
                  Referência: ${escapeHtml(requestId)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  return {
    subject,
    previewText,
    html,
    text: `${previewText}\n\nConfirme a sua conta: ${actionLink}\n\nReferência: ${requestId}`,
  };
};

const sendConfirmationEmail = async ({ config, email, actionLink, name, requestId }) => {
  const message = buildConfirmationEmail({ actionLink, name, requestId });
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `CuidarJuntos <${config.fromEmail}>`,
      to: email,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { error: new Error(errorText || 'resend_rejected') };
  }

  return { ok: true };
};

const getRedirectTo = (req) => `${getSiteUrl(req)}/entrar?confirmed=1`;

module.exports = {
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
};
