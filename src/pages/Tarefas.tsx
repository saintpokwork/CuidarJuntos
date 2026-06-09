import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import EmptyState from '../components/EmptyState';
import { useCareData, TaskStatus } from '../context/CareDataContext';
import { caregiver } from '../data/initialData';

const columns: { status: TaskStatus; label: string; cor: string }[] = [
  { status: 'por_fazer', label: 'Por fazer', cor: 'bg-error' },
  { status: 'em_progresso', label: 'Em progresso', cor: 'bg-primary' },
  { status: 'concluido', label: 'Concluído', cor: 'bg-secondary' },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'por_fazer', label: 'Por fazer' },
  { value: 'em_progresso', label: 'Em progresso' },
  { value: 'concluido', label: 'Concluído' },
];

const prioridadeStyles: Record<string, string> = {
  Urgente: 'bg-error-container text-on-error-container',
  Média: 'bg-primary-fixed/30 text-primary',
  Baixa: 'bg-surface-container-high text-on-surface-variant',
};

const Tarefas: React.FC = () => {
  const { data, addTask, removeTask, updateTaskStatus } = useCareData();
  const { tasks } = data;
  const [titulo, setTitulo] = useState('');
  const [responsavel, setResponsavel] = useState(caregiver.nome);
  const [prioridade, setPrioridade] = useState<'Baixa' | 'Média' | 'Urgente'>('Média');
  const [dataLimite, setDataLimite] = useState('');
  const [local, setLocal] = useState('');
  const [erro, setErro] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = addTask({ titulo, responsavel, prioridade, dataLimite, local });
    if (!ok) {
      setErro('Preencha o título da tarefa.');
      return;
    }
    setErro('');
    setTitulo('');
    setDataLimite('');
    setLocal('');
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader
          title="Tarefas da família"
          showSearch={false}
          action={
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
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

          {(showForm || tasks.length === 0) && (
            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-8">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-4">Criar tarefa</h3>
              {erro && (
                <p className="text-label-sm text-error mb-4 p-3 bg-error-container/20 rounded-xl">{erro}</p>
              )}
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="md:col-span-2">
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Título *</label>
                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Comprar medicamentos"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Responsável</label>
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
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as 'Baixa' | 'Média' | 'Urgente')}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Data limite</label>
                  <input
                    value={dataLimite}
                    onChange={(e) => setDataLimite(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Hoje, Até sexta-feira"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Local</label>
                  <input
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Farmácia Central"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all"
                  >
                    Guardar tarefa
                  </button>
                </div>
              </form>
            </div>
          )}

          {tasks.length === 0 ? (
            <EmptyState message="Ainda não há tarefas." icon="assignment" />
          ) : (
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
                    {colTasks.length === 0 ? (
                      <p className="text-label-sm text-on-surface-variant text-center py-4">Nenhuma tarefa</p>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="glass-card p-5 rounded-2xl task-card-shadow border border-white/40"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-label-md font-bold text-on-surface flex-1">{task.titulo}</h4>
                            <button
                              type="button"
                              onClick={() => removeTask(task.id)}
                              className="p-1 rounded-full hover:bg-error-container/30 text-error transition-colors shrink-0"
                              aria-label="Remover tarefa"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-3 ${
                              prioridadeStyles[task.prioridade]
                            }`}
                          >
                            {task.prioridade}
                          </span>
                          <div className="space-y-1 text-label-sm text-on-surface-variant mb-3">
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
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant rounded-xl text-label-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Tarefas;
