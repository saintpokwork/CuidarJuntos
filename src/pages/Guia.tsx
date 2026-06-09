import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';

const primeirosPassos = [
  'Veja o painel principal',
  'Complete o perfil do familiar',
  'Adicione medicamentos',
  'Registe a próxima consulta',
  'Crie uma tarefa para outro familiar',
  'Gere ou imprima a ficha de emergência',
];

const preencherPrimeiro = [
  'Contactos de emergência',
  'Alergias',
  'Medicamentos atuais',
  'Médico de família',
  'Farmácia habitual',
  'Próxima consulta',
];

const diaADia = [
  'Ver medicamentos do dia',
  'Atualizar tarefas',
  'Registar notas de cuidado',
  'Guardar documentos importantes',
  'Partilhar informação em caso de emergência',
];

const limitacoes = [
  'Esta versão usa dados locais no navegador',
  'Não há conta real ainda',
  'Não há upload real de documentos ainda',
  'Não há notificações reais ainda',
  'Não deve inserir dados médicos altamente sensíveis nesta demo pública',
];

const Guia: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative">
        <DashboardPageHeader title="Guia rápido" showSearch={false} />

        <div className="max-w-[900px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-md text-on-surface-variant mb-6 p-4 bg-warm-beige rounded-xl">
            Os dados apresentados são exemplos para demonstrar como a plataforma funciona.
          </p>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
              Primeiros passos
            </h2>
            <ol className="space-y-3">
              {primeirosPassos.map((passo, i) => (
                <li key={passo} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                  <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  {passo}
                </li>
              ))}
            </ol>
          </section>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">priority_high</span>
              O que deve preencher primeiro
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {preencherPrimeiro.map((item) => (
                <li key={item} className="flex items-center gap-2 text-label-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">today</span>
              Como usar no dia a dia
            </h2>
            <ul className="space-y-2">
              {diaADia.map((item) => (
                <li key={item} className="flex items-center gap-2 text-body-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              O que significam os dados da demo
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              O painel inclui dados de exemplo (medicamentos, consultas, tarefas, familiares) para mostrar
              como a plataforma funciona na prática. Pode editar, adicionar ou remover registos — tudo fica
              guardado apenas no seu navegador até repor a demo nas Definições.
            </p>
          </section>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-8">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">warning</span>
              Limitações desta versão MVP
            </h2>
            <ul className="space-y-2">
              {limitacoes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-label-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm mt-0.5">remove</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard/medicamentos"
              className="px-6 py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all"
            >
              Ir para medicamentos
            </Link>
            <Link
              to="/dashboard/tarefas"
              className="px-6 py-3 bg-secondary text-on-secondary font-bold rounded-full hover:opacity-90 transition-all"
            >
              Criar tarefa
            </Link>
            <Link
              to="/dashboard/emergencia"
              className="px-6 py-3 bg-error-container text-on-error-container font-bold rounded-full hover:opacity-90 transition-all"
            >
              Ver ficha de emergência
            </Link>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Guia;
