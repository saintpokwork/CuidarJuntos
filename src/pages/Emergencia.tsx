import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { useCareData } from '../context/CareDataContext';
import { careProfile } from '../data/initialData';
import HelpTip from '../components/HelpTip';

const Emergencia: React.FC = () => {
  const { data, getEmergencySummary, showFeedback } = useCareData();
  const { medications, emergencyContacts } = data;
  const [partilhaMsg, setPartilhaMsg] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('cuidarjuntos-emergency-viewed', 'true');
    } catch {
      /* ignorar */
    }
  }, []);

  const medicamentosAtuais = medications
    .filter((m) => m.estado === 'Ativo')
    .map((m) => `${m.nome} ${m.dosagem}`);

  const handleExportPdf = () => {
    showFeedback('Na janela de impressão, escolha "Guardar como PDF".');
    setTimeout(() => window.print(), 500);
  };

  const handlePartilhar = async () => {
    const summary = getEmergencySummary();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ficha de emergência — ${careProfile.nome}`,
          text: summary,
        });
        showFeedback('Ficha partilhada com sucesso.');
      } catch {
        /* utilizador cancelou */
      }
    } else {
      try {
        await navigator.clipboard.writeText(summary);
        setPartilhaMsg('Resumo copiado para a área de transferência.');
        showFeedback('Resumo copiado para a área de transferência.');
        setTimeout(() => setPartilhaMsg(''), 4000);
      } catch {
        setPartilhaMsg('Não foi possível copiar. Tente imprimir a ficha.');
      }
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative  emergency-print-area">
        <div className="no-print">
          <DashboardPageHeader title="Ficha de emergência" showSearch={false} />
        </div>

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <div className="no-print">
            <HelpTip text="imprima esta ficha e mantenha uma cópia acessível em casa." />
          </div>
          <section className="flex flex-wrap gap-3 mb-stack-lg no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-4 rounded-full font-label-md shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">print</span> Imprimir
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-6 py-4 rounded-full font-label-md shadow-md hover:bg-surface-container-highest active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">picture_as_pdf</span> Exportar PDF
            </button>
            <button
              type="button"
              onClick={handlePartilhar}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-secondary text-on-secondary px-6 py-4 rounded-full font-label-md shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">share</span> Partilhar
            </button>
          </section>
          <p className="text-label-sm text-on-surface-variant mb-4 no-print">
            Para exportar em PDF, clique em &ldquo;Exportar PDF&rdquo; e escolha &ldquo;Guardar como PDF&rdquo; na
            janela de impressão.
          </p>
          {partilhaMsg && (
            <p className="text-label-sm text-secondary font-bold mb-4 no-print p-3 bg-secondary-container/30 rounded-xl">
              {partilhaMsg}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-8 space-y-gutter">
              <div className="emergency-gradient p-gutter rounded-[24px] text-on-primary shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 no-print">
                  <span className="material-symbols-outlined text-[120px]">emergency</span>
                </div>
                <div className="relative z-10">
                  <p className="text-label-sm uppercase tracking-wider opacity-80 mb-2">
                    Informação crítica — CuidarJuntos
                  </p>
                  <h2 className="text-headline-lg font-headline-lg mb-4">{careProfile.nome}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-label-sm opacity-80">Data de nascimento</p>
                      <p className="text-body-lg font-bold">{careProfile.dataNascimento}</p>
                    </div>
                    <div>
                      <p className="text-label-sm opacity-80">Número SNS</p>
                      <p className="text-body-lg font-bold">{careProfile.numeroSNS}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">warning</span>
                  Alergias
                </h3>
                <div className="flex flex-wrap gap-2">
                  {careProfile.alergias.map((a) => (
                    <span
                      key={a}
                      className="px-4 py-2 bg-error-container text-on-error-container rounded-full text-label-md font-bold"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">pill</span>
                  Medicamentos atuais
                </h3>
                {medicamentosAtuais.length === 0 ? (
                  <p className="text-body-md text-on-surface-variant">Nenhum medicamento ativo registado.</p>
                ) : (
                  <ul className="space-y-2">
                    {medicamentosAtuais.map((med) => (
                      <li key={med} className="flex items-center gap-2 text-body-md text-on-surface">
                        <span className="material-symbols-outlined text-secondary text-sm">medication</span>
                        {med}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">note</span>
                  Notas importantes
                </h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  Paciente com diabetes e hipertensão. Em caso de desmaio, verificar glicemia. Contactar
                  sempre a filha Ana Silva em primeiro lugar.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 space-y-gutter">
              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4">Dados de contacto</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Médico de família</p>
                    <p className="text-label-md font-bold text-on-surface">{careProfile.medicoFamilia}</p>
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Farmácia habitual</p>
                    <p className="text-label-md font-bold text-on-surface">{careProfile.farmaciaHabitual}</p>
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Morada</p>
                    <p className="text-label-md font-bold text-on-surface">{careProfile.morada}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4">
                  Contactos de emergência
                </h3>
                <div className="space-y-3">
                  {emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl"
                    >
                      {contact.avatar ? (
                        <img
                          alt={contact.nome}
                          className="w-10 h-10 rounded-full object-cover"
                          src={contact.avatar}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                          {contact.nome.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-label-md font-bold text-on-surface truncate">{contact.nome}</p>
                        <p className="text-label-sm text-on-surface-variant">{contact.funcao}</p>
                        <p className="text-label-sm text-primary">{contact.telefone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Emergencia;
