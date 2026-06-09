import React from 'react';
import { Link } from 'react-router-dom';
import { useCareData } from '../context/CareDataContext';

interface CheckItem {
  id: string;
  label: string;
  done: boolean;
  path: string;
}

const OnboardingChecklist: React.FC = () => {
  const { data } = useCareData();
  const { medications, appointments, tasks, familyMembers } = data;

  const emergencyViewed =
    typeof window !== 'undefined' &&
    localStorage.getItem('cuidarjuntos-emergency-viewed') === 'true';

  const items: CheckItem[] = [
    { id: 'perfil', label: 'Completar perfil do familiar', done: true, path: '/dashboard/perfil' },
    {
      id: 'medicamento',
      label: 'Adicionar primeiro medicamento',
      done: medications.length > 0,
      path: '/dashboard/medicamentos',
    },
    {
      id: 'consulta',
      label: 'Marcar próxima consulta',
      done: appointments.length > 0,
      path: '/dashboard/consultas',
    },
    {
      id: 'tarefa',
      label: 'Criar primeira tarefa',
      done: tasks.length > 0,
      path: '/dashboard/tarefas',
    },
    {
      id: 'emergencia',
      label: 'Rever ficha de emergência',
      done: emergencyViewed,
      path: '/dashboard/emergencia',
    },
    {
      id: 'familia',
      label: 'Convidar familiar',
      done: familyMembers.some((m) => m.estado === 'Convite enviado'),
      path: '/dashboard/familia',
    },
  ];

  const completed = items.filter((i) => i.done).length;
  const progress = Math.round((completed / items.length) * 100);

  return (
    <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-stack-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-headline-md font-headline-md text-on-surface">Configuração inicial</h2>
          <p className="text-label-sm text-on-surface-variant mt-1">
            {completed} de {items.length} passos concluídos ({progress}%)
          </p>
        </div>
        <Link
          to="/dashboard/guia"
          className="px-5 py-2.5 bg-surface-container-low text-primary font-bold rounded-full text-label-sm hover:bg-surface-container-high transition-all text-center"
        >
          Ver guia rápido
        </Link>
      </div>

      <div className="w-full h-2 bg-surface-container-low rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-secondary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
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
                {item.label}
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
