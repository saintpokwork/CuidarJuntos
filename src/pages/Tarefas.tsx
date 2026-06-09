import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { tasks, TaskStatus } from '../data/mockData';

const columns: { status: TaskStatus; label: string; cor: string }[] = [
  { status: 'por_fazer', label: 'Por fazer', cor: 'bg-error' },
  { status: 'em_progresso', label: 'Em progresso', cor: 'bg-primary' },
  { status: 'concluido', label: 'Concluído', cor: 'bg-secondary' },
];

const prioridadeStyles: Record<string, string> = {
  Urgente: 'bg-error-container text-on-error-container',
  Média: 'bg-primary-fixed/30 text-primary',
  Baixa: 'bg-surface-container-high text-on-surface-variant',
};

const Tarefas: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader
          title="Tarefas da família"
          showSearch={false}
          action={
            <button
              type="button"
              className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="text-label-md">Criar tarefa</span>
            </button>
          }
        />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">
            Gerir as responsabilidades diárias com calma e clareza.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.status);
              return (
                <section key={col.status} className="space-y-stack-md">
                  <div className="flex items-center justify-between px-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${col.cor}`} />
                      <h3 className="text-headline-md font-headline-md">{col.label}</h3>
                    </div>
                    <span className="bg-surface-container-highest px-3 py-1 rounded-full text-label-sm font-bold">
                      {colTasks.length}
                    </span>
                  </div>
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="glass-card p-5 rounded-2xl task-card-shadow border border-white/40 hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-label-md font-bold text-on-surface">{task.titulo}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prioridadeStyles[task.prioridade]
                          }`}
                        >
                          {task.prioridade}
                        </span>
                      </div>
                      <div className="space-y-1 text-label-sm text-on-surface-variant">
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">person</span>
                          {task.responsavel}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {task.dataLimite}
                        </p>
                        {task.local && (
                          <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {task.local}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Tarefas;
