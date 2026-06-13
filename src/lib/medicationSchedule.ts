import type { Medication, MedicationDose, MedicationDoseStatus } from '../data/initialData';

export type MedicationScheduleType = 'daily_times' | 'day_periods' | 'interval_hours' | 'weekdays' | 'as_needed';

export const periodTimes: Record<string, string> = {
  morning: '08:00',
  afternoon: '13:00',
  evening: '19:00',
  bedtime: '22:00',
};

export const normaliseTime = (value: string) => value.trim();

export const parseMedicationTimes = (value?: string) =>
  (value || '')
    .split(',')
    .map(normaliseTime)
    .filter((item) => /^\d{2}:\d{2}$/.test(item))
    .sort();

export const buildIntervalTimes = (startTime: string, intervalHours: number, dosesPerDay: number) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes) || intervalHours <= 0 || dosesPerDay <= 0) return [];

  return Array.from({ length: Math.min(dosesPerDay, 8) }, (_, index) => {
    const totalMinutes = hours * 60 + minutes + index * intervalHours * 60;
    const dayMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const hh = Math.floor(dayMinutes / 60).toString().padStart(2, '0');
    const mm = (dayMinutes % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }).sort();
};

export const buildMedicationTimes = (input: {
  scheduleType: MedicationScheduleType;
  fixedTimes?: string[];
  periods?: string[];
  startTime?: string;
  intervalHours?: number;
  dosesPerDay?: number;
}) => {
  if (input.scheduleType === 'day_periods') {
    return (input.periods || []).map((period) => periodTimes[period]).filter(Boolean).sort();
  }

  if (input.scheduleType === 'interval_hours') {
    return buildIntervalTimes(input.startTime || '08:00', input.intervalHours || 8, input.dosesPerDay || 3);
  }

  if (input.scheduleType === 'as_needed') {
    return [];
  }

  return (input.fixedTimes || []).map(normaliseTime).filter((item) => /^\d{2}:\d{2}$/.test(item)).sort();
};

export const getDoseId = (medicationId: string, horario: string) => `${medicationId}-${horario}`;

export const buildMedicationDoses = (m: Pick<Medication, 'id' | 'horario'>, status: MedicationDoseStatus = 'por_tomar'): MedicationDose[] =>
  parseMedicationTimes(m.horario).map((horario) => ({
    id: getDoseId(m.id, horario),
    horario,
    status,
  }));

export const getDoseStatusTiming = (horario: string, status: MedicationDoseStatus, now = new Date()) => {
  if (status === 'tomado') return 'taken';
  if (status === 'em_falta') return 'missed';

  const [hours, minutes] = horario.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 'pending';

  const due = new Date(now);
  due.setHours(hours, minutes, 0, 0);
  const diffMinutes = Math.round((due.getTime() - now.getTime()) / 60000);

  if (diffMinutes < -15) return 'overdue';
  if (diffMinutes <= 30) return 'due';
  return 'upcoming';
};

export const getNextMedicationDose = (medications: Medication[], now = new Date()) =>
  medications
    .filter((med) => med.estado === 'Ativo')
    .flatMap((med) =>
      (med.dosesHoje || []).map((dose) => ({
        medication: med,
        dose,
        timing: getDoseStatusTiming(dose.horario, dose.status, now),
      })),
    )
    .filter((item) => item.dose.status === 'por_tomar')
    .sort((a, b) => a.dose.horario.localeCompare(b.dose.horario))[0];

export const getMedicationDoseTimeline = (medications: Medication[], now = new Date()) =>
  medications
    .filter((med) => med.estado === 'Ativo')
    .flatMap((med) =>
      (med.dosesHoje || []).map((dose) => ({
        medicationId: med.id,
        medicationName: med.nome,
        dosage: med.dosagem,
        instructions: med.instrucoes,
        responsible: med.responsavel,
        dose,
        timing: getDoseStatusTiming(dose.horario, dose.status, now),
      })),
    )
    .sort((a, b) => a.dose.horario.localeCompare(b.dose.horario));
