import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { appointments } from '../data/mockData';

const Consultas: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader
          title="Consultas e exames"
          showSearch={false}
          action={
            <button
              type="button"
              className="hidden md:flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-full hover:shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="text-label-md">Marcar consulta</span>
            </button>
          }
        />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">
            Agenda partilhada para toda a família cuidadora.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-secondary-container text-2xl">
                          event
                        </span>
                      </div>
                      <div>
                        <h3 className="text-headline-md font-headline-md text-on-surface mb-1">
                          {apt.tipo}
                        </h3>
                        <p className="text-label-md text-primary font-medium mb-2">{apt.dataHora}</p>
                        <div className="space-y-1 text-label-sm text-on-surface-variant">
                          <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {apt.local}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">medical_services</span>
                            {apt.medico}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">person</span>
                            Responsável: {apt.responsavel}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-bold self-start">
                      {apt.estado}
                    </span>
                  </div>
                  {apt.notas && (
                    <div className="mt-4 p-3 bg-warm-beige rounded-xl">
                      <p className="text-label-sm text-on-surface-variant">
                        <span className="font-bold">Notas:</span> {apt.notas}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-6">Marcar consulta</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">
                    Tipo de consulta
                  </label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Consulta de cardiologia"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Data e hora</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    type="datetime-local"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Local</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Hospital de Santa Maria"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">
                    Médico / Serviço
                  </label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Dr. Roberto Santos"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Responsável</label>
                  <select className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none">
                    <option>Ana Silva</option>
                    <option>João Fernandes</option>
                  </select>
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Notas</label>
                  <textarea
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Instruções ou lembretes..."
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-secondary text-on-secondary font-bold rounded-full shadow-lg hover:opacity-90 transition-all"
                >
                  Guardar consulta
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Consultas;
