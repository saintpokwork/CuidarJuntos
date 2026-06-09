import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { careNotes } from '../data/mockData';

const Notas: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader title="Notas de cuidado" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">
            Atualizações partilhadas sobre o cuidado diário.
          </p>

          <div className="glass-card rounded-[24px] p-4 soft-shadow border border-white/40 mb-8 flex items-end gap-3">
            <div className="flex-1">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 text-body-md placeholder-on-surface-variant resize-none min-h-[48px]"
                placeholder="Escreva uma atualização sobre o cuidado de hoje..."
                rows={2}
              />
            </div>
            <button
              type="button"
              className="shrink-0 w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>

          <div className="space-y-4">
            {careNotes.map((note, index) => (
              <div
                key={note.id}
                className={`glass-card rounded-[24px] p-6 soft-shadow border border-white/40 ${
                  index === 0 ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                      {note.autor.charAt(0)}
                    </div>
                    <div>
                      <p className="text-label-md font-bold text-on-surface">{note.autor}</p>
                      <p className="text-label-sm text-on-surface-variant">{note.dataHora}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="px-3 py-1 bg-primary-fixed/30 text-primary rounded-full text-label-sm font-bold">
                      Mais recente
                    </span>
                  )}
                </div>
                <p className="text-body-md text-on-surface leading-relaxed pl-[52px]">{note.nota}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Notas;
