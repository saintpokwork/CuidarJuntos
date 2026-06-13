import { describe, expect, it } from 'vitest';
import { getEmailValidationKey, getFriendlyAuthErrorKey, normalizeEmail } from './authValidation';

describe('authValidation', () => {
  it('normalizes email before auth requests', () => {
    expect(normalizeEmail('  Maria@Example.COM  ')).toBe('maria@example.com');
  });

  it('blocks obvious email domain typos before signup', () => {
    expect(getEmailValidationKey('joao@gmail.cor')).toBe('auth.invalidEmailDomain');
  });

  it('blocks invalid email formats', () => {
    expect(getEmailValidationKey('joao@')).toBe('auth.invalidEmailFormat');
  });

  it('accepts normal email addresses', () => {
    expect(getEmailValidationKey('joao@gmail.com')).toBeNull();
  });

  it('maps provider email sending failures to a friendly translation key', () => {
    expect(getFriendlyAuthErrorKey('Error sending confirmation email')).toBe('auth.confirmationEmailFailed');
    expect(getFriendlyAuthErrorKey('confirmation_email_failed')).toBe('auth.confirmationEmailFailed');
    expect(getFriendlyAuthErrorKey('resend_rejected')).toBe('auth.confirmationEmailRejected');
    expect(getFriendlyAuthErrorKey('account_already_confirmed')).toBe('auth.accountAlreadyConfirmed');
    expect(getFriendlyAuthErrorKey('account_not_found')).toBe('auth.accountNotFound');
  });
});
