import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import { useLanguage } from '../i18n/LanguageContext';

const Termos: React.FC = () => {
  const { isEnglish, t } = useLanguage();

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[800px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="sm" />
          </Link>
          <Link
            to="/dashboard"
            className="text-label-md font-bold text-primary hover:underline"
          >
            Experimentar demo
          </Link>
        </nav>
      </header>

      <main className="max-w-[800px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6">Termos de Utilização</h1>
        <p className="text-label-sm text-on-surface-variant mb-8">Última atualização: junho de 2024</p>

        <div className="space-y-6 text-body-md text-on-surface-variant leading-relaxed">
          {isEnglish() && (
            <div className="p-4 bg-surface-container-low rounded-lg">
              <strong className="block mb-2">English summary</strong>
              <p className="text-label-sm text-on-surface-variant">{t('legal.terms.summary_en')}</p>
            </div>
          )}
          <p>
            Ao utilizar o <strong className="text-on-surface">CuidarJuntos</strong>, aceita estes
            termos. A plataforma encontra-se em fase de demonstração (MVP).
          </p>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Natureza do serviço</h2>
            <p>
              O CuidarJuntos é uma ferramenta de organização familiar para ajudar a gerir informação,
              tarefas, lembretes e contactos relacionados com o cuidado de familiares.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Não substitui serviços de saúde</h2>
            <p>
              O CuidarJuntos <strong className="text-on-surface">não substitui</strong> médicos,
              hospitais, farmácias, serviços de emergência ou o Serviço Nacional de Saúde (SNS). Não
              deve ser utilizado como única fonte de informação em situações clínicas ou de emergência.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Responsabilidade do utilizador</h2>
            <p>
              O utilizador é responsável por verificar a exatidão das informações introduzidas e por
              tomar decisões de saúde com base em profissionais qualificados.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Emergências</h2>
            <p className="p-4 bg-error-container/20 border-l-4 border-error rounded-r-xl">
              Em caso de emergência médica, ligue imediatamente para o{' '}
              <strong className="text-on-surface text-headline-md">112</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Versão demo e armazenamento local</h2>
            <p>
              Nesta versão de demonstração, os dados são guardados apenas no navegador do utilizador
              (<code className="text-primary">localStorage</code>). Podem ser perdidos ao limpar o
              histórico do navegador ou ao repor os dados de demonstração nas Definições.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Contacto</h2>
            <p>
              Para questões sobre estes termos, contacte-nos em{' '}
              <a className="text-primary font-bold hover:underline" href="mailto:contato@cuidarjuntos.pt">
                contato@cuidarjuntos.pt
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/"
            className="px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
          >
            Voltar ao início
          </Link>
          <Link
            to="/privacidade"
            className="px-6 py-3 bg-surface-container-low text-primary font-bold rounded-full hover:bg-surface-container-high transition-colors"
          >
            Ver política de privacidade
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Termos;
