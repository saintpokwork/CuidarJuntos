import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';

const Privacidade: React.FC = () => {
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
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6">Política de Privacidade</h1>
        <p className="text-label-sm text-on-surface-variant mb-8">Última atualização: junho de 2024</p>

        <div className="space-y-6 text-body-md text-on-surface-variant leading-relaxed">
          <p>
            O <strong className="text-on-surface">CuidarJuntos</strong> é atualmente uma versão
            demonstração (MVP). Esta página descreve como os dados são tratados nesta fase inicial do
            produto.
          </p>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Dados na versão demo</h2>
            <p>
              Os dados que introduz no painel (medicamentos, consultas, tarefas, documentos, notas e
              contactos) são guardados <strong className="text-on-surface">localmente no seu navegador</strong>{' '}
              através de <code className="text-primary">localStorage</code>. Não são enviados para
              servidores externos nem sincronizados entre dispositivos.
            </p>
            <p>
              Em versões futuras, os dados poderão ser armazenados de forma segura na nuvem, com
              contas e encriptação.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Sem aconselhamento médico</h2>
            <p>
              O CuidarJuntos é uma ferramenta de organização familiar. Não fornece aconselhamento
              médico, diagnóstico ou tratamento. Consulte sempre profissionais de saúde para decisões
              clínicas.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Dados sensíveis</h2>
            <p>
              Recomendamos que <strong className="text-on-surface">não introduza dados médicos reais
              altamente sensíveis</strong> nesta versão de demonstração. Utilize dados fictícios ou
              anonimizados para experimentar a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Versões futuras</h2>
            <p>
              Versões futuras do CuidarJuntos poderão incluir contas seguras, armazenamento encriptado
              e sincronização entre familiares. Esta política será atualizada quando essas
              funcionalidades estiverem disponíveis.
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">Contacto</h2>
            <p>
              Para questões sobre privacidade, contacte-nos em{' '}
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
            to="/termos"
            className="px-6 py-3 bg-surface-container-low text-primary font-bold rounded-full hover:bg-surface-container-high transition-colors"
          >
            Ver termos de utilização
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Privacidade;
