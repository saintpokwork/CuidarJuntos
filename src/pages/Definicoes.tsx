import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { caregiver } from '../data/mockData';

const settingsSections = [
  {
    id: 'perfil',
    titulo: 'Perfil',
    descricao: 'Dados pessoais e preferências da conta',
    icon: 'person',
    cor: 'bg-primary-fixed',
  },
  {
    id: 'notificacoes',
    titulo: 'Notificações',
    descricao: 'Alertas de medicamentos, tarefas e consultas',
    icon: 'notifications',
    cor: 'bg-secondary-container',
  },
  {
    id: 'privacidade',
    titulo: 'Privacidade',
    descricao: 'Controlo de acesso e partilha de dados',
    icon: 'shield',
    cor: 'bg-surface-container-high',
  },
  {
    id: 'exportar',
    titulo: 'Exportar dados',
    descricao: 'Descarregar toda a informação da família',
    icon: 'download',
    cor: 'bg-tertiary-fixed',
  },
  {
    id: 'apagar',
    titulo: 'Apagar conta',
    descricao: 'Eliminar permanentemente todos os dados',
    icon: 'delete_forever',
    cor: 'bg-error-container',
  },
];

const Definicoes: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader title="Definições" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-32">
          <div className="mb-stack-lg p-6 rounded-[24px] bg-secondary-container/20 border-l-4 border-secondary flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary text-3xl shrink-0">info</span>
            <p className="text-body-md text-on-secondary-container italic">
              &ldquo;CuidarJuntos não substitui médicos, hospitais, farmácias ou serviços públicos de saúde.
              É uma ferramenta de organização familiar para ajudar a gerir informação, tarefas e
              lembretes.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <div className="bg-white p-8 rounded-[24px] soft-shadow mb-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <h2 className="text-headline-md font-headline-md">Perfil do cuidador</h2>
                  </div>
                  <button
                    type="button"
                    className="text-primary font-bold text-label-md hover:underline"
                  >
                    Editar
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    alt={caregiver.nome}
                    className="w-16 h-16 rounded-full object-cover"
                    src={caregiver.avatar}
                  />
                  <div>
                    <p className="text-headline-md font-headline-md text-on-surface">{caregiver.nome}</p>
                    <p className="text-label-md text-on-surface-variant">{caregiver.funcao}</p>
                    <p className="text-label-sm text-primary">ana.silva@cuidarjuntos.pt</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settingsSections.slice(1).map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className={`bg-white p-6 rounded-[24px] soft-shadow text-left hover:shadow-xl transition-all duration-300 group ${
                      section.id === 'apagar' ? 'border border-error/20' : ''
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${section.cor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          section.id === 'apagar' ? 'text-error' : 'text-primary'
                        }`}
                      >
                        {section.icon}
                      </span>
                    </div>
                    <h3
                      className={`text-headline-md font-headline-md mb-1 ${
                        section.id === 'apagar' ? 'text-error' : 'text-on-surface'
                      }`}
                    >
                      {section.titulo}
                    </h3>
                    <p className="text-label-md text-on-surface-variant">{section.descricao}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-[24px] soft-shadow">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4">Notificações</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Lembretes de medicamentos', ativo: true },
                    { label: 'Tarefas atribuídas', ativo: true },
                    { label: 'Consultas próximas', ativo: true },
                    { label: 'Notas da família', ativo: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-label-md text-on-surface">{item.label}</span>
                      <div
                        className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${
                          item.ativo ? 'bg-primary' : 'bg-outline-variant'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            item.ativo ? 'right-1' : 'left-1'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] soft-shadow">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Privacidade</h3>
                <p className="text-label-md text-on-surface-variant mb-4">
                  Os seus dados são encriptados e armazenados em servidores na União Europeia.
                </p>
                <button
                  type="button"
                  className="w-full py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
                >
                  Ver política de privacidade
                </button>
              </div>

              <p className="text-label-sm text-on-surface-variant text-center opacity-70">
                © 2024 CuidarJuntos — Feito com cuidado para famílias portuguesas.
              </p>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Definicoes;
