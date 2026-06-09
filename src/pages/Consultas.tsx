import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import EmptyState from '../components/EmptyState';
import { useCareData } from '../context/CareDataContext';
import { caregiver } from '../data/initialData';

const Consultas: React.FC = () => {
  const { data, addAppointment, removeAppointment } = useCareData();
  const { appointments } = data;
  const [tipo, setTipo] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [local, setLocal] = useState('');
  const [medico, setMedico] = useState('');
  const [responsavel, setResponsavel] = useState(caregiver.nome);
  const [notas, setNotas] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = addAppointment({ tipo, dataHora, local, medico, responsavel, notas });
    if (!ok) {
      setErro('Preencha título, data/hora e local.');
      return;
    }
    setErro('');
    setTipo('');
    setDataHora('');
    setLocal('');
    setMedico('');
    setNotas('');
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader title="Consultas e exames" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">
            Agenda partilhada para toda a família cuidadora.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {appointments.length === 0 ? (
                <EmptyState message="Ainda não há consultas marcadas." icon="event_busy" />
              ) : (
                appointments.map((apt) => (
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
                      <div className="flex items-center gap-2 self-start">
                        <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-bold">
                          {apt.estado}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAppointment(apt.id)}
                          className="p-2 rounded-full hover:bg-error-container/30 text-error transition-colors"
                          aria-label="Remover consulta"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                    {apt.notas && (
                      <div className="mt-4 p-3 bg-warm-beige rounded-xl">
                        <p className="text-label-sm text-on-surface-variant">
                          <span className="font-bold">Notas:</span> {apt.notas}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-6">Marcar consulta</h3>
              {erro && (
                <p className="text-label-sm text-error mb-4 p-3 bg-error-container/20 rounded-xl">{erro}</p>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Título *</label>
                  <input
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Consulta de cardiologia"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Data e hora *</label>
                  <input
                    value={dataHora}
                    onChange={(e) => setDataHora(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    type="datetime-local"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Local *</label>
                  <input
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Hospital de Santa Maria"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Médico / Serviço</label>
                  <input
                    value={medico}
                    onChange={(e) => setMedico(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Dr. Roberto Santos"
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
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Notas</label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
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
