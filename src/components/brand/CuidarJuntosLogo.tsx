import React from 'react';

type LogoVariant = 'default' | 'white' | 'icon';
type LogoSize = 'sm' | 'md' | 'lg';

interface CuidarJuntosLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const iconSizes: Record<LogoSize, number> = {
  sm: 22,
  md: 28,
  lg: 36,
};

const wordmarkSizes: Record<LogoSize, { cuidar: string; juntos: string; gap: string }> = {
  sm: { cuidar: 'text-sm leading-tight', juntos: 'text-sm leading-tight', gap: 'gap-2' },
  md: { cuidar: 'text-base leading-tight', juntos: 'text-base leading-tight', gap: 'gap-2.5' },
  lg: { cuidar: 'text-xl leading-tight', juntos: 'text-xl leading-tight', gap: 'gap-3' },
};

const palette = {
  default: {
    outer: '#2D6A52',
    inner: '#3D8B6E',
    innerOpacity: 0.65,
    dot: '#C8623A',
    cuidar: 'text-cj-terra',
    juntos: 'text-cj-verde',
  },
  white: {
    outer: 'rgba(255,255,255,0.92)',
    inner: 'rgba(255,255,255,0.55)',
    innerOpacity: 1,
    dot: '#F5C88A',
    cuidar: 'text-white',
    juntos: 'text-white/80',
  },
  icon: {
    outer: '#2D6A52',
    inner: '#3D8B6E',
    innerOpacity: 0.65,
    dot: '#C8623A',
    cuidar: 'text-cj-terra',
    juntos: 'text-cj-verde',
  },
};

const IconMark: React.FC<{ size: number; colors: (typeof palette)['default'] }> = ({ size, colors }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="shrink-0"
  >
    <path
      d="M32 5 A27 27 0 1 0 32 59"
      fill="none"
      stroke={colors.outer}
      strokeWidth="5.5"
      strokeLinecap="round"
    />
    <path
      d="M32 16 A16 16 0 1 0 32 48"
      fill="none"
      stroke={colors.inner}
      strokeWidth="4"
      strokeLinecap="round"
      opacity={colors.innerOpacity}
    />
    <circle cx="32" cy="32" r="4" fill={colors.dot} />
  </svg>
);

const CuidarJuntosLogo: React.FC<CuidarJuntosLogoProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const colors = palette[variant];
  const iconSize = iconSizes[size];
  const wm = wordmarkSizes[size];

  if (variant === 'icon') {
    return (
      <span className={`inline-flex ${className}`} role="img" aria-label="CuidarJuntos">
        <IconMark size={iconSize} colors={colors} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center ${wm.gap} ${className}`}
      role="img"
      aria-label="CuidarJuntos"
    >
      <IconMark size={iconSize} colors={colors} />
      <span className="flex flex-col leading-none">
        <span className={`font-semibold tracking-tight ${wm.cuidar} ${colors.cuidar}`}>Cuidar</span>
        <span className={`font-light tracking-tight ${wm.juntos} ${colors.juntos}`}>Juntos</span>
      </span>
    </span>
  );
};

export default CuidarJuntosLogo;
