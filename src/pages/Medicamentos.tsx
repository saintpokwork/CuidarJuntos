import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import EmptyState from '../components/EmptyState';
import { useCareData } from '../context/CareDataContext';
import { caregiver } from '../data/initialData';

const estadoStyles: Record<string, string> = {
  Ativo: 'bg-secondary-container text-on-secondary-container',
  'Em falta': 'bg-error-container text-on-error-container',
};

const Medicamentos: React.FC = () => {
  const { data, addMedication, removeMedication } = useCareData();
  const { medications } = data;
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState('');
  const [frequencia, setFrequencia] = useState('Diariamente');
  const [responsavel, setResponsavel] = useState(caregiver.nome);
  const [erro, setErro] = useState('');

  const ativos = medications.filter((m) => m.estado === 'Ativo').length;
  const emFalta = medications.filter((m) => m.estado === 'Em falta').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = addMedication({ nome, dosagem, horario, frequencia, responsavel });
    if (!ok) {
      setErro('Preencha nome, dosagem, horário e frequência.');
      return;
    }
    setErro('');
    setNome('');
    setDosagem('');
    setHorario('');
    setFrequencia('Diariamente');
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader title="Medicamentos" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
            {[
              { valor: ativos, label: 'Ativos', cor: 'text-primary' },
              { valor: medications.length, label: 'Total', cor: 'text-secondary' },
              { valor: emFalta, label: 'Em falta', cor: 'text-error' },
              { valor: ativos, label: 'Próxima hora', cor: 'text-tertiary' },
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
                <EmptyState message="Ainda não há medicamentos registados." icon="medication" />
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
                              estadoStyles[med.estado] || 'bg-surface-container-high'
                            }`}
                          >
                            {med.estado}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMedication(med.id)}
                            className="p-1 rounded-full hover:bg-error-container/30 text-error transition-colors"
                            aria-label="Remover medicamento"
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
                        className="w-full py-3 rounded-xl bg-surface-container-low text-primary font-bold hover:bg-primary hover:text-on-primary transition-all flex justify-center items-center gap-2"
                      >
                        <span className="material-symbols-outlined">check_circle</span>
                        Confirmar toma
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-6">
                Adicionar medicamento
              </h3>
              {erro && (
                <p className="text-label-sm text-error mb-4 p-3 bg-error-container/20 rounded-xl">{erro}</p>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Nome *</label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Metformina"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Dosagem *</label>
                  <input
                    value={dosagem}
                    onChange={(e) => setDosagem(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: 500mg"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Horário *</label>
                  <input
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    type="time"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Frequência *</label>
                  <select
                    value={frequencia}
                    onChange={(e) => setFrequencia(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option>Diariamente</option>
                    <option>A cada 8 horas</option>
                    <option>Semanalmente</option>
                  </select>
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
