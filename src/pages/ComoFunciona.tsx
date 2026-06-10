import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';

const steps = [
  {
    num: 1,
    title: 'Crie o perfil do familiar',
    desc: 'Adicione os dados essenciais do seu pai, mãe, avó ou outro familiar: nome, contactos, alergias, médico, farmácia e informação importante.',
    icon: 'person',
  },
  {
    num: 2,
    title: 'Registe medicamentos e horários',
    desc: 'Guarde o nome do medicamento, dosagem, horário, frequência e quem fica responsável.',
    icon: 'pill',
  },
  {
    num: 3,
    title: 'Adicione consultas e exames',
    desc: 'Mantenha todas as consultas, exames, deslocações e responsáveis organizados num só calendário.',
    icon: 'calendar_today',
  },
  {
    num: 4,
    title: 'Partilhe tarefas com a família',
    desc: 'Atribua tarefas como comprar medicação, levar à consulta, pagar uma fatura ou contactar o médico.',
    icon: 'assignment',
  },
  {
    num: 5,
    title: 'Guarde documentos importantes',
    desc: 'Organize receitas, exames, seguros, identificação, faturas e outros documentos importantes.',
    icon: 'description',
  },
  {
    num: 6,
    title: 'Use a ficha de emergência',
    desc: 'Tenha uma ficha rápida com contactos, alergias, medicamentos atuais e informação essencial para situações urgentes.',
    icon: 'emergency',
  },
  {
    num: 7,
    title: 'Convide familiares ou cuidadores',
    desc: 'Mantenha irmãos, familiares ou cuidadores informados sobre o que foi feito e o que ainda falta fazer.',
    icon: 'group',
  },
];

const ComoFunciona: React.FC = () => {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md sticky top-0 z-50">
        <nav className="max-w-[900px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
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

      <main className="max-w-[900px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
        <section className="text-center mb-12">
          <h1 className="font-display italic text-headline-xl text-on-surface mb-4">
            Como usar o CuidarJuntos
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Em poucos minutos, pode organizar medicamentos, consultas, documentos, tarefas e contactos
            importantes do seu familiar.
          </p>
        </section>

        <div className="space-y-4 mb-12">
          {steps.map((step) => (
            <div
              key={step.num}
              className="glass-card p-6 rounded-[24px] soft-shadow border border-white/40 flex gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-bold text-headline-md">
                {step.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">{step.icon}</span>
                  <h2 className="text-headline-md font-headline-md text-on-surface">{step.title}</h2>
                </div>
                <p className="text-body-md text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-cj-verde-pale border-l-4 border-cj-verde rounded-r-xl mb-8">
          <p className="text-body-md text-on-surface-variant">
            CuidarJuntos não substitui médicos, hospitais, farmácias, o SNS ou serviços de emergência.
            Em caso de emergência, ligue <strong className="text-on-surface">112</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-center"
          >
            Experimentar demo
          </Link>
          <Link
            to="/"
            className="px-8 py-4 bg-surface-container-low text-primary font-bold rounded-full hover:bg-surface-container-high transition-all text-center"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ComoFunciona;
