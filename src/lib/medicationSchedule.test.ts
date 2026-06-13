import { describe, expect, it } from 'vitest';
import { buildIntervalTimes, buildMedicationDoses, buildMedicationTimes, getDoseStatusTiming } from './medicationSchedule';

describe('medicationSchedule', () => {
  it('builds custom fixed daily times', () => {
    expect(buildMedicationTimes({ scheduleType: 'daily_times', fixedTimes: ['20:00', '08:00', 'bad'] })).toEqual(['08:00', '20:00']);
  });

  it('builds interval schedules from a start time', () => {
    expect(buildIntervalTimes('06:30', 8, 3)).toEqual(['06:30', '14:30', '22:30']);
  });

  it('builds doses from stored medication times', () => {
    expect(buildMedicationDoses({ id: 'med-1', horario: '08:00, 20:00' })).toEqual([
      { id: 'med-1-08:00', horario: '08:00', status: 'por_tomar' },
      { id: 'med-1-20:00', horario: '20:00', status: 'por_tomar' },
    ]);
  });

  it('classifies due and overdue doses', () => {
    const now = new Date('2026-06-13T08:10:00');
    expect(getDoseStatusTiming('08:00', 'por_tomar', now)).toBe('due');
    expect(getDoseStatusTiming('07:30', 'por_tomar', now)).toBe('overdue');
    expect(getDoseStatusTiming('09:00', 'por_tomar', now)).toBe('upcoming');
  });
});
