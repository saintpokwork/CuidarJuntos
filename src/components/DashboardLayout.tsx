import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/dashboard', label: 'Painel', icon: 'dashboard' },
  { path: '/dashboard', label: 'Perfil', icon: 'person' },
  { path: '/dashboard', label: 'Medicamentos', icon: 'pill' },
  { path: '/dashboard', label: 'Consultas', icon: 'calendar_today' },
  { path: '/dashboard', label: 'Tarefas', icon: 'assignment' },
  { path: '/dashboard', label: 'Documentos', icon: 'description' },
  { path: '/dashboard', label: 'Emergência', icon: 'emergency' },
  { path: '/dashboard', label: 'Família', icon: 'group' },
  { path: '/dashboard', label: 'Notas', icon: 'event_note' },
  { path: '/dashboard', label: 'Definições', icon: 'settings' },
];

const mobileNavItems = [
  { path: '/dashboard', label: 'Início', icon: 'home' },
  { path: '/dashboard', label: 'Meds', icon: 'pill' },
  { path: '/dashboard', label: 'Consultas', icon: 'calendar_today' },
  { path: '/dashboard', label: 'Tarefas', icon: 'assignment' },
  { path: '/dashboard', label: 'Mais', icon: 'more_horiz' },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="h-screen w-64 hidden lg:flex flex-col sticky left-0 top-0 bg-surface-container shadow-sm py-stack-md px-base">
        <div className="px-4 mb-stack-lg">
          <Link to="/" className="text-headline-md font-headline-md font-bold text-primary">
            CuidarJuntos
          </Link>
          <p className="text-on-surface-variant text-label-sm">Responsável familiar</p>
        </div>
        <nav className="flex-1 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path && index === 0
                  ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined mr-3">{item.icon}</span>
              <span className="text-label-md">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-high">
            <img
              alt="Ana Silva"
              className="w-10 h-10 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrPXztbyOYTTQCl760tVuMOIgwXU_Ea-JCTvkNgmleAvT1--BeaWO8k0vsTXLp55H0GT-vTKPWV-3UjDypVHRHCKrKcBEkf290KL7xHl8eRIU6viBI0fXvEHd1uY4wGmYbvILh2kW5BNytoETMzHRsxgNQNAqEaB8B_SjHRmAnFdnulJEce6ql7Ag8eaAXm6QauRVuLwMCr49ax72MqarTFft8T7eeNcVy51Rrz85bacw5syFK3MTcQQckKMhkgyJS9jRPBZZXTZxx"
            />
            <div className="overflow-hidden">
              <p className="text-label-md font-bold text-on-surface truncate">Ana Silva</p>
              <p className="text-[10px] text-on-surface-variant uppercase">Responsável familiar</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative min-w-0">
        {children}
        <nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface shadow-[0_-4px_24px_rgba(0,93,172,0.04)] rounded-t-xl">
          {mobileNavItems.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                location.pathname === item.path && index === 0
                  ? 'bg-primary-container text-on-primary-container px-4 py-1 scale-90 shadow-md'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-label-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
