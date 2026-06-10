import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';

const NotFound: React.FC = () => {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center px-container-padding-mobile">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <CuidarJuntosLogo variant="default" size="lg" />
        </div>
        <span className="material-symbols-outlined text-primary text-6xl mb-6">search_off</span>
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-4">Página não encontrada</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          A página que procura não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all"
          >
            Voltar ao início
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-surface-container-low text-primary font-bold rounded-full hover:bg-surface-container-high transition-all"
          >
            Ir para o painel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
