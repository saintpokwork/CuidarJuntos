export const normalizeEmail = (email: string) => email.trim().toLowerCase();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COMMON_DOMAIN_FIXES: Record<string, string> = {
  'gmail.cor': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cim': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
};

export const getEmailValidationKey = (email: string): string | null => {
  const normalized = normalizeEmail(email);
  if (!normalized) return 'global.emailRequired';
  if (!EMAIL_PATTERN.test(normalized)) return 'auth.invalidEmailFormat';

  const domain = normalized.split('@')[1] || '';
  if (COMMON_DOMAIN_FIXES[domain]) return 'auth.invalidEmailDomain';
  return null;
};

export const getFriendlyAuthErrorKey = (message?: string, fallbackKey = 'auth.errorSignUp'): string => {
  const normalized = (message || '').toLowerCase();
  if (normalized === 'invalid_email') return 'auth.invalidEmailFormat';
  if (normalized === 'weak_password') return 'global.passwordMinLength';
  if (normalized === 'confirmation_email_failed') return 'auth.confirmationEmailFailed';
  if (normalized === 'account_exists') return 'auth.accountAlreadyExists';
  if (normalized.includes('error sending confirmation')) return 'auth.confirmationEmailFailed';
  if (normalized.includes('invalid email')) return 'auth.invalidEmailFormat';
  if (normalized.includes('already registered') || normalized.includes('already exists')) return 'auth.accountAlreadyExists';
  if (normalized.includes('password')) return 'global.passwordMinLength';
  if (normalized.includes('rate')) return 'auth.rateLimited';
  return fallbackKey;
};
