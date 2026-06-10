import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';

const RecuperarPassword: React.FC = () => {
  const [email, setEmail] = useState('');

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
            <p className="text-label-sm text-cj-verde uppercase tracking-[0.3em] mb-3">Recuperação preparada</p>
            <h1 className="text-headline-2 font-headline-lg text-on-surface">Recuperar palavra-passe</h1>
            <p className="text-body-md text-on-surface-variant mt-3">
              Recuperação de palavra-passe ficará disponível com contas reais.
            </p>
          </div>

          <form className="space-y-5">
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
            <button
              type="button"
              disabled
              className="w-full h-12 rounded-full bg-on-surface/10 text-on-surface disabled:cursor-not-allowed disabled:opacity-60 font-bold"
            >
              Enviar instruções
            </button>
          </form>

          <div className="mt-6 text-center text-label-sm text-on-surface-variant">
            <Link to="/dashboard" className="text-primary font-bold hover:underline">
              Continuar para demo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecuperarPassword;
