import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../i18n/LanguageContext';
import { useCareData } from '../context/CareDataContext';

const Notas: React.FC = () => {
  const { data, addCareNote, removeCareNote } = useCareData();
  const { t } = useLanguage();
  const { careNotes } = data;
  const [texto, setTexto] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = addCareNote(texto);
    if (!ok) {
      setErro('Escreva uma nota antes de guardar.');
      return;
    }
    setErro('');
    setTexto('');
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title={t('pages.notes.title')} showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">
            Atualizações partilhadas sobre o cuidado diário.
          </p>

          <form
            className="glass-card rounded-[24px] p-4 soft-shadow border border-white/40 mb-4 flex flex-col gap-2"
            onSubmit={handleSubmit}
          >
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-body-md placeholder-on-surface-variant resize-none min-h-[48px]"
                    placeholder={t('pages.notes.placeholder') || 'Escreva uma atualização sobre o cuidado de hoje...'}
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="shrink-0 w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            {erro && <p className="text-label-sm text-error px-2">{erro}</p>}
          </form>

                {careNotes.length === 0 ? (
                  <EmptyState message={t('pages.notes.empty')} icon="event_note" />
                ) : (
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
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="px-3 py-1 bg-primary-fixed/30 text-primary rounded-full text-label-sm font-bold">
                          Mais recente
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeCareNote(note.id)}
                        className="p-1 rounded-full hover:bg-error-container/30 text-error transition-colors"
                        aria-label="Remover nota"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-body-md text-on-surface leading-relaxed pl-[52px]">{note.nota}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Notas;
