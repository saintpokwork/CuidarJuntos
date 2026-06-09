import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GUIDE_SEEN_KEY = 'cuidarjuntos-guide-seen';

const GuideBanner: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(GUIDE_SEEN_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    try {
      localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    } catch {
      /* ignorar */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-secondary-container/40 border-b border-secondary/20 px-container-padding-mobile md:px-container-padding-desktop py-4">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-label-md font-bold text-on-surface mb-1">Novo no CuidarJuntos?</p>
          <p className="text-label-sm text-on-surface-variant">
            Comece pelo guia rápido para perceber como organizar os cuidados passo a passo.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/dashboard/guia"
            className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-full text-label-sm hover:opacity-90 transition-all"
          >
            Ver guia rápido
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="px-5 py-2.5 text-on-surface-variant font-bold rounded-full text-label-sm hover:bg-surface-container-low transition-all"
          >
            Dispensar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideBanner;
