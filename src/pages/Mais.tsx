import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';

const maisLinks = [
  { path: '/dashboard/perfil', label: 'Perfil', descricao: 'Dados do familiar ao cuidado', icon: 'person' },
  { path: '/dashboard/documentos', label: 'Documentos', descricao: 'Receitas, exames e ficheiros', icon: 'description' },
  { path: '/dashboard/emergencia', label: 'Emergência', descricao: 'Ficha de emergência rápida', icon: 'emergency' },
  { path: '/dashboard/familia', label: 'Família', descricao: 'Círculo de cuidadores', icon: 'group' },
  { path: '/dashboard/notas', label: 'Notas', descricao: 'Notas de cuidado partilhadas', icon: 'event_note' },
  { path: '/dashboard/definicoes', label: 'Definições', descricao: 'Conta, privacidade e dados', icon: 'settings' },
];

const Mais: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title="Mais opções" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">
            Acesso rápido às restantes secções do painel.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {maisLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="glass-card p-6 rounded-[24px] soft-shadow border border-white/40 hover:border-primary/30 transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div>
                  <p className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  <p className="text-label-md text-on-surface-variant">{item.descricao}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant ml-auto group-hover:text-primary">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Mais;
