import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../i18n/LanguageContext';
import { useCareData } from '../context/CareDataContext';
import { caregiver } from '../data/initialData';
import HelpTip from '../components/HelpTip';
import type { MedicationDoseStatus, MedicationUnit } from '../context/CareDataContext';

const Medicamentos: React.FC = () => {
  const { data, addMedication, removeMedication, updateMedicationTaken, updateMedicationDoseStatus } = useCareData();
  const { t } = useLanguage();
  const { medications } = data;
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [unidade, setUnidade] = useState<MedicationUnit>('mg');
  const [horario, setHorario] = useState('');
  const [frequencia, setFrequencia] = useState(t('pages.medications.daily'));
  const [responsavel, setResponsavel] = useState(caregiver.nome);
  const [dataFim, setDataFim] = useState('');
  const [erro, setErro] = useState('');

  const medsAtivos = medications.filter((m) => m.estado === 'Ativo');
  const takenHoje = medsAtivos.filter((m) => m.tomadoHoje).length;
  const emFalta = medications.filter((m) => m.estado === 'Em falta').length;
  const proximosHorarios = medsAtivos
    .filter((m) => !m.tomadoHoje)
    .flatMap((m) => m.horario.split(',').map((item) => item.trim()))
    .filter((item) => /^\d{2}:\d{2}$/.test(item))
    .sort();
  const nextMedicationTime = proximosHorarios[0] || t('pages.medications.noTime');
  const todayDoses = medsAtivos.flatMap((med) =>
    (med.dosesHoje || []).map((dose) => ({
      ...dose,
      medicationId: med.id,
      medicationName: med.nome,
      dosage: med.dosagem,
      responsible: med.responsavel,
    })),
  );
  const doseStatusLabel: Record<MedicationDoseStatus, string> = {
    por_tomar: t('pages.medications.pending'),
    tomado: t('pages.medications.takenToday'),
    em_falta: t('pages.medications.missed'),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = addMedication({ nome, dosagem, unidade, horario, frequencia, responsavel, dataFim });
    if (!ok) {
      setErro(t('pages.medications.validation'));
      return;
    }
    setErro('');
    setNome('');
    setDosagem('');
    setHorario('');
    setFrequencia(t('pages.medications.daily'));
    setDataFim('');
  };

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
                {todayDoses.map((dose) => (
                  <div key={dose.id} className="rounded-2xl bg-surface-container-low p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-label-md font-bold text-on-surface">{dose.medicationName} {dose.dosage}</p>
                        <p className="text-label-sm text-on-surface-variant">{dose.horario} · {dose.responsible}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                        dose.status === 'tomado'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : dose.status === 'em_falta'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {doseStatusLabel[dose.status]}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateMedicationDoseStatus(dose.medicationId, dose.id, 'tomado')}
                        className="min-h-11 rounded-full bg-primary px-3 text-label-sm font-bold text-on-primary"
                      >
                        {t('pages.medications.markTaken')}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateMedicationDoseStatus(dose.medicationId, dose.id, 'em_falta')}
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
              { valor: emFalta, label: t('dashboard.outOfStock') || t('dashboard.noTasks'), cor: 'text-error' },
              { valor: nextMedicationTime, label: t('dashboard.nextMedicationTime') || t('dashboard.nextAppointment'), cor: 'text-tertiary' },
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
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.schedule')} *</label>
                  <input
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    type="time"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">{t('pages.medications.frequency')} *</label>
                  <select
                    value={frequencia}
                    onChange={(e) => setFrequencia(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option>{t('pages.medications.daily')}</option>
                    <option>{t('pages.medications.everyEightHours')}</option>
                    <option>{t('pages.medications.weekly')}</option>
                  </select>
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
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Medicamentos;
