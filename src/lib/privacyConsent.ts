export type PrivacyConsentChoice = 'essential' | 'metrics';

export interface PrivacyConsentRecord {
  version: 1;
  choice: PrivacyConsentChoice;
  metrics: boolean;
  decidedAt: string;
}

export const PRIVACY_CONSENT_KEY = 'cuidarjuntos-privacy-consent-v1';
export const PRIVACY_CONSENT_EVENT = 'cuidarjuntos:open-privacy-preferences';

export const getPrivacyConsent = (): PrivacyConsentRecord | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PRIVACY_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PrivacyConsentRecord;
    if (parsed?.version !== 1 || typeof parsed.metrics !== 'boolean') return null;
    return parsed;
  } catch {
    return null;
  }
};

export const savePrivacyConsent = (choice: PrivacyConsentChoice): PrivacyConsentRecord => {
  const record: PrivacyConsentRecord = {
    version: 1,
    choice,
    metrics: choice === 'metrics',
    decidedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent('cuidarjuntos:privacy-consent-changed', { detail: record }));
  return record;
};

export const openPrivacyPreferences = () => {
  window.dispatchEvent(new Event(PRIVACY_CONSENT_EVENT));
};
