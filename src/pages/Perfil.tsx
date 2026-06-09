import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { careProfile } from '../data/mockData';

const Perfil: React.FC = () => {
  const fields = [
    { label: 'Data de nascimento', value: careProfile.dataNascimento, icon: 'cake' },
    { label: 'Morada', value: careProfile.morada, icon: 'home' },
    { label: 'Número SNS', value: careProfile.numeroSNS, icon: 'badge' },
    { label: 'Médico de família', value: careProfile.medicoFamilia, icon: 'medical_services' },
    { label: 'Farmácia habitual', value: careProfile.farmaciaHabitual, icon: 'local_pharmacy' },
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader title="Perfil do familiar" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <div className="glass-card rounded-[24px] p-8 soft-shadow border border-white/40 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-3xl bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined text-5xl">elderly</span>
              </div>
              <div>
                <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">
                  {careProfile.nome}
                </h2>
                <p className="text-body-md text-on-surface-variant">Familiar ao cuidado</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div key={field.label} className="p-4 bg-surface-container-low rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-xl">{field.icon}</span>
                    <p className="text-label-sm text-on-surface-variant">{field.label}</p>
                  </div>
                  <p className="text-body-md font-medium text-on-surface">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-error text-2xl">warning</span>
                <h3 className="text-headline-md font-headline-md text-on-surface">Alergias</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {careProfile.alergias.map((alergia) => (
                  <span
                    key={alergia}
                    className="px-4 py-2 bg-error-container/30 text-on-error-container rounded-full text-label-md font-medium"
                  >
                    {alergia}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">health_and_safety</span>
                <h3 className="text-headline-md font-headline-md text-on-surface">Condições importantes</h3>
              </div>
              <ul className="space-y-2">
                {careProfile.condicoes.map((condicao) => (
                  <li key={condicao} className="flex items-center gap-2 text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                    {condicao}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">contacts</span>
              <h3 className="text-headline-md font-headline-md text-on-surface">Contactos principais</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {careProfile.contactosPrincipais.map((contacto) => (
                <div
                  key={contacto.nome}
                  className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                    {contacto.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">{contacto.nome}</p>
                    <p className="text-label-sm text-on-surface-variant">{contacto.relacao}</p>
                    <p className="text-label-sm text-primary">{contacto.telefone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Perfil;
