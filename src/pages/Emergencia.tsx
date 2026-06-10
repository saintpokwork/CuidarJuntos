import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { useCareData } from '../context/CareDataContext';
import { careProfile } from '../data/initialData';
import HelpTip from '../components/HelpTip';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';

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
      <main className="flex-1 w-full relative emergency-print-area">
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
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-cj-verde-pale text-primary px-6 py-4 rounded-full font-label-md shadow-md hover:bg-surface-container-high active:scale-95 transition-all border border-cj-border"
            >
              <span className="material-symbols-outlined">picture_as_pdf</span> Exportar PDF
            </button>
            <button
              type="button"
              onClick={handlePartilhar}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-cj-terracota text-white px-6 py-4 rounded-full font-label-md shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">share</span> Partilhar
            </button>
          </section>
          <p className="text-label-sm text-on-surface-variant mb-4 no-print">
            Para exportar em PDF, clique em &ldquo;Exportar PDF&rdquo; e escolha &ldquo;Guardar como PDF&rdquo; na
            janela de impressão.
          </p>
          {partilhaMsg && (
            <p className="text-label-sm text-primary font-bold mb-4 no-print p-3 bg-cj-verde-pale rounded-xl">
              {partilhaMsg}
            </p>
          )}

          <div className="emergency-card-brand p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 border-b border-cj-border pb-4 mb-6">
              <CuidarJuntosLogo variant="icon" size="sm" />
              <div>
                <p className="text-label-sm font-bold text-cj-terra uppercase tracking-wide">CuidarJuntos</p>
                <p className="text-label-sm text-cj-cinza">Cartão de Emergência</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-8 space-y-5">
                <div>
                  <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-1">Nome</p>
                  <p className="text-headline-md font-headline-md text-cj-terra">{careProfile.nome}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-1">Data de nascimento</p>
                    <p className="text-body-lg font-medium text-cj-terra">{careProfile.dataNascimento}</p>
                  </div>
                  <div>
                    <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-1">Número SNS</p>
                    <p className="text-body-lg font-medium text-cj-terra">{careProfile.numeroSNS}</p>
                  </div>
                </div>

                <div>
                  <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cj-terracota text-base">warning</span>
                    Alergias
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {careProfile.alergias.map((a) => (
                      <span
                        key={a}
                        className="px-4 py-2 bg-error-container text-cj-terracota rounded-full text-label-md font-bold border border-cj-terracota/20"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">pill</span>
                    Medicamentos atuais
                  </p>
                  {medicamentosAtuais.length === 0 ? (
                    <p className="text-body-md text-cj-cinza">Nenhum medicamento ativo registado.</p>
                  ) : (
                    <ul className="space-y-2">
                      {medicamentosAtuais.map((med) => (
                        <li key={med} className="flex items-center gap-2 text-body-md text-cj-terra">
                          <span className="material-symbols-outlined text-cj-verde-light text-sm">medication</span>
                          {med}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-2">Notas importantes</p>
                  <p className="text-body-md text-cj-cinza leading-relaxed">
                    Paciente com diabetes e hipertensão. Em caso de desmaio, verificar glicemia. Contactar
                    sempre a filha Ana Silva em primeiro lugar.
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 space-y-5">
                <div>
                  <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-1">Médico de família</p>
                  <p className="text-label-md font-bold text-cj-terra">{careProfile.medicoFamilia}</p>
                </div>
                <div>
                  <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-1">Farmácia habitual</p>
                  <p className="text-label-md font-bold text-cj-terra">{careProfile.farmaciaHabitual}</p>
                </div>
                <div>
                  <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-1">Morada</p>
                  <p className="text-label-md font-bold text-cj-terra">{careProfile.morada}</p>
                </div>

                <div>
                  <p className="text-label-sm text-cj-cinza uppercase tracking-wide mb-3">Contactos de emergência</p>
                  <div className="space-y-3">
                    {emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-3 p-3 bg-cj-verde-pale rounded-xl border border-cj-border"
                      >
                        {contact.avatar ? (
                          <img
                            alt={contact.nome}
                            className="w-10 h-10 rounded-full object-cover"
                            src={contact.avatar}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                            {contact.nome.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-label-md font-bold text-cj-terra truncate">{contact.nome}</p>
                          <p className="text-label-sm text-cj-cinza">{contact.funcao}</p>
                          <p className="text-label-sm text-primary font-medium">{contact.telefone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-cj-border text-label-sm text-cj-cinza">
              cuidarjuntos.pt · Atualizado: {new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Emergencia;
