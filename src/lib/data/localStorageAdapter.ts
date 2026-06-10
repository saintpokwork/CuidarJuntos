import type { CareData } from './types';

const STORAGE_KEY = 'cuidarjuntos-care-data';

export const loadCareData = (): CareData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as CareData;
  } catch {
    return null;
  }
};

export const saveCareData = (data: CareData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const downloadCareData = (data: CareData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cuidarjuntos-dados-demo-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const isCareDataShape = (value: unknown): value is CareData => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.medications) &&
    Array.isArray(candidate.appointments) &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.documents) &&
    Array.isArray(candidate.careNotes) &&
    Array.isArray(candidate.familyMembers) &&
    Array.isArray(candidate.emergencyContacts) &&
    typeof candidate.careProfile === 'object' &&
    candidate.careProfile !== null
  );
};
