import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { medications } from '../data/mockData';

const estadoStyles: Record<string, string> = {
  Ativo: 'bg-secondary-container text-on-secondary-container',
  'Em falta': 'bg-error-container text-on-error-container',
};

const Medicamentos: React.FC = () => {
  const ativos = medications.filter((m) => m.estado === 'Ativo').length;
  const emFalta = medications.filter((m) => m.estado === 'Em falta').length;

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader
          title="Medicamentos"
          showSearch={false}
          action={
            <button
              type="button"
              className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full hover:shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="text-label-md">Adicionar</span>
            </button>
          }
        />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
            {[
              { valor: ativos, label: 'Ativos', cor: 'text-primary' },
              { valor: 2, label: 'Tomados hoje', cor: 'text-secondary' },
              { valor: emFalta, label: 'Em falta', cor: 'text-error' },
              { valor: 2, label: 'Próxima hora', cor: 'text-tertiary' },
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
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span
                      className={`px-3 py-1 text-label-sm rounded-full font-bold ${
                        estadoStyles[med.estado] || 'bg-surface-container-high'
                      }`}
                    >
                      {med.estado}
                    </span>
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
                    <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-lg">info</span>
                      {med.instrucoes}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 rounded-xl bg-surface-container-low text-primary font-bold hover:bg-primary hover:text-on-primary transition-all flex justify-center items-center gap-2"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    Confirmar toma
                  </button>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-6">
                Adicionar medicamento
              </h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Nome</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Metformina"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Dosagem</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: 500mg"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Horário</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    type="time"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Frequência</label>
                  <select className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none">
                    <option>Diariamente</option>
                    <option>A cada 8 horas</option>
                    <option>Semanalmente</option>
                  </select>
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Responsável</label>
                  <select className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none">
                    <option>Ana Silva</option>
                    <option>João Fernandes</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all"
                >
                  Guardar medicamento
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
