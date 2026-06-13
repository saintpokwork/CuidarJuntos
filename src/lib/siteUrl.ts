const CANONICAL_SITE_URL = 'https://cuidarjuntos.pt';

export const getPublicSiteUrl = () => {
  const configured = import.meta.env.REACT_APP_PUBLIC_SITE_URL || import.meta.env.VITE_PUBLIC_SITE_URL || '';
  if (configured) return configured.replace(/\/$/, '');

  if (typeof window === 'undefined') return CANONICAL_SITE_URL;

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return window.location.origin;
  if (host === 'cuidarjuntos.pt' || host === 'www.cuidarjuntos.pt') return CANONICAL_SITE_URL;
  if (host.endsWith('.vercel.app')) return CANONICAL_SITE_URL;

  return window.location.origin;
};
