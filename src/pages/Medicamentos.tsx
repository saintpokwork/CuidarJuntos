import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../i18n/LanguageContext';
import { useCareData } from '../context/CareDataContext';
import { caregiver } from '../data/initialData';
import HelpTip from '../components/HelpTip';
import {
  buildMedicationTimes,
  getMedicationDoseTimeline,
  type MedicationScheduleType,
} from '../lib/medicationSchedule';
import type { MedicationAdministration, MedicationDoseStatus, MedicationForm, MedicationRoute, MedicationUnit } from '../context/CareDataContext';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const Medicamentos: React.FC = () => {
  const { data, addMedication, removeMedication, updateMedicationTaken, updateMedicationDoseStatus, loadMedicationAdministrationHistory } = useCareData();
  const { t } = useLanguage();
  const { medications } = data;
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [unidade, setUnidade] = useState<MedicationUnit>('mg');
  const [forma, setForma] = useState<MedicationForm>('comprimido');
  const [via, setVia] = useState<MedicationRoute>('oral');
  const [instrucoes, setInstrucoes] = useState('');
  const [scheduleType, setScheduleType] = useState<MedicationScheduleType>('daily_times');
  const [fixedTimes, setFixedTimes] = useState(['08:00']);
  const [periods, setPeriods] = useState<string[]>(['morning']);
  const [startTime, setStartTime] = useState('08:00');
  const [intervalHours, setIntervalHours] = useState(8);
  const [dosesPerDay, setDosesPerDay] = useState(3);
  const [weekdays, setWeekdays] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [responsavel, setResponsavel] = useState(caregiver.nome);
  const [dataFim, setDataFim] = useState('');
  const [erro, setErro] = useState('');
  const [marStartDate, setMarStartDate] = useState(getTodayKey());
  const [marEndDate, setMarEndDate] = useState(getTodayKey());
  const [marHistory, setMarHistory] = useState<MedicationAdministration[]>([]);
  const [marLoading, setMarLoading] = useState(false);

  const medsAtivos = medications.filter((m) => m.estado === 'Ativo');
  const takenHoje = medsAtivos.flatMap((m) => m.dosesHoje || []).filter((dose) => dose.status === 'tomado').length;
  const emFalta = medications.filter((m) => m.estado === 'Em falta').length;
  const proximosHorarios = medsAtivos
    .filter((m) => !m.tomadoHoje)
    .flatMap((m) => m.horario.split(',').map((item) => item.trim()))
    .filter((item) => /^\d{2}:\d{2}$/.test(item))
    .sort();
  const nextMedicationTime = proximosHorarios[0] || t('pages.medications.noTime');
  const todayDoses = getMedicationDoseTimeline(medsAtivos);
  const overdueDoses = todayDoses.filter((item) => item.timing === 'overdue' || item.timing === 'missed').length;
  const nextDose = todayDoses.find((item) => item.dose.status === 'por_tomar');
  const doseStatusLabel: Record<MedicationDoseStatus, string> = {
    por_tomar: t('pages.medications.pending'),
    tomado: t('pages.medications.takenToday'),
    em_falta: t('pages.medications.missed'),
  };
  const timingLabel: Record<string, string> = {
    upcoming: t('pages.medications.upcoming'),
    due: t('pages.medications.dueNow'),
    overdue: t('pages.medications.overdue'),
    taken: t('pages.medications.takenToday'),
    missed: t('pages.medications.missed'),
    pending: t('pages.medications.pending'),
  };
  const weekOptions = [
    ['1', t('pages.medications.weekdays.mon')],
    ['2', t('pages.medications.weekdays.tue')],
    ['3', t('pages.medications.weekdays.wed')],
    ['4', t('pages.medications.weekdays.thu')],
    ['5', t('pages.medications.weekdays.fri')],
    ['6', t('pages.medications.weekdays.sat')],
    ['0', t('pages.medications.weekdays.sun')],
  ];
  const periodOptions = [
    ['morning', t('pages.medications.periods.morning')],
    ['afternoon', t('pages.medications.periods.afternoon')],
    ['evening', t('pages.medications.periods.evening')],
    ['bedtime', t('pages.medications.periods.bedtime')],
  ];

  const scheduleTimes = buildMedicationTimes({
    scheduleType,
    fixedTimes,
    periods,
    startTime,
    intervalHours,
    dosesPerDay,
  });
  const frequencia =
    scheduleType === 'day_periods'
      ? t('pages.medications.scheduleTypes.dayPeriods')
      : scheduleType === 'interval_hours'
        ? t('pages.medications.everyXHours').replace('{hours}', String(intervalHours))
        : scheduleType === 'weekdays'
          ? `${t('pages.medications.scheduleTypes.weekdays')}: ${weekdays.map((day) => weekOptions.find(([value]) => value === day)?.[1]).filter(Boolean).join(', ')}`
          : scheduleType === 'as_needed'
            ? t('pages.medications.scheduleTypes.asNeeded')
            : t('pages.medications.daily');
  const horario = scheduleType === 'as_needed' ? 'PRN' : scheduleTimes.join(', ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalInstructions = [
      forma ? `${t('pages.medications.form')}: ${t(`pages.medications.forms.${forma}`)}` : '',
      via ? `${t('pages.medications.route')}: ${t(`pages.medications.routes.${via}`)}` : '',
      instrucoes.trim(),
      scheduleType === 'as_needed' ? t('pages.medications.asNeededNote') : '',
    ].filter(Boolean).join(' · ');
    const ok = addMedication({ nome, dosagem, unidade, forma, via, horario, frequencia, responsavel, dataFim, instrucoes: finalInstructions });
    if (!ok) {
      setErro(t('pages.medications.validation'));
      return;
    }
    setErro('');
    setNome('');
    setDosagem('');
    setInstrucoes('');
    setFixedTimes(['08:00']);
    setScheduleType('daily_times');
    setDataFim('');
  };

  const toggleValue = (value: string, values: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const isTodayRange = marStartDate === getTodayKey() && marEndDate === getTodayKey();
  const liveMarRows = useMemo<MedicationAdministration[]>(
    () => todayDoses.map((item) => ({
      id: `${item.medicationId}-${item.dose.id}`,
      medicationId: item.medicationId,
      medicationName: item.medicationName,
      dosage: item.dosage,
      scheduledDate: getTodayKey(),
      scheduledTime: item.dose.horario,
      status: item.dose.status,
      instructions: item.instructions,
      markedBy: item.dose.markedBy,
      markedAt: item.dose.markedAt,
      notes: item.dose.note,
    })),
    [todayDoses],
  );
  const marRows = isTodayRange && marHistory.length === 0 ? liveMarRows : marHistory;

  useEffect(() => {
    let active = true;
    setMarLoading(true);
    loadMedicationAdministrationHistory(marStartDate, marEndDate)
      .then((rows) => {
        if (active) setMarHistory(rows);
      })
      .finally(() => {
        if (active) setMarLoading(false);
      });
    return () => {
      active = false;
    };
  }, [marStartDate, marEndDate, loadMedicationAdministrationHistory]);

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title={t('pages.medications.title')} showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <HelpTip text={t('pages.medications.help')} />
          {todayDoses.length > 0 && (
            <section className="mb-stack-lg rounded-[24px] border border-cj-border bg-cj-branco p-5 soft-shadow">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-headline-md font-headline-md text-on-surface">{t('pages.medications.todayTitle')}</h2>
                  <p className="text-label-sm text-on-surface-variant">{t('pages.medications.todaySubtitle')}</p>
                </div>
                <span className="rounded-full bg-cj-verde-pale px-3 py-1 text-label-sm font-bold text-primary">
                  {takenHoje}/{todayDoses.length}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {todayDoses.map((item) => (
                  <div key={`${item.medicationId}-${item.dose.id}`} className="rounded-2xl bg-surface-container-low p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-label-md font-bold text-on-surface">{item.medicationName} {item.dosage}</p>
                        <p className="text-label-sm text-on-surface-variant">{item.dose.horario} · {item.responsible}</p>
                        {item.instructions && <p className="mt-1 text-label-sm text-on-surface-variant">{item.instructions}</p>}
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                        item.dose.status === 'tomado'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : item.timing === 'overdue' || item.dose.status === 'em_falta'
                            ? 'bg-error-container text-on-error-container'
                            : item.timing === 'due'
                              ? 'bg-cj-terra/10 text-cj-terra'
                              : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {item.dose.status === 'por_tomar' ? timingLabel[item.timing] : doseStatusLabel[item.dose.status]}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateMedicationDoseStatus(item.medicationId, item.dose.id, 'tomado')}
                        className="min-h-11 rounded-full bg-primary px-3 text-label-sm font-bold text-on-primary"
                      >
                        {t('pages.medications.markTaken')}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateMedicationDoseStatus(item.medicationId, item.dose.id, 'em_falta')}
                        className="min-h-11 rounded-full bg-error-container px-3 text-label-sm font-bold text-on-error-container"
                      >
                        {t('pages.medications.markMissed')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
            {[
              { valor: medsAtivos.length, label: t('dashboard.medsToday'), cor: 'text-primary' },
              { valor: takenHoje, label: t('dashboard.takenToday') || t('dashboard.medsToday'), cor: 'text-secondary' },
              { valor: overdueDoses || emFalta, label: t('pages.medications.overdue'), cor: 'text-error' },
              { valor: nextDose?.dose.horario || nextMedicationTime, label: t('dashboard.nextMedicationTime') || t('dashboard.nextAppointment'), cor: 'text-tertiary' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-center soft-shadow"
              >
                <span className={`text-headline-md font-bold ${stat.cor}`}>{stat.valor}</span>
                <span className="text-label-sm text-on-surface-variant">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {medications.length === 0 ? (
                <EmptyState message={t('pages.medications.empty')} icon="medication" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      className="glass-card p-6 rounded-3xl soft-shadow border border-white/40 flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-headline-md font-headline-md text-on-surface">{med.nome}</h3>
                          <p className="text-label-sm text-on-surface-variant">
                            {med.dosagem} • {med.frequencia}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 text-label-sm rounded-full font-bold ${
                              med.tomadoHoje
                                ? 'bg-cj-verde-pale text-cj-verde'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {med.tomadoHoje ? t('pages.medications.takenToday') : t('pages.medications.pending')}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMedication(med.id)}
                            className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-error-container/30 text-error transition-colors"
                            aria-label={t('pages.medications.remove')}
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 flex-grow">
                        <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                          {med.horario}
                        </div>
                        <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary text-lg">person</span>
                          {med.responsavel}
                        </div>
                        {med.instrucoes && (
                          <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
                            <span className="material-symbols-outlined text-primary text-lg">info</span>
                            {med.instrucoes}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => updateMedicationTaken(med.id, !med.tomadoHoje)}
                        className={`w-full py-3 rounded-xl font-bold transition-all ${
                          med.tomadoHoje
                            ? 'bg-surface-container-high text-on-surface'
                            : 'bg-primary text-on-primary hover:opacity-90'
                        }`}
                      >
                        {med.tomadoHoje ? t('pages.medications.unmark') : t('pages.medications.markTaken')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-6">
                {t('pages.medications.formTitle')}
              </h3>
              {erro && (
                <p className="text-label-sm text-error mb-4 p-3 bg-error-container/20 rounded-xl">{erro}</p>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.name')} *</label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder={t('pages.medications.namePlaceholder')}
                  />
                </div>
                <div className="grid grid-cols-[1fr_140px] gap-3">
                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.dosage')} *</label>
                    <input
                      value={dosagem}
                      onChange={(e) => setDosagem(e.target.value)}
                      className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder={t('pages.medications.dosagePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.unit')}</label>
                    <select
                      value={unidade}
                      onChange={(e) => setUnidade(e.target.value as MedicationUnit)}
                      className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="comprimidos">{t('pages.medications.units.tablets')}</option>
                      <option value="mg">{t('pages.medications.units.mg')}</option>
                      <option value="ml">{t('pages.medications.units.ml')}</option>
                      <option value="gotas">{t('pages.medications.units.drops')}</option>
                      <option value="unidades">{t('pages.medications.units.units')}</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.form')}</label>
                    <select
                      value={forma}
                      onChange={(e) => setForma(e.target.value as MedicationForm)}
                      className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="comprimido">{t('pages.medications.forms.comprimido')}</option>
                      <option value="capsula">{t('pages.medications.forms.capsula')}</option>
                      <option value="gotas">{t('pages.medications.forms.gotas')}</option>
                      <option value="xarope">{t('pages.medications.forms.xarope')}</option>
                      <option value="inalador">{t('pages.medications.forms.inalador')}</option>
                      <option value="injecao">{t('pages.medications.forms.injecao')}</option>
                      <option value="creme">{t('pages.medications.forms.creme')}</option>
                      <option value="outro">{t('pages.medications.forms.outro')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.route')}</label>
                    <select
                      value={via}
                      onChange={(e) => setVia(e.target.value as MedicationRoute)}
                      className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="oral">{t('pages.medications.routes.oral')}</option>
                      <option value="topica">{t('pages.medications.routes.topica')}</option>
                      <option value="inalada">{t('pages.medications.routes.inalada')}</option>
                      <option value="injetavel">{t('pages.medications.routes.injetavel')}</option>
                      <option value="outra">{t('pages.medications.routes.outra')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.scheduleType')} *</label>
                  <select
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value as MedicationScheduleType)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="daily_times">{t('pages.medications.scheduleTypes.dailyTimes')}</option>
                    <option value="day_periods">{t('pages.medications.scheduleTypes.dayPeriods')}</option>
                    <option value="interval_hours">{t('pages.medications.scheduleTypes.intervalHours')}</option>
                    <option value="weekdays">{t('pages.medications.scheduleTypes.weekdays')}</option>
                    <option value="as_needed">{t('pages.medications.scheduleTypes.asNeeded')}</option>
                  </select>
                </div>
                {scheduleType === 'daily_times' && (
                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.timesPerDay')}</label>
                    <div className="space-y-2">
                      {fixedTimes.map((time, index) => (
                        <div key={`${index}-${time}`} className="flex gap-2">
                          <input
                            value={time}
                            onChange={(e) => setFixedTimes((prev) => prev.map((item, itemIndex) => itemIndex === index ? e.target.value : item))}
                            className="h-12 flex-1 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                            type="time"
                          />
                          <button
                            type="button"
                            onClick={() => setFixedTimes((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}
                            className="min-h-12 min-w-12 rounded-full bg-surface-container-high text-on-surface"
                            aria-label={t('pages.medications.removeTime')}
                          >
                            <span className="material-symbols-outlined">remove</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFixedTimes((prev) => [...prev, '20:00'])}
                      className="mt-2 rounded-full border border-primary px-4 py-2 text-label-sm font-bold text-primary"
                    >
                      {t('pages.medications.addTime')}
                    </button>
                  </div>
                )}
                {scheduleType === 'day_periods' && (
                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-2">{t('pages.medications.periodsLabel')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {periodOptions.map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleValue(value, periods, setPeriods)}
                          className={`min-h-11 rounded-full border px-3 text-label-sm font-bold ${periods.includes(value) ? 'border-primary bg-primary text-on-primary' : 'border-cj-border bg-surface text-on-surface'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {scheduleType === 'interval_hours' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.startTime')}</label>
                      <input value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" type="time" />
                    </div>
                    <div>
                      <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.intervalHours')}</label>
                      <input value={intervalHours} min={1} max={24} onChange={(e) => setIntervalHours(Number(e.target.value))} className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" type="number" />
                    </div>
                    <div>
                      <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.dosesPerDay')}</label>
                      <input value={dosesPerDay} min={1} max={8} onChange={(e) => setDosesPerDay(Number(e.target.value))} className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" type="number" />
                    </div>
                  </div>
                )}
                {scheduleType === 'weekdays' && (
                  <div>
                    <label className="text-label-sm font-bold text-on-surface block mb-2">{t('pages.medications.weekdaysLabel')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {weekOptions.map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleValue(value, weekdays, setWeekdays)}
                          className={`min-h-11 rounded-full border px-3 text-label-sm font-bold ${weekdays.includes(value) ? 'border-primary bg-primary text-on-primary' : 'border-cj-border bg-surface text-on-surface'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.schedule')}</label>
                      <input value={fixedTimes[0] || '08:00'} onChange={(e) => setFixedTimes([e.target.value])} className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" type="time" />
                    </div>
                  </div>
                )}
                {scheduleType === 'as_needed' && (
                  <p className="rounded-2xl bg-cj-verde-pale p-3 text-label-sm text-primary">{t('pages.medications.asNeededHelp')}</p>
                )}
                {scheduleType !== 'as_needed' && (
                  <p className="rounded-2xl bg-surface-container-low p-3 text-label-sm text-on-surface-variant">
                    {t('pages.medications.generatedTimes')}: <span className="font-bold text-on-surface">{horario || t('pages.medications.noTime')}</span>
                  </p>
                )}
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.instructions')}</label>
                  <textarea
                    value={instrucoes}
                    onChange={(e) => setInstrucoes(e.target.value)}
                    className="w-full min-h-24 px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder={t('pages.medications.instructionsPlaceholder')}
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.responsible')}</label>
                  <select
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option>Ana Silva</option>
                    <option>João Fernandes</option>
                  </select>
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.endDate')}</label>
                  <input
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    type="date"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all"
                >
                  {t('pages.medications.save')}
                </button>
              </form>
            </div>
          </div>
          <section className="mt-stack-lg rounded-[24px] border border-cj-border bg-cj-branco p-5 soft-shadow">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-label-sm font-bold uppercase tracking-[0.14em] text-primary">MAR</p>
                <h2 className="text-headline-md font-headline-md text-on-surface">{t('pages.medications.marTitle')}</h2>
                <p className="text-label-sm text-on-surface-variant">{t('pages.medications.marSubtitle')}</p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-label-sm font-bold text-on-surface">
                    {t('pages.medications.marFrom')}
                    <input value={marStartDate} onChange={(e) => setMarStartDate(e.target.value)} type="date" className="mt-1 h-11 w-full rounded-xl border border-outline-variant bg-surface px-3 font-normal" />
                  </label>
                  <label className="text-label-sm font-bold text-on-surface">
                    {t('pages.medications.marTo')}
                    <input value={marEndDate} onChange={(e) => setMarEndDate(e.target.value)} type="date" className="mt-1 h-11 w-full rounded-xl border border-outline-variant bg-surface px-3 font-normal" />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary px-4 text-label-sm font-bold text-primary"
                >
                  <span className="material-symbols-outlined mr-2 text-[18px]">print</span>
                  {t('pages.medications.printMar')}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-label-sm text-on-surface-variant">
                    <th className="px-3 py-2">{t('pages.medications.marDate')}</th>
                    <th className="px-3 py-2">{t('pages.medications.marTime')}</th>
                    <th className="px-3 py-2">{t('pages.medications.marMedication')}</th>
                    <th className="px-3 py-2">{t('pages.medications.marInstruction')}</th>
                    <th className="px-3 py-2">{t('pages.medications.marStatus')}</th>
                    <th className="px-3 py-2">{t('pages.medications.marMarkedBy')}</th>
                  </tr>
                </thead>
                <tbody>
                  {marLoading ? (
                    <tr>
                      <td colSpan={6} className="rounded-2xl bg-surface-container-low px-3 py-5 text-label-md text-on-surface-variant">
                        {t('global.loading')}
                      </td>
                    </tr>
                  ) : marRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="rounded-2xl bg-surface-container-low px-3 py-5 text-label-md text-on-surface-variant">
                        {t('pages.medications.marEmpty')}
                      </td>
                    </tr>
                  ) : marRows.map((item) => (
                    <tr key={`mar-${item.id}`} className="bg-surface-container-low">
                      <td className="rounded-l-2xl px-3 py-3 text-label-sm text-on-surface-variant">{item.scheduledDate}</td>
                      <td className="px-3 py-3 text-label-md font-bold text-on-surface">{item.scheduledTime}</td>
                      <td className="px-3 py-3 text-label-md text-on-surface">{item.medicationName} {item.dosage}</td>
                      <td className="px-3 py-3 text-label-sm text-on-surface-variant">{item.instructions || '—'}</td>
                      <td className="px-3 py-3 text-label-sm font-bold text-on-surface">{doseStatusLabel[item.status]}</td>
                      <td className="rounded-r-2xl px-3 py-3 text-label-sm text-on-surface-variant">
                        {item.markedBy ? `${item.markedBy} · ${item.markedAt || ''}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Medicamentos;
