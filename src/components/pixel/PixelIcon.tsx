import React from 'react';

interface PixelIconProps {
  name:
    | 'rain'
    | 'fire'
    | 'wind'
    | 'river'
    | 'crickets'
    | 'birds'
    | 'brownNoise'
    | 'bowl'
    | 'tea'
    | 'cat'
    | 'lantern'
    | 'plant'
    | 'streak'
    | 'sparkle'
    | 'heart';
  size?: number;
  className?: string;
  active?: boolean;
}

export const PixelIcon: React.FC<PixelIconProps> = ({
  name,
  size = 24,
  className = '',
  active = false,
}) => {
  const renderIcon = () => {
    switch (name) {
      case 'rain':
        return (
          <>
            {/* Nube pixelada */}
            <rect x="5" y="4" width="6" height="2" fill={active ? '#60a5fa' : '#94a3b8'} />
            <rect x="3" y="6" width="10" height="4" fill={active ? '#93c5fd' : '#cbd5e1'} />
            <rect x="2" y="8" width="12" height="3" fill={active ? '#bfdbfe' : '#e2e8f0'} />
            {/* Gotas de lluvia */}
            <rect x="4" y="12" width="1" height="2" fill="#38bdf8" />
            <rect x="8" y="11" width="1" height="2" fill="#38bdf8" />
            <rect x="11" y="13" width="1" height="2" fill="#38bdf8" />
          </>
        );

      case 'fire':
        return (
          <>
            {/* Base leños */}
            <rect x="4" y="13" width="8" height="2" fill="#78350f" />
            <rect x="3" y="14" width="10" height="1" fill="#451a03" />
            {/* Llama exterior naranja */}
            <rect x="7" y="3" width="2" height="3" fill="#f97316" />
            <rect x="5" y="6" width="6" height="4" fill="#ea580c" />
            <rect x="4" y="9" width="8" height="4" fill="#dc2626" />
            {/* Núcleo amarillo */}
            <rect x="6" y="8" width="4" height="4" fill="#fbbf24" />
            <rect x="7" y="6" width="2" height="3" fill="#fef08a" />
          </>
        );

      case 'wind':
        return (
          <>
            {/* Líneas de brisa y hoja */}
            <rect x="2" y="5" width="8" height="1" fill={active ? '#34d399' : '#94a3b8'} />
            <rect x="10" y="6" width="3" height="1" fill={active ? '#34d399' : '#94a3b8'} />
            <rect x="12" y="7" width="1" height="2" fill={active ? '#34d399' : '#94a3b8'} />
            <rect x="4" y="9" width="8" height="1" fill={active ? '#10b981' : '#cbd5e1'} />
            {/* Pequeña hoja verde */}
            <rect x="7" y="11" width="3" height="2" fill="#4ade80" />
            <rect x="6" y="12" width="2" height="2" fill="#22c55e" />
          </>
        );

      case 'river':
        return (
          <>
            {/* Olas de arroyo */}
            <rect x="3" y="5" width="4" height="1" fill="#38bdf8" />
            <rect x="7" y="6" width="5" height="1" fill="#0284c7" />
            <rect x="2" y="9" width="5" height="1" fill="#0ea5e9" />
            <rect x="7" y="10" width="6" height="1" fill="#38bdf8" />
            <rect x="4" y="13" width="5" height="1" fill="#7dd3fc" />
            <rect x="9" y="12" width="4" height="1" fill="#0284c7" />
          </>
        );

      case 'crickets':
        return (
          <>
            {/* Grillo silueta y luna sutil */}
            <rect x="11" y="2" width="3" height="1" fill="#fef08a" />
            <rect x="13" y="3" width="1" height="2" fill="#fef08a" />
            {/* Cuerpo del insecto */}
            <rect x="5" y="8" width="6" height="3" fill="#84cc16" />
            <rect x="4" y="9" width="2" height="2" fill="#65a30d" />
            {/* Patas posteriores */}
            <rect x="10" y="6" width="1" height="3" fill="#4d7c0f" />
            <rect x="11" y="9" width="1" height="3" fill="#4d7c0f" />
            {/* Antenas */}
            <rect x="3" y="7" width="1" height="2" fill="#365314" />
          </>
        );

      case 'birds':
        return (
          <>
            {/* Silueta de pajarito posado */}
            <rect x="7" y="4" width="4" height="4" fill="#f59e0b" />
            <rect x="5" y="7" width="7" height="4" fill="#fbbf24" />
            <rect x="11" y="5" width="2" height="1" fill="#ea580c" /> {/* pico */}
            <rect x="9" y="5" width="1" height="1" fill="#1c1917" /> {/* ojo */}
            <rect x="4" y="10" width="3" height="2" fill="#d97706" /> {/* cola */}
            <rect x="7" y="12" width="1" height="2" fill="#78350f" /> {/* patita */}
          </>
        );

      case 'brownNoise':
        return (
          <>
            {/* Onda sonora envolvente cálida */}
            <rect x="2" y="8" width="2" height="1" fill="#a78bfa" />
            <rect x="4" y="6" width="2" height="5" fill="#c084fc" />
            <rect x="6" y="4" width="2" height="9" fill="#d8b4fe" />
            <rect x="8" y="7" width="2" height="3" fill="#c084fc" />
            <rect x="10" y="5" width="2" height="7" fill="#a78bfa" />
            <rect x="12" y="8" width="2" height="1" fill="#8b5cf6" />
          </>
        );

      case 'bowl':
        return (
          <>
            {/* Cuenco tibetano dorado */}
            <rect x="4" y="6" width="8" height="2" fill="#f59e0b" />
            <rect x="3" y="8" width="10" height="3" fill="#d97706" />
            <rect x="5" y="11" width="6" height="2" fill="#b45309" />
            {/* Mazillo de madera */}
            <rect x="11" y="3" width="2" height="5" fill="#78350f" />
            {/* Resplandor */}
            <rect x="2" y="5" width="1" height="1" fill="#fef08a" />
            <rect x="13" y="5" width="1" height="1" fill="#fef08a" />
          </>
        );

      case 'tea':
        return (
          <>
            {/* Vapor */}
            <rect x="7" y="2" width="1" height="2" fill="#e2e8f0" opacity="0.7" />
            <rect x="9" y="1" width="1" height="2" fill="#e2e8f0" opacity="0.7" />
            {/* Taza */}
            <rect x="5" y="6" width="6" height="6" fill="#14b8a6" />
            <rect x="11" y="7" width="2" height="3" fill="#0f766e" />
            <rect x="4" y="12" width="8" height="1" fill="#0d9488" />
          </>
        );

      case 'cat':
        return (
          <>
            {/* Orejas */}
            <rect x="4" y="4" width="2" height="2" fill="#ea580c" />
            <rect x="10" y="4" width="2" height="2" fill="#ea580c" />
            {/* Cabeza y cuerpo acurrucado */}
            <rect x="5" y="6" width="6" height="5" fill="#f97316" />
            <rect x="3" y="8" width="10" height="5" fill="#fb923c" />
            {/* Ojos cerrados dormidito */}
            <rect x="6" y="8" width="1" height="1" fill="#431407" />
            <rect x="9" y="8" width="1" height="1" fill="#431407" />
            {/* Nariz */}
            <rect x="7" y="9" width="2" height="1" fill="#fda4af" />
          </>
        );

      case 'streak':
        return (
          <>
            {/* Fuego racha */}
            <rect x="7" y="2" width="2" height="2" fill="#fbbf24" />
            <rect x="6" y="4" width="4" height="4" fill="#f97316" />
            <rect x="5" y="8" width="6" height="5" fill="#ef4444" />
            <rect x="7" y="7" width="2" height="4" fill="#fef08a" />
          </>
        );

      case 'lantern':
        return (
          <>
            {/* Techo linterna */}
            <rect x="5" y="3" width="6" height="1" fill="#3f3f46" />
            <rect x="4" y="4" width="8" height="2" fill="#52525b" />
            {/* Papel washi cálido */}
            <rect x="5" y="6" width="6" height="6" fill="#fed7aa" />
            <rect x="7" y="7" width="2" height="4" fill="#fb923c" />
            {/* Base */}
            <rect x="5" y="12" width="6" height="1" fill="#3f3f46" />
          </>
        );

      case 'plant':
        return (
          <>
            {/* Maceta */}
            <rect x="5" y="10" width="6" height="4" fill="#d97706" />
            <rect x="4" y="9" width="8" height="1" fill="#b45309" />
            {/* Hojas monstera */}
            <rect x="4" y="4" width="3" height="4" fill="#22c55e" />
            <rect x="9" y="3" width="4" height="4" fill="#16a34a" />
            <rect x="7" y="6" width="2" height="3" fill="#15803d" />
          </>
        );

      default:
        return <rect x="4" y="4" width="8" height="8" fill="#a1a1aa" />;
    }
  };

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={`pixel-art shrink-0 ${className}`}
      shapeRendering="crispEdges"
    >
      {renderIcon()}
    </svg>
  );
};
