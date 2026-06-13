const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const getBearerToken = (authorization = '') => {
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : '';
};

const getSiteUrl = (req) => {
  const configured = process.env.REACT_APP_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (String(host || '').endsWith('.vercel.app')) return 'https://cuidarjuntos.pt';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
};

const requireSupabaseUser = async (req) => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const token = getBearerToken(req.headers.authorization);

  if (!supabaseUrl || !supabaseAnonKey) {
    return { error: 'Supabase is not configured.', status: 500 };
  }
  if (!token) {
    return { error: 'Missing session.', status: 401 };
  }

  const result = await fetchJson(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!result.response.ok || !result.body?.id) {
    return { error: 'Invalid session.', status: 401 };
  }

  return { user: result.body, token, supabaseUrl, supabaseAnonKey };
};

module.exports = {
  fetchJson,
  getBearerToken,
  getSiteUrl,
  json,
  requireSupabaseUser,
};
