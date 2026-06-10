import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { caregiver } from '../data/initialData';
import { useCareData } from '../context/CareDataContext';
import GuideBanner from './GuideBanner';
import CuidarJuntosLogo from './brand/CuidarJuntosLogo';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/dashboard', label: 'Painel', icon: 'dashboard', exact: true },
  { path: '/dashboard/guia', label: 'Guia rápido', icon: 'menu_book', exact: false },
  { path: '/dashboard/perfil', label: 'Perfil', icon: 'person', exact: false },
  { path: '/dashboard/medicamentos', label: 'Medicamentos', icon: 'pill', exact: false },
  { path: '/dashboard/consultas', label: 'Consultas', icon: 'calendar_today', exact: false },
  { path: '/dashboard/tarefas', label: 'Tarefas', icon: 'assignment', exact: false },
  { path: '/dashboard/documentos', label: 'Documentos', icon: 'description', exact: false },
  { path: '/dashboard/emergencia', label: 'Emergência', icon: 'emergency', exact: false },
  { path: '/dashboard/familia', label: 'Família', icon: 'group', exact: false },
  { path: '/dashboard/notas', label: 'Notas', icon: 'event_note', exact: false },
  { path: '/dashboard/definicoes', label: 'Definições', icon: 'settings', exact: false },
];

const mobileNavItems = [
  { path: '/dashboard', label: 'Início', icon: 'home', exact: true },
  { path: '/dashboard/medicamentos', label: 'Medic.', icon: 'pill', exact: false },
  { path: '/dashboard/consultas', label: 'Consultas', icon: 'calendar_today', exact: false },
  { path: '/dashboard/tarefas', label: 'Tarefas', icon: 'assignment', exact: false },
  { path: '/dashboard/mais', label: 'Mais', icon: 'more_horiz', exact: false, maisGroup: true },
];

const maisPaths = [
  '/dashboard/mais',
  '/dashboard/guia',
  '/dashboard/perfil',
  '/dashboard/documentos',
  '/dashboard/emergencia',
  '/dashboard/familia',
  '/dashboard/notas',
  '/dashboard/definicoes',
];

const isActive = (pathname: string, path: string, exact: boolean, maisGroup?: boolean) => {
  if (maisGroup) return maisPaths.includes(pathname);
  return exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { resetDemoData } = useCareData();

  const handleResetDemo = () => {
    const confirmar = window.confirm(
      'Tem a certeza que pretende repor os dados de demonstração? Todas as alterações locais serão perdidas.'
    );
    if (confirmar) resetDemoData();
  };

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <aside className="h-screen w-64 hidden lg:flex flex-col sticky left-0 top-0 bg-cj-sidebar shadow-cj-md py-stack-md px-base shrink-0">
        <div className="px-4 mb-stack-lg">
          <Link to="/dashboard" className="block">
            <CuidarJuntosLogo variant="white" size="md" />
          </Link>
          <p className="text-white/50 text-label-sm mt-3">{caregiver.funcao}</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(location.pathname, item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'text-white font-bold border-r-4 border-cj-cobre bg-white/10'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                }`}
              >
                <span className="material-symbols-outlined mr-3">{item.icon}</span>
                <span className="text-label-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/10">
            <img alt={caregiver.nome} className="w-10 h-10 rounded-full object-cover" src={caregiver.avatar} />
            <div className="overflow-hidden">
              <p className="text-label-md font-bold text-white truncate">{caregiver.nome}</p>
              <p className="text-[10px] text-white/50 uppercase">{caregiver.funcao}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative min-w-0 overflow-x-hidden">
        <div className="lg:hidden bg-cj-sidebar px-container-padding-mobile py-3 flex items-center justify-between no-print">
          <Link to="/dashboard">
            <CuidarJuntosLogo variant="white" size="sm" />
          </Link>
          <Link to="/" className="text-label-sm text-white/60 hover:text-white">
            Início
          </Link>
        </div>

        <GuideBanner />

        <div className="bg-cj-verde-pale border-b border-cj-border px-container-padding-mobile md:px-container-padding-desktop py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-label-sm text-on-surface-variant">
          <p className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">info</span>
            Está a utilizar uma versão demo. Os dados ficam guardados apenas neste navegador.
          </p>
          <button
            type="button"
            onClick={handleResetDemo}
            className="text-primary font-bold hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            Repor demo
          </button>
        </div>

        <div className="flex-1 pb-28 lg:pb-0">{children}</div>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-2 bg-cj-branco shadow-[0_-4px_24px_rgba(45,106,82,0.08)] rounded-t-xl border-t border-cj-border safe-bottom">
          {mobileNavItems.map((item) => {
            const active = isActive(location.pathname, item.path, item.exact, item.maisGroup);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center min-w-[56px] p-2 rounded-xl transition-all ${
                  active
                    ? 'bg-primary text-on-primary px-3 py-1 shadow-cj-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
