import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { useCareData } from '../context/CareDataContext';
import OnboardingChecklist from '../components/OnboardingChecklist';
import { useLanguage } from '../i18n/LanguageContext';
import FirstRunWizard from '../components/FirstRunWizard';
import DashboardAlerts from '../components/DashboardAlerts';
import ActivityFeed from '../components/ActivityFeed';

const Dashboard: React.FC = () => {
  const { data, dashboardSummary, updateMedicationTaken } = useCareData();
  const { t } = useLanguage();
  const { medications, appointments, tasks, documents, emergencyContacts, careNotes } = data;

  const medicationsToday = medications
    .filter((m) => m.estado === 'Ativo')
    .slice(0, 2)
    .map((m) => ({
      id: m.id,
      nome: `${m.nome} ${m.dosagem}`,
      horario: m.horario.split(',')[0]?.trim() || m.horario,
      instrucoes: m.instrucoes || m.frequencia,
    }));

  const pendingTasks = tasks.filter((t) => t.status === 'por_fazer');
  const latestCareNote = careNotes[0];

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <FirstRunWizard />
          <OnboardingChecklist />
          <DashboardAlerts />

          <section className="mb-stack-lg">
            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2">{dashboardSummary.saudacao}</h1>
            <p className="text-body-lg text-on-surface-variant">{dashboardSummary.resumo}</p>
          </section>

          <section className="mb-stack-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{t('dashboard.medsToday')}</p>
                    <p className="text-headline-md font-headline-md text-on-surface">
                      {dashboardSummary.medicamentosTomadosHoje}/{dashboardSummary.totalMedicamentosHoje}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-3xl">pill</span>
                </div>
                <p className="text-label-sm text-on-surface-variant">{t('dashboard.medsTakenHint')}</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{t('dashboard.nextAppointment')}</p>
                    <p className="text-headline-md font-headline-md text-on-surface">
                      {appointments[0]?.tipo || '-'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-3xl">calendar_today</span>
                </div>
                <p className="text-label-sm text-on-surface-variant">
                  {appointments[0]?.dataHora || t('dashboard.noAppointments')}
                </p>
              </div>
              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{t('dashboard.tasksOverdue')}</p>
                    <p className="text-headline-md font-headline-md text-on-surface">
                      {dashboardSummary.tarefasAtraso}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-tertiary text-3xl">assignment_late</span>
                </div>
                <p className="text-label-sm text-on-surface-variant">{t('dashboard.tasksOverdueHint')}</p>
              </div>
              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{t('dashboard.profileCompletion')}</p>
                    <p className="text-headline-md font-headline-md text-on-surface">
                      {dashboardSummary.perfilCompletude}%
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
                <p className="text-label-sm text-on-surface-variant">{t('dashboard.profileCompletionHint')}</p>
              </div>
            </div>
          </section>

          <section className="mb-stack-lg">
            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-headline-md font-headline-md text-on-surface">{t('dashboard.nextStepsTitle')}</h3>
                  <p className="text-label-sm text-on-surface-variant">{t('dashboard.nextStepsSubtitle')}</p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
              </div>
              <ul className="space-y-3">
                {dashboardSummary.sugestoes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-stack-lg">
            <div className="flex flex-wrap gap-4">
                <Link to="/dashboard/medicamentos" className="flex items-center gap-2 px-6 py-4 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:opacity-90 transition-all scale-100 active:scale-95">
                  <span className="material-symbols-outlined">add_circle</span>
                  <span className="text-label-md">{t('dashboard.addMedication')}</span>
                </Link>
                <Link to="/dashboard/consultas" className="flex items-center gap-2 px-6 py-4 bg-secondary text-on-secondary rounded-full font-bold shadow-lg hover:opacity-90 transition-all scale-100 active:scale-95">
                  <span className="material-symbols-outlined">event</span>
                  <span className="text-label-md">{t('dashboard.scheduleAppointment')}</span>
                </Link>
                <Link to="/dashboard/tarefas" className="flex items-center gap-2 px-6 py-4 bg-surface-container-high text-primary rounded-full font-bold hover:bg-surface-container-highest transition-all">
                  <span className="material-symbols-outlined">playlist_add</span>
                  <span className="text-label-md">{t('dashboard.createTask')}</span>
                </Link>
                <Link to="/dashboard/familia" className="flex items-center gap-2 px-6 py-4 bg-primary-fixed/30 text-primary rounded-full font-bold hover:bg-cj-verde-pale transition-all">
                  <span className="material-symbols-outlined">group_add</span>
                  <span className="text-label-md">{t('dashboard.inviteFamily')}</span>
                </Link>
                <Link to="/dashboard/documentos" className="flex items-center gap-2 px-6 py-4 bg-surface-container-high text-primary rounded-full font-bold hover:bg-surface-container-highest transition-all">
                  <span className="material-symbols-outlined">upload_file</span>
                  <span className="text-label-md">{t('dashboard.uploadDocument')}</span>
                </Link>
                <Link to="/dashboard/emergencia" className="flex items-center gap-2 px-6 py-4 bg-error-container text-on-error-container rounded-full font-bold hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined">medical_services</span>
                  <span className="text-label-md">{t('dashboard.createEmergencyCard')}</span>
                </Link>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">{t('dashboard.cardMedications')}</h3>
                  <p className="text-label-sm text-on-surface-variant">{t('dashboard.cardMedsSubtitle')}</p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">pill</span>
              </div>
              {medicationsToday.length === 0 ? (
                <p className="text-label-md text-on-surface-variant py-4">{t('dashboard.noMedications')}</p>
              ) : (
                <div className="space-y-4">
                  {medicationsToday.map((med, i) => (
                    <div
                      key={med.id}
                      className={`flex items-center p-3 rounded-xl ${
                        i === 0 ? 'bg-primary-fixed/20' : 'bg-surface-container'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          i === 0
                            ? 'bg-primary text-on-primary'
                            : 'bg-outline-variant text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined">alarm</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-label-md font-bold">{med.nome}</p>
                        <p className="text-label-sm text-on-surface-variant">
                          {med.horario} • {med.instrucoes}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateMedicationTaken(med.id, true)}
                        className="min-h-11 rounded-full bg-primary px-3 text-label-sm font-bold text-on-primary"
                      >
                        {t('pages.medications.markTaken')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/dashboard/medicamentos"
                className="mt-6 flex min-h-11 w-full items-center justify-center text-center text-primary font-bold text-label-md hover:bg-primary-fixed/10 rounded-lg transition-colors"
              >
                {t('dashboard.viewFullPlan')}
              </Link>
            </div>

            <ActivityFeed />

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">{t('dashboard.cardAppointments')}</h3>
                  <p className="text-label-sm text-on-surface-variant">{t('dashboard.cardAppointmentsSubtitle')}</p>
                </div>
                <span className="material-symbols-outlined text-secondary text-3xl">calendar_today</span>
              </div>
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-secondary-container/30 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-secondary text-2xl">event_busy</span>
                  </div>
                  <p className="text-label-md font-semibold text-on-surface">{t('dashboard.noAppointments')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 2).map((apt) => (
                    <div key={apt.id} className="p-3 bg-surface-container rounded-xl">
                      <p className="text-label-md font-bold">{apt.tipo}</p>
                      <p className="text-label-sm text-on-surface-variant">{apt.dataHora}</p>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/dashboard/consultas"
                className="mt-6 flex min-h-11 w-full items-center justify-center text-center text-secondary font-bold text-label-md hover:bg-secondary-fixed/10 rounded-lg transition-colors"
              >
                {appointments.length === 0 ? t('dashboard.scheduleNewAppointment') : t('dashboard.viewAllAppointments')}
              </Link>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">{t('dashboard.cardTasks')}</h3>
                  <p className="text-label-sm text-on-surface-variant">
                    {pendingTasks.length} {t('dashboard.cardTasksSubtitle').toLowerCase()}
                  </p>
                </div>
                <span className="material-symbols-outlined text-tertiary text-3xl">assignment</span>
              </div>
              {pendingTasks.length === 0 ? (
                  <p className="text-label-md text-on-surface-variant py-4">{t('dashboard.noTasks')}</p>
              ) : (
                <div className="space-y-4">
                  {pendingTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="group flex items-start p-4 border border-outline-variant rounded-xl hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="bg-tertiary-container/10 text-tertiary p-2 rounded-lg mr-4">
                        <span className="material-symbols-outlined">shopping_cart</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-label-md font-bold group-hover:text-primary">{task.titulo}</p>
                        <p className="text-label-sm text-on-surface-variant">
                          {task.local} • {task.prioridade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/dashboard/tarefas"
                className="mt-6 flex min-h-11 w-full items-center justify-center text-center text-on-surface-variant font-bold text-label-md hover:bg-surface-container-highest rounded-lg transition-colors"
              >
                {t('dashboard.viewAllTasks')}
              </Link>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">{t('dashboard.cardDocuments')}</h3>
                  <p className="text-label-sm text-on-surface-variant">{t('dashboard.cardDocumentsSubtitle')}</p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">description</span>
              </div>
              {documents.length === 0 ? (
                <p className="text-label-md text-on-surface-variant py-4">{t('dashboard.noDocuments')}</p>
              ) : (
                <div className="space-y-3">
                  {documents.slice(0, 2).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary">
                        {doc.titulo.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-label-md font-medium truncate">{doc.titulo}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          {doc.dataAdicao}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/dashboard/documentos"
                className="mt-4 inline-flex min-h-11 items-center text-primary font-bold text-label-sm"
              >
                {t('dashboard.viewAllDocuments')} →
              </Link>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">{t('dashboard.cardContacts')}</h3>
                  <p className="text-label-sm text-on-surface-variant">{t('dashboard.cardContactsSubtitle')}</p>
                </div>
                <span className="material-symbols-outlined text-error text-3xl">emergency</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {emergencyContacts.slice(0, 2).map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3 bg-error-container/10 rounded-2xl flex flex-col items-center text-center"
                  >
                    {contact.avatar ? (
                      <img
                        alt={contact.nome}
                        className="w-12 h-12 rounded-full mb-2 object-cover border-2 border-white"
                        src={contact.avatar}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full mb-2 bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                        {contact.nome.charAt(0)}
                      </div>
                    )}
                    <p className="text-label-sm font-bold truncate w-full">{contact.nome}</p>
                    <p className="text-[10px] text-on-surface-variant">{contact.funcao}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/dashboard/emergencia"
                className="mt-4 block text-center text-error font-bold text-label-sm"
              >
                {t('dashboard.viewEmergency')}
              </Link>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow soft-shadow-hover transition-all border border-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">{t('dashboard.cardNotes')}</h3>
                  <p className="text-label-sm text-on-surface-variant">{t('dashboard.cardNotesSubtitle')}</p>
                </div>
                <span className="material-symbols-outlined text-tertiary text-3xl">event_note</span>
              </div>
              {latestCareNote ? (
                <div className="bg-tertiary-fixed/30 p-4 rounded-xl rotate-1">
                  <p className="text-body-md italic text-on-tertiary-fixed-variant">
                    &ldquo;{latestCareNote.nota}&rdquo;
                  </p>
                </div>
              ) : (
                <p className="text-label-md text-on-surface-variant py-4">{t('dashboard.noNotes')}</p>
              )}
              <Link
                to="/dashboard/notas"
                className="mt-4 flex justify-end text-primary font-bold text-label-sm items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">edit</span> {t('dashboard.viewAllNotes')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
