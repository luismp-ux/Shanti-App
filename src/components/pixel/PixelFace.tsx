import React from 'react';
import { MoodType } from '../../types/meditation';

interface PixelFaceProps {
  mood: MoodType;
  size?: number;
  selected?: boolean;
  className?: string;
}

export const PixelFace: React.FC<PixelFaceProps> = ({
  mood,
  size = 48,
  selected = false,
  className = '',
}) => {
  // Configuración de paleta lo-fi cálida
  const colors = {
    skin: '#ffe1b3',
    skinShadow: '#f2c896',
    border: '#3b2f2f',
    blush: '#f99990',
    eyes: '#2e2528',
    mouth: '#4a373b',
    highlight: '#ffffff',
    sweat: '#7ec4cf',
  };

  const renderFacePixels = () => {
    switch (mood) {
      case 'calm':
        // Rostro sereno: ojos cerrados curvados hacia arriba en paz, leve sonrisa tranquila, mejillas sonrosadas
        return (
          <>
            {/* Ojos cerrados relajados ^ ^ */}
            <rect x="3" y="6" width="3" height="1" fill={colors.eyes} />
            <rect x="4" y="5" width="2" height="1" fill={colors.eyes} />
            <rect x="10" y="6" width="3" height="1" fill={colors.eyes} />
            <rect x="10" y="5" width="2" height="1" fill={colors.eyes} />

            {/* Rubor en mejillas */}
            <rect x="2" y="8" width="2" height="1" fill={colors.blush} />
            <rect x="12" y="8" width="2" height="1" fill={colors.blush} />

            {/* Boca pacífica */}
            <rect x="7" y="10" width="2" height="1" fill={colors.mouth} />
            <rect x="6" y="9" width="1" height="1" fill={colors.mouth} />
            <rect x="9" y="9" width="1" height="1" fill={colors.mouth} />
          </>
        );

      case 'happy':
        // Rostro radiante: ojos entrecerrados felices, gran sonrisa tierna, mejillas sonrosadas
        return (
          <>
            {/* Ojos sonrientes */}
            <rect x="3" y="6" width="3" height="1" fill={colors.eyes} />
            <rect x="4" y="5" width="2" height="1" fill={colors.eyes} />
            <rect x="10" y="6" width="3" height="1" fill={colors.eyes} />
            <rect x="10" y="5" width="2" height="1" fill={colors.eyes} />

            {/* Rubor brillante */}
            <rect x="2" y="8" width="3" height="2" fill={colors.blush} />
            <rect x="11" y="8" width="3" height="2" fill={colors.blush} />

            {/* Boca sonriente abierta */}
            <rect x="6" y="9" width="4" height="1" fill={colors.mouth} />
            <rect x="7" y="10" width="2" height="2" fill="#d95d6a" />
          </>
        );

      case 'stressed':
        // Rostro estresado: cejas fruncidas, ojos apretados, gota de sudor azul pixelada, boca zig-zag
        return (
          <>
            {/* Cejas tensas */}
            <rect x="3" y="4" width="3" height="1" fill={colors.eyes} />
            <rect x="10" y="4" width="3" height="1" fill={colors.eyes} />

            {/* Ojos > < */}
            <rect x="3" y="6" width="1" height="2" fill={colors.eyes} />
            <rect x="4" y="6" width="2" height="1" fill={colors.eyes} />
            <rect x="12" y="6" width="1" height="2" fill={colors.eyes} />
            <rect x="10" y="6" width="2" height="1" fill={colors.eyes} />

            {/* Gota de sudor */}
            <rect x="13" y="3" width="1" height="2" fill={colors.sweat} />
            <rect x="14" y="4" width="1" height="1" fill={colors.sweat} />

            {/* Boca tensa / ondulada */}
            <rect x="5" y="10" width="2" height="1" fill={colors.mouth} />
            <rect x="7" y="9" width="2" height="1" fill={colors.mouth} />
            <rect x="9" y="10" width="2" height="1" fill={colors.mouth} />
          </>
        );

      case 'anxious':
        // Rostro ansioso: pupilas grandes temblorosas, cejas arqueadas, boca pequeña y tensa
        return (
          <>
            {/* Cejas preocupadas */}
            <rect x="3" y="4" width="2" height="1" fill={colors.eyes} />
            <rect x="5" y="3" width="1" height="1" fill={colors.eyes} />
            <rect x="11" y="4" width="2" height="1" fill={colors.eyes} />
            <rect x="10" y="3" width="1" height="1" fill={colors.eyes} />

            {/* Ojos grandes con brillo tembloroso */}
            <rect x="3" y="6" width="3" height="3" fill={colors.eyes} />
            <rect x="4" y="6" width="1" height="1" fill={colors.highlight} />
            <rect x="10" y="6" width="3" height="3" fill={colors.eyes} />
            <rect x="11" y="6" width="1" height="1" fill={colors.highlight} />

            {/* Boca redondita inquieta */}
            <rect x="7" y="10" width="2" height="2" fill={colors.mouth} />
          </>
        );

      case 'tired':
        // Rostro cansado: ojos entreabiertos caídos, ojeras suaves, somnoliento
        return (
          <>
            {/* Ojos pesados semi-cerrados */}
            <rect x="3" y="6" width="3" height="1" fill={colors.eyes} />
            <rect x="3" y="7" width="2" height="1" fill={colors.skinShadow} />
            <rect x="10" y="6" width="3" height="1" fill={colors.eyes} />
            <rect x="11" y="7" width="2" height="1" fill={colors.skinShadow} />

            {/* Ojeras sutiles */}
            <rect x="3" y="8" width="3" height="1" fill="#c49a88" opacity="0.6" />
            <rect x="10" y="8" width="3" height="1" fill="#c49a88" opacity="0.6" />

            {/* Boca bostezando o tenue */}
            <rect x="7" y="10" width="2" height="1" fill={colors.mouth} />
          </>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform ${
        selected ? 'scale-110' : 'hover:scale-105'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        className="pixel-art drop-shadow-sm"
        shapeRendering="crispEdges"
      >
        {/* Borde exterior de la cabeza (16x16 pixel art) */}
        {/* Fila superior e inferior */}
        <rect x="4" y="1" width="8" height="1" fill={colors.border} />
        <rect x="4" y="14" width="8" height="1" fill={colors.border} />

        {/* Esquinas */}
        <rect x="2" y="2" width="2" height="1" fill={colors.border} />
        <rect x="12" y="2" width="2" height="1" fill={colors.border} />
        <rect x="2" y="13" width="2" height="1" fill={colors.border} />
        <rect x="12" y="13" width="2" height="1" fill={colors.border} />

        {/* Laterales */}
        <rect x="1" y="3" width="1" height="10" fill={colors.border} />
        <rect x="14" y="3" width="1" height="10" fill={colors.border} />

        {/* Relleno de piel base */}
        <rect x="3" y="2" width="10" height="1" fill={colors.skin} />
        <rect x="2" y="3" width="12" height="10" fill={colors.skin} />
        <rect x="3" y="13" width="10" height="1" fill={colors.skinShadow} />

        {/* Sombra suave inferior de la cara */}
        <rect x="3" y="12" width="10" height="1" fill={colors.skinShadow} opacity="0.5" />

        {/* Rasgos específicos del estado de ánimo */}
        {renderFacePixels()}
      </svg>
    </div>
  );
};
