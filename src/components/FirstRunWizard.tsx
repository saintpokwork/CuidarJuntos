import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useCareData } from '../context/CareDataContext';

const STORAGE_KEY = 'cuidarjuntos-first-run-wizard-dismissed';

const FirstRunWizard: React.FC = () => {
  const { t } = useLanguage();
  const { data } = useCareData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) !== 'true');
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  const needsSetup =
    !data.careProfile.nome.trim() ||
    data.medications.length === 0 ||
    data.familyMembers.length === 0;

  if (!visible || !needsSetup) return null;

  const steps = [
    { icon: 'person', title: t('firstRun.profileTitle'), text: t('firstRun.profileText'), path: '/dashboard/perfil' },
    { icon: 'medication', title: t('firstRun.medicationTitle'), text: t('firstRun.medicationText'), path: '/dashboard/medicamentos' },
    { icon: 'group_add', title: t('firstRun.familyTitle'), text: t('firstRun.familyText'), path: '/dashboard/familia' },
  ];

  return (
    <section className="mb-stack-lg rounded-[24px] border border-cj-border bg-cj-branco p-5 md:p-6 soft-shadow">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-label-sm font-bold uppercase tracking-[0.18em] text-primary">{t('firstRun.eyebrow')}</p>
          <h2 id="first-run-title" className="text-headline-md font-headline-md text-on-surface">
            {t('firstRun.title')}
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1">{t('firstRun.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="self-start min-h-11 rounded-full bg-surface-container-high px-4 text-label-sm font-bold text-on-surface"
        >
          {t('firstRun.skip')}
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <Link
            key={step.path}
            to={step.path}
            onClick={dismiss}
            className="rounded-2xl border border-cj-border bg-surface-container-low p-4 hover:border-primary transition-colors"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
              <span className="text-label-sm text-cj-terra">{index + 1}/3</span>
            </div>
            <h3 className="text-label-lg font-bold text-on-surface">{step.title}</h3>
            <p className="text-label-sm text-on-surface-variant mt-1">{step.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FirstRunWizard;
