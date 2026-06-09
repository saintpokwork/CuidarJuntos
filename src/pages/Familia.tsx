import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { familyMembers } from '../data/mockData';

const roleStyles: Record<string, string> = {
  Administrador: 'bg-primary-fixed text-primary',
  Familiar: 'bg-secondary-container text-on-secondary-container',
  Cuidador: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  'Apenas leitura': 'bg-surface-container-high text-on-surface-variant',
};

const Familia: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader title="Família e cuidadores" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">
            Círculo de cuidado — todos os membros com acesso à informação partilhada.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Membros convidados</h3>
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {member.avatar ? (
                      <img
                        alt={member.nome}
                        className="w-14 h-14 rounded-full object-cover"
                        src={member.avatar}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg">
                        {member.nome.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-headline-md font-headline-md text-on-surface">{member.nome}</p>
                      <p className="text-label-md text-on-surface-variant italic">{member.relacao}</p>
                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-label-sm font-bold ${
                          roleStyles[member.funcao]
                        }`}
                      >
                        {member.funcao}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-label-sm font-bold self-start sm:self-center ${
                      member.estado === 'Ativo'
                        ? 'bg-secondary-container/50 text-on-secondary-container'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {member.estado}
                  </span>
                </div>
              ))}

              <div className="p-4 bg-primary-fixed/20 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <p className="text-label-md text-on-surface-variant">
                  <strong className="text-on-surface">Dica:</strong> Dividir as tarefas reduz o stress do
                  cuidador principal em até 40%.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Convidar membro</h3>
              <p className="text-label-md text-on-surface-variant mb-6">
                Convide alguém para ajudar no cuidado da família.
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Nome</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Carlos Mendes"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">E-mail</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="nome@cuidarjuntos.pt"
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Relação</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Irmão, Cuidador profissional"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Função</label>
                  <select className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none">
                    <option>Administrador</option>
                    <option>Familiar</option>
                    <option>Cuidador</option>
                    <option>Apenas leitura</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span>
                  Enviar convite
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Familia;
