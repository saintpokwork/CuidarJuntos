import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="bg-surface text-on-surface font-body-md selection:bg-primary/20">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
        <nav className="max-w-[1200px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-20">
          <Link className="font-headline-md text-headline-md font-bold text-primary" to="/">
            CuidarJuntos
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md"
              href="#como-funciona"
            >
              Como funciona
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md"
              href="#funcionalidades"
            >
              Funcionalidades
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md"
              href="#precos"
            >
              Preços
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              className="hidden md:block text-primary font-bold hover:text-primary-container transition-colors font-label-md text-label-md"
              to="/dashboard"
            >
              Entrar
            </Link>
            <Link
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md shadow-sm hover:scale-105 active:scale-95 transition-all"
              to="/dashboard"
            >
              Começar
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 text-center md:text-left z-10">
              <span className="inline-block px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-label-sm mb-6">
                Organização para famílias cuidadoras
              </span>
              <h1 className="font-headline-xl text-headline-xl md:text-[48px] md:leading-[56px] text-on-surface mb-6">
                Cuide melhor dos seus pais, com toda a família organizada num só lugar.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
                Guarde medicamentos, consultas, documentos, contactos de emergência e tarefas familiares
                numa plataforma simples feita para famílias portuguesas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  className="bg-primary text-on-primary px-8 py-4 rounded-full font-headline-md text-[18px] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                  to="/dashboard"
                >
                  Começar gratuitamente
                </Link>
                <a
                  className="bg-surface-container-low text-primary px-8 py-4 rounded-full font-headline-md text-[18px] hover:bg-surface-container-high transition-colors text-center"
                  href="#como-funciona"
                >
                  Ver como funciona
                </a>
              </div>
              <p className="mt-4 text-label-sm text-on-surface-variant">
                Versão demo — não é necessário criar conta.
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <div className="relative z-10 glass-card p-6 rounded-2xl soft-shadow border border-white/40">
                <img
                  alt="Interface do painel CuidarJuntos"
                  className="rounded-xl w-full h-auto shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdx1dfUc-1E1-dYKkda1s4AwDWV7zd-DsYZJBZT1Ga2a0l-pQO1WcPbToRKFI5mPb_T5Ew92lKs5To6EsrajdzDPYPDGaJbjxK5ltreRmhaDGqgXtM6-5hsoW8lNTpJuO9zquo31d-PAv4xrtNDmvhazpcGU-SATjU9z7h-hfvRaVbJp1qGfTJLUWuO2uZXhoxmWpE-fryqH8nRz9V8Rbv9DAVHoRbexzgA6VxLcuz150OWXd1Oo8yDQR9t19Of2_f6NzzLEj0N66N"
                />
                <div className="absolute -top-4 -right-4 bg-secondary-container p-4 rounded-xl shadow-lg">
                  <span className="material-symbols-outlined text-on-secondary-container">done_all</span>
                </div>
              </div>
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-surface-container-lowest">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl text-on-surface mb-4">
                Cuidar de um familiar não devia depender de mensagens perdidas no WhatsApp.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                A dispersão de informação causa stress e erros graves. Nós resolvemos os problemas mais
                comuns do dia-a-dia.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: 'calendar_today', title: 'Consultas esquecidas', text: 'A marcação ficou no telemóvel de um irmão e ninguém apareceu no hospital.' },
                { icon: 'medical_services', title: 'Medicamentos errados', text: 'Dúvidas sobre se a dose da manhã já foi tomada ou se a receita expirou.' },
                { icon: 'folder_off', title: 'Documentos espalhados', text: 'Onde está o último relatório médico ou o cartão do subsistema de saúde?' },
                { icon: 'groups', title: 'Irmãos sem coordenação', text: '"Pensava que ias tu buscar os medicamentos..." — a falta de clareza gera conflitos.' },
                { icon: 'search_off', title: 'Informação perdida', text: 'O contacto da fisioterapeuta ou o nome daquele novo sintoma perdeu-se no chat.' },
                { icon: 'emergency_home', title: 'Emergências cegas', text: 'Chegar ao hospital e não saber a lista completa de doenças ou alergias.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface p-8 rounded-2xl border border-outline-variant/30 soft-shadow-hover transition-all"
                >
                  <span className="material-symbols-outlined text-error mb-4 text-3xl">{item.icon}</span>
                  <h3 className="font-headline-md text-headline-md mb-2">{item.title}</h3>
                  <p className="text-on-surface-variant">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface" id="funcionalidades">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl mb-4">
                Tudo o que a família precisa, num só lugar.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Uma ferramenta centralizada para paz de espírito e segurança.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[240px]">
              <div className="md:col-span-3 lg:col-span-4 row-span-2 bg-primary-container text-on-primary-container p-8 rounded-2xl flex flex-col justify-between soft-shadow relative overflow-hidden group">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-6">medication</span>
                  <h3 className="font-headline-md text-headline-md mb-3">Medicamentos e horários</h3>
                  <p className="opacity-90">Controlo rigoroso de stock e alertas de toma para nunca falhar uma dose.</p>
                </div>
              </div>
              <div className="md:col-span-3 lg:col-span-8 bg-surface-container-low p-8 rounded-2xl flex flex-col justify-between soft-shadow-hover transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-headline-md mb-2">Consultas e exames</h3>
                    <p className="text-on-surface-variant">
                      Histórico completo e lembretes partilhados para toda a rede de cuidadores.
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-3xl">event_available</span>
                </div>
              </div>
              <div className="md:col-span-3 lg:col-span-4 bg-warm-beige p-8 rounded-2xl flex flex-col justify-between soft-shadow-hover transition-all">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">description</span>
                <div>
                  <h3 className="font-headline-md text-headline-md mb-2">Documentos importantes</h3>
                  <p className="text-on-surface-variant">
                    Digitalize e aceda a receitas, análises e relatórios médicos em segundos.
                  </p>
                </div>
              </div>
              <div className="md:col-span-3 lg:col-span-4 bg-surface-container-high p-8 rounded-2xl flex flex-col justify-between soft-shadow-hover transition-all">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">task_alt</span>
                <div>
                  <h3 className="font-headline-md text-headline-md mb-2">Tarefas da família</h3>
                  <p className="text-on-surface-variant">
                    Atribua quem faz as compras ou quem leva o familiar ao passeio diário.
                  </p>
                </div>
              </div>
              <div className="md:col-span-6 lg:col-span-4 bg-secondary p-8 rounded-2xl text-on-secondary flex flex-col justify-between soft-shadow relative overflow-hidden">
                <div>
                  <span className="material-symbols-outlined text-3xl mb-4">contact_phone</span>
                  <h3 className="font-headline-md text-headline-md mb-2">Contactos de emergência</h3>
                  <p className="opacity-90">
                    Lista rápida de médicos, vizinhos e familiares acessível em qualquer situação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-container-lowest" id="como-funciona">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center mb-20">
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl">
                Comece a cuidar em 4 passos simples
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Crie o perfil', text: 'Registe o seu familiar com os dados básicos e foto.' },
                { step: '2', title: 'Adicione dados', text: 'Insira medicamentos, próximas consultas e documentos.' },
                { step: '3', title: 'Convide a família', text: 'Envie convites para os seus irmãos ou outros cuidadores.' },
                { step: '4', title: 'Receba alertas', text: 'Mantenha todos atualizados com notificações automáticas.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    {item.step}
                  </div>
                  <h4 className="font-headline-md text-headline-md mb-3">{item.title}</h4>
                  <p className="text-on-surface-variant">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface" id="precos">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl mb-4">
                Um plano para cada família
              </h2>
              <p className="text-on-surface-variant font-body-lg">Paz de espírito acessível a todos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant soft-shadow flex flex-col">
                <h3 className="font-headline-md text-headline-md mb-2">Grátis</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">0€</span>
                  <span className="text-on-surface-variant">/mês</span>
                </div>
                <p className="text-on-surface-variant mb-8 flex-grow">
                  Essencial para quem está a começar a organizar-se.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">check</span> 1 Familiar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">check</span> Até 2 Cuidadores
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">check</span> Registo de Medicamentos
                  </li>
                </ul>
                <Link
                  className="w-full py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors text-center"
                  to="/dashboard"
                >
                  Escolher este
                </Link>
              </div>
              <div className="bg-primary text-on-primary p-8 rounded-2xl soft-shadow scale-105 flex flex-col z-10 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Mais Popular
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">Família</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">4,99€</span>
                  <span className="text-on-primary-container opacity-80">/mês</span>
                </div>
                <p className="opacity-90 mb-8 flex-grow">
                  Gestão colaborativa completa para a família nuclear.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined">check</span> Até 3 Familiares
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined">check</span> Cuidadores ilimitados
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined">check</span> Documentos Ilimitados
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined">check</span> Histórico exportável
                  </li>
                </ul>
                <Link
                  className="w-full py-4 rounded-full bg-on-primary text-primary font-bold hover:bg-primary-fixed-dim transition-all shadow-lg text-center"
                  to="/dashboard"
                >
                  Escolher este
                </Link>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant soft-shadow flex flex-col">
                <h3 className="font-headline-md text-headline-md mb-2">Plus</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">8,99€</span>
                  <span className="text-on-surface-variant">/mês</span>
                </div>
                <p className="text-on-surface-variant mb-8 flex-grow">
                  Para famílias que precisam de apoio profissional e múltiplos perfis.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">check</span> Até 6 Familiares
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">check</span> Integração com Sensores
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">check</span> Suporte prioritário 24/7
                  </li>
                </ul>
                <Link
                  className="w-full py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors text-center"
                  to="/dashboard"
                >
                  Escolher este
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface overflow-hidden relative">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="bg-surface-container-highest p-12 md:p-20 rounded-[3rem] text-center relative z-10">
              <h2 className="font-headline-xl text-headline-xl mb-6">
                Comece a organizar os cuidados da sua família hoje.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
                Junte-se a milhares de famílias portuguesas que já encontraram o equilíbrio no cuidado
                familiar.
              </p>
              <Link
                className="inline-block bg-primary text-on-primary px-10 py-5 rounded-full font-headline-md text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                to="/dashboard"
              >
                Começar gratuitamente agora
              </Link>
              <p className="mt-6 text-label-sm text-on-surface-variant">
                Versão demo — não é necessário criar conta.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">verified_user</span>
                  <span className="font-label-md">Segurança de dados bancária</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">health_and_safety</span>
                  <span className="font-label-md">Focado em Cuidados</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 top-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </section>

        <section className="pb-12 pt-0 px-container-padding-mobile">
          <div className="max-w-[800px] mx-auto text-center opacity-50">
            <p className="font-label-sm text-label-sm italic">
              O CuidarJuntos é uma ferramenta de organização familiar e não substitui qualquer serviço
              médico, de enfermagem ou aconselhamento profissional de saúde. Consulte sempre o seu médico
              para decisões clínicas.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest border-t border-surface-variant py-16">
        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-primary mb-4">CuidarJuntos</h2>
              <p className="text-on-surface-variant font-label-md">
                O porto de abrigo digital para a sua família. Organização, segurança e carinho em cada
                detalhe.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-label-md text-primary mb-4">Plataforma</h4>
                <ul className="space-y-2">
                  <li>
                    <a className="text-on-surface-variant hover:text-primary transition-all text-label-md" href="#funcionalidades">
                      Funcionalidades
                    </a>
                  </li>
                  <li>
                    <a className="text-on-surface-variant hover:text-primary transition-all text-label-md" href="#precos">
                      Preços
                    </a>
                  </li>
                  <li>
                    <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/privacidade">
                      Segurança
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-label-md text-primary mb-4">Suporte</h4>
                <ul className="space-y-2">
                  <li><span className="text-on-surface-variant text-label-md">Ajuda</span></li>
                  <li>
                    <a
                      className="text-on-surface-variant hover:text-primary transition-all text-label-md"
                      href="mailto:contato@cuidarjuntos.pt"
                    >
                      Contacto
                    </a>
                  </li>
                  <li><span className="text-on-surface-variant text-label-md">Blog</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-label-md text-primary mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/termos">
                      Termos
                    </Link>
                  </li>
                  <li>
                    <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/privacidade">
                      Privacidade
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-surface-variant">
            <p className="text-label-md text-on-surface-variant opacity-70">
              © 2024 CuidarJuntos. O seu porto de abrigo no cuidado familiar.
            </p>
            <div className="flex gap-6">
              <span className="text-on-surface-variant">
                <span className="material-symbols-outlined">language</span>
              </span>
              <span className="text-on-surface-variant">
                <span className="material-symbols-outlined">share</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
