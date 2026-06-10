import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';

const CriarConta: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[900px] mx-auto flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop h-20">
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

      <main className="max-w-[520px] mx-auto px-6 py-16">
        <div className="bg-white shadow-soft rounded-[32px] border border-outline-variant p-10">
          <div className="mb-8 text-center">
            <p className="text-label-sm text-cj-verde uppercase tracking-[0.3em] mb-3">Registo preparado</p>
            <h1 className="text-headline-2 font-headline-lg text-on-surface">Criar conta</h1>
            <p className="text-body-md text-on-surface-variant mt-3">
              No futuro, a sua conta permitirá guardar dados em segurança e partilhar cuidados com familiares.
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-label-sm font-bold text-on-surface mb-2">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Maria Fernandes"
                className="w-full h-12 px-4 rounded-2xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-label-sm font-bold text-on-surface mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-12 px-4 rounded-2xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-label-sm font-bold text-on-surface mb-2">Palavra-passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full h-12 px-4 rounded-2xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <button
              type="button"
              disabled
              className="w-full h-12 rounded-full bg-on-surface/10 text-on-surface disabled:cursor-not-allowed disabled:opacity-60 font-bold"
            >
              Criar conta
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-all"
            >
              Experimentar demo
            </Link>
          </div>

          <div className="mt-8 rounded-[24px] bg-cj-verde-pale/15 border border-cj-verde-pale p-5">
            <p className="text-label-sm text-on-surface-variant">
              Na versão final, a sua conta permitirá guardar dados em segurança e partilhar cuidados com familiares.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CriarConta;
