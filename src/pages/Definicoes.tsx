import React, { useRef, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { useCareData } from '../context/CareDataContext';
import { downloadCareData, isCareDataShape } from '../lib/data/localStorageAdapter';
import { caregiver } from '../data/initialData';

const Definicoes: React.FC = () => {
  const { data, resetDemoData, importDemoData, showFeedback } = useCareData();
  const [importMessage, setImportMessage] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleReset = () => {
    const confirmar = window.confirm(
      'Tem a certeza que pretende repor os dados de demonstração? Todas as alterações locais serão perdidas.'
    );
    if (confirmar) resetDemoData();
  };

  const exportDemoData = () => {
    downloadCareData(data);
    showFeedback('Dados de demonstração descarregados.');
    setImportMessage('Dados de demonstração exportados com sucesso.');
    setImportError('');
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!isCareDataShape(parsed)) {
        throw new Error('Formato de dados inválido.');
      }
      importDemoData(parsed);
      setImportMessage('Dados importados com sucesso.');
      setImportError('');
      showFeedback('Dados de demonstração importados.');
    } catch {
      setImportError('Não foi possível importar o ficheiro. Verifique o formato JSON.');
      setImportMessage('');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openImportDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title="Definições" showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop ">
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
                  <button type="button" className="text-primary font-bold text-label-md hover:underline">
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

              <div className="bg-white p-8 rounded-[24px] soft-shadow mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-headline-md font-headline-md">Conta e sincronização</h2>
                    <p className="text-label-md text-on-surface-variant">
                      Funcionalidades de conta real e sincronização entre dispositivos estarão disponíveis em breve.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: 'Guardar dados na nuvem',
                      description: 'Disponível com contas reais.',
                      icon: 'cloud',
                    },
                    {
                      title: 'Partilhar com familiares em tempo real',
                      description: 'Disponível com contas reais.',
                      icon: 'share',
                    },
                    {
                      title: 'Acesso multi-dispositivo',
                      description: 'Disponível com contas reais.',
                      icon: 'devices',
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[24px] border border-outline-variant p-6 bg-surface-container-low opacity-90">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                        <div>
                          <p className="text-headline-sm font-headline-sm text-on-surface">{item.title}</p>
                        </div>
                      </div>
                      <p className="text-label-md text-on-surface-variant">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] soft-shadow border border-outline-variant/30">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Dados da demo</h3>
                <p className="text-label-md text-on-surface-variant mb-4">
                  Exporte ou importe os seus dados locais como ficheiro JSON. Esta funcionalidade ajuda na futura migração para contas reais.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={exportDemoData}
                    className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-all"
                  >
                    Exportar dados demo
                  </button>
                  <button
                    type="button"
                    onClick={openImportDialog}
                    className="px-6 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-all"
                  >
                    Importar dados demo
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
                {importMessage && (
                  <p className="mt-4 text-label-md text-cj-verde font-bold">{importMessage}</p>
                )}
                {importError && (
                  <p className="mt-4 text-label-md text-error font-bold">{importError}</p>
                )}
                <div className="mt-6 border-t border-outline-variant pt-6">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">restart_alt</span>
                    Repor dados de demonstração
                  </button>
                </div>
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
                        className={`w-12 h-7 rounded-full relative ${
                          item.ativo ? 'bg-primary' : 'bg-outline-variant'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow ${
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
                  Os seus dados são encriptados e armazenados localmente no seu navegador.
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
