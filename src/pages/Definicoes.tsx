import React, { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { useCareData } from '../context/CareDataContext';
import { downloadCareData, isCareDataShape } from '../lib/data/localStorageAdapter';
import { caregiver } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import BillingPanel from '../components/BillingPanel';

const Definicoes: React.FC = () => {
  const { data, resetDemoData, importDemoData, showFeedback, storageMode, syncStatus, reloadCloudData } = useCareData();
  const [importMessage, setImportMessage] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (searchParams.get('upgrade') === '1' || searchParams.get('checkout')) {
      window.setTimeout(() => {
        document.getElementById('billing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleReset = () => {
    const confirmar = window.confirm(
      t('pages.settings.resetConfirmMessage')
    );
    if (confirmar) resetDemoData();
  };

  const exportDemoData = () => {
    downloadCareData(data);
    showFeedback('feedback.dataExported');
    setImportMessage(t('feedback.dataExported'));
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
      setImportMessage(t('feedback.demoImported'));
      setImportError('');
      showFeedback('feedback.demoImported');
    } catch {
      setImportError(t('feedback.dataImportError'));
      setImportMessage('');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openImportDialog = () => {
    fileInputRef.current?.click();
  };

  const handleReload = () => {
    reloadCloudData();
  };

  const isCloud = storageMode === 'cloud';
  const accountName = isCloud && user
    ? String(user.user_metadata?.full_name || user.email || caregiver.nome)
    : caregiver.nome;
  const accountRole = isCloud ? t('pages.settings.accountOwner') : caregiver.funcao;
  const accountEmail = isCloud && user ? user.email : 'ana.silva@cuidarjuntos.pt';
  const accountInitial = accountName.trim().charAt(0).toUpperCase() || 'C';

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title={t('pages.settings.title')} showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop ">
          <div className="mb-stack-lg p-6 rounded-[24px] bg-secondary-container/20 border-l-4 border-secondary flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary text-3xl shrink-0">info</span>
            <p className="text-body-md text-on-secondary-container italic">
              {t('safety.disclaimer')}
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
                    <h2 className="text-headline-md font-headline-md">{t('pages.profile.title')}</h2>
                  </div>
                  <Link to="/dashboard/perfil" className="text-primary font-bold text-label-md hover:underline">
                    {t('global.edit')}
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  {isCloud ? (
                    <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-headline-md font-bold">
                      {accountInitial}
                    </div>
                  ) : (
                    <img
                      alt={caregiver.nome}
                      className="w-16 h-16 rounded-full object-cover"
                      src={caregiver.avatar}
                    />
                  )}
                  <div>
                    <p className="text-headline-md font-headline-md text-on-surface">{accountName}</p>
                    <p className="text-label-md text-on-surface-variant">{accountRole}</p>
                    <p className="text-label-sm text-primary">{accountEmail}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[24px] soft-shadow mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-headline-md font-headline-md">{t('pages.settings.account')}</h2>
                    <p className="text-label-md text-on-surface-variant">
                      {isCloud ? t('pages.settings.cloudActive') : t('pages.settings.accountNotActive')}
                    </p>
                  </div>
                </div>
                {isCloud && user ? (
                  <div className="mb-6 rounded-[24px] border border-primary/20 bg-primary/5 p-6">
                    <p className="text-label-md text-on-surface">{t('pages.settings.signedInAs')} <strong>{user.email}</strong></p>
                    <p className="text-label-sm text-on-surface-variant mt-2">{t('pages.settings.cloudActive')}</p>
                    <p className="text-label-sm text-on-surface-variant mt-1">{t('pages.settings.uploadNotActive')}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleReload}
                        disabled={syncStatus === 'loading'}
                        className="px-6 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors disabled:opacity-50"
                      >
                        {syncStatus === 'loading' ? t('global.loading') : t('pages.settings.reloadAccountData')}
                      </button>
                      <button type="button" onClick={handleSignOut} className="px-6 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors">{t('global.signOut')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    <Link to="/entrar" className="px-6 py-3 rounded-full border border-primary text-primary font-bold text-center hover:bg-primary/5 transition-colors">{t('global.signIn')}</Link>
                    <Link to="/criar-conta" className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-center hover:bg-primary/95 transition-colors">{t('global.createAccount')}</Link>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: t('pages.settings.dataStorage'),
                      description: isCloud ? t('pages.settings.cloudActive') : t('pages.settings.localStored'),
                      icon: 'cloud',
                    },
                    {
                      title: t('auth.titleSignUp'),
                      description: t('auth.infoBoxSignUp'),
                      icon: 'share',
                    },
                    {
                      title: t('pages.settings.language'),
                      description: t('pages.settings.languageDescription'),
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

              {isCloud && <BillingPanel />}

              <div className="bg-white p-6 rounded-[24px] soft-shadow border border-outline-variant/30">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">{t('pages.settings.demoData')}</h3>
                <p className="text-label-md text-on-surface-variant mb-4">
                  {t('pages.settings.importHelp')}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={exportDemoData}
                    className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-all"
                  >
                    {isCloud ? t('pages.settings.export') : t('pages.settings.export')}
                  </button>
                  {!isCloud && (
                    <button
                      type="button"
                      onClick={openImportDialog}
                      className="px-6 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-all"
                    >
                      {t('pages.settings.import')}
                    </button>
                  )}
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
                {!isCloud && (
                  <div className="mt-6 border-t border-outline-variant pt-6">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">restart_alt</span>
                      {t('pages.settings.resetDemo')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-[24px] soft-shadow">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4">{t('pages.settings.dataStorage')}</h3>
                <p className="text-label-md text-on-surface-variant mb-4">
                  {isCloud ? t('pages.settings.cloudActive') : t('pages.settings.localStored')}
                </p>
                <div className="grid gap-3">
                  <Link
                    to="/privacidade"
                    className="w-full py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors text-center"
                  >
                    {t('footer.privacy')}
                  </Link>
                  <Link
                    to="/termos"
                    className="w-full py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-colors text-center"
                  >
                    {t('footer.terms')}
                  </Link>
                </div>
              </div>

              <p className="text-label-sm text-on-surface-variant text-center opacity-70">
                {t('footer.copyright')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Definicoes;
