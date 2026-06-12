const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const getBearerToken = (authorization = '') => {
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : '';
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const getSiteUrl = (req) => {
  const configured = process.env.REACT_APP_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'no-reply@cuidarjuntos.pt';

  if (!supabaseUrl || !supabaseAnonKey || !resendApiKey) {
    return json(res, 500, { error: 'Email service is not configured.' });
  }

  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return json(res, 401, { error: 'Missing session.' });
  }

  const payload = req.body || {};
  const invitedEmail = String(payload.invitedEmail || '').trim().toLowerCase();
  const invitedName = String(payload.invitedName || '').trim();
  const careProfileId = String(payload.careProfileId || '').trim();
  const inviteToken = String(payload.token || '').trim();
  const role = String(payload.role || '').trim();
  const relationship = String(payload.relationship || '').trim();

  if (!invitedEmail || !careProfileId || !inviteToken) {
    return json(res, 400, { error: 'Missing invite details.' });
  }

  const authHeaders = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${token}`,
  };

  const userResult = await fetchJson(`${supabaseUrl}/auth/v1/user`, { headers: authHeaders });
  if (!userResult.response.ok || !userResult.body?.id) {
    return json(res, 401, { error: 'Invalid session.' });
  }

  const membershipUrl = new URL(`${supabaseUrl}/rest/v1/care_profile_members`);
  membershipUrl.searchParams.set('select', 'id');
  membershipUrl.searchParams.set('care_profile_id', `eq.${careProfileId}`);
  membershipUrl.searchParams.set('user_id', `eq.${userResult.body.id}`);
  membershipUrl.searchParams.set('role', 'eq.admin');
  membershipUrl.searchParams.set('status', 'eq.active');

  const membershipResult = await fetchJson(membershipUrl.toString(), { headers: authHeaders });
  if (!membershipResult.response.ok || !Array.isArray(membershipResult.body) || membershipResult.body.length === 0) {
    return json(res, 403, { error: 'Only care profile admins can send invites.' });
  }

  const siteUrl = getSiteUrl(req);
  const inviteLink = `${siteUrl}/aceitar-convite?token=${encodeURIComponent(inviteToken)}`;
  const greeting = invitedName ? `Olá ${escapeHtml(invitedName)},` : 'Olá,';
  const previewText = 'Foi convidado para colaborar num círculo de cuidado no CuidarJuntos.';
  const subject = 'Convite para CuidarJuntos';
  const roleText = role ? `<p><strong>Função:</strong> ${escapeHtml(role)}</p>` : '';
  const relationshipText = relationship ? `<p><strong>Relação:</strong> ${escapeHtml(relationship)}</p>` : '';

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
                  <h1 style="font-size:24px;line-height:1.25;margin:0 0 16px;color:#20352d;">Convite para colaborar no cuidado</h1>
                  <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">${greeting}</p>
                  <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Foi convidado para entrar num círculo de cuidado no CuidarJuntos, onde a família pode organizar medicamentos, consultas, tarefas, documentos e contactos importantes.</p>
                  ${roleText}
                  ${relationshipText}
                  <p style="margin:28px 0;">
                    <a href="${inviteLink}" style="display:inline-block;background:#165c46;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px;">Aceitar convite</a>
                  </p>
                  <p style="font-size:14px;line-height:1.6;color:#5f6f68;margin:0;">Se o botão não funcionar, copie este link para o navegador:<br><a href="${inviteLink}" style="color:#165c46;word-break:break-all;">${inviteLink}</a></p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 32px;background:#fbf8f3;color:#6e6258;font-size:12px;line-height:1.5;">
                  Recebeu este email porque alguém o convidou para colaborar no CuidarJuntos. Se não esperava este convite, pode ignorar este email.
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
      to: invitedEmail,
      subject,
      html,
      text: `${previewText}\n\nAceite o convite: ${inviteLink}`,
    }),
  });

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text();
    console.error('[send-invite] Resend error:', errorText);
    return json(res, 502, { error: 'Could not send invite email.' });
  }

  return json(res, 200, { ok: true });
};
