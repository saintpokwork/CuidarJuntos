import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useCareData } from '../context/CareDataContext';

const OnboardingChecklist: React.FC = () => {
  const { data } = useCareData();
  const { t } = useLanguage();

  const steps = [
    {
      id: 'profile',
      path: '/dashboard/perfil',
      done: data.careProfile.nome !== '' && data.careProfile.nome !== 'Maria Fernandes',
    },
    {
      id: 'medications',
      path: '/dashboard/medicamentos',
      done: data.medications.filter((m) => m.estado === 'Ativo').length > 0,
    },
    {
      id: 'appointments',
      path: '/dashboard/consultas',
      done: data.appointments.length > 0,
    },
    {
      id: 'tasks',
      path: '/dashboard/tarefas',
      done: data.tasks.length > 0,
    },
    {
      id: 'emergency',
      path: '/dashboard/emergencia',
      done: data.emergencyContacts.length > 0,
    },
    {
      id: 'family',
      path: '/dashboard/familia',
      done: data.familyMembers.length > 0,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const total = steps.length;

  return (
    <div className="mb-stack-lg glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-headline-md font-headline-md text-on-surface">
          {t('onboarding.title')}
        </h3>
        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold">
          {doneCount} {t('onboarding.ofSteps')} {total} {t('onboarding.stepsCompleted')}
        </span>
      </div>
      <ul className="space-y-3">
        {steps.map((item) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  item.done
                    ? 'bg-secondary text-on-secondary'
                    : 'border-2 border-outline-variant text-transparent'
                }`}
              >
                {item.done && (
                  <span className="material-symbols-outlined text-sm">check</span>
                )}
              </span>
              <span
                className={`text-label-md flex-1 ${
                  item.done
                    ? 'text-on-surface-variant line-through'
                    : 'text-on-surface group-hover:text-primary'
                }`}
              >
                {t(`onboarding.steps.${item.id}`)}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-0 group-hover:opacity-100">
                chevron_right
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnboardingChecklist;