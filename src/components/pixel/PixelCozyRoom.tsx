import React, { useState, useEffect } from 'react';
import { UnlockableItem, TimeOfDay, WeatherElement } from '../../types/meditation';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, CloudRain, Wind, Sun, Moon, Info } from 'lucide-react';

interface PixelCozyRoomProps {
  unlockedItemIds: string[];
  activeItemIds: string[];
  onToggleItemActive: (itemId: string) => void;
  unlockablesList: UnlockableItem[];
  activeSoundTracks?: string[]; // Para auto-detectar lluvia o viento si están activos en SoundMixer
}

export const PixelCozyRoom: React.FC<PixelCozyRoomProps> = ({
  unlockedItemIds,
  activeItemIds,
  onToggleItemActive,
  unlockablesList,
  activeSoundTracks = [],
}) => {
  const [selectedItem, setSelectedItem] = useState<UnlockableItem | null>(null);

  // 3 Escenarios solicitados: Mañana, Tarde, Noche
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noche');

  // Elementos secundarios en el escenario: Lluvia, Viento, Sol
  const [weather, setWeather] = useState<{
    lluvia: boolean;
    viento: boolean;
    sol: boolean;
  }>({
    lluvia: true, // Lluvia activa por defecto evocando la imagen de referencia
    viento: false,
    sol: false,
  });

  // Sincronizar automáticamente clima con el mezclador de sonidos si el usuario activa lluvia/viento
  useEffect(() => {
    if (activeSoundTracks.includes('rain') && !weather.lluvia) {
      setWeather((prev) => ({ ...prev, lluvia: true }));
    }
    if (activeSoundTracks.includes('wind') && !weather.viento) {
      setWeather((prev) => ({ ...prev, viento: true }));
    }
  }, [activeSoundTracks]);

  const isUnlocked = (id: string) => unlockedItemIds.includes(id);
  const isActive = (id: string) => activeItemIds.includes(id);

  // Paletas de color atmosféricas para los 3 momentos del día (Mañana, Tarde, Noche)
  const atmospheres = {
    manana: {
      wall: '#2a2842',
      floor: '#211e33',
      skyTop: '#ff9a76',
      skyBottom: '#7ec4cf',
      citySilhouette: '#1d273a',
      citySilhouetteFront: '#161f2e',
      curtain: '#2a254d',
      roomLightingOverlay: 'rgba(255, 230, 200, 0.12)',
      screenGlow: '#99f6e4',
    },
    tarde: {
      wall: '#382236',
      floor: '#291827',
      skyTop: '#ea580c',
      skyBottom: '#f97316',
      citySilhouette: '#2e1529',
      citySilhouetteFront: '#200c1c',
      curtain: '#3f1f3a',
      roomLightingOverlay: 'rgba(251, 146, 60, 0.16)',
      screenGlow: '#fde047',
    },
    noche: {
      wall: '#201c3b',
      floor: '#16132b',
      skyTop: '#101a30',
      skyBottom: '#183452',
      citySilhouette: '#13243a',
      citySilhouetteFront: '#0d1829',
      curtain: '#13112c',
      roomLightingOverlay: 'rgba(24, 52, 82, 0.1)',
      screenGlow: '#5eead4',
    },
  };

  const currentAtmo = atmospheres[timeOfDay];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#12101e] select-none">
      {/* Barra de control superior del escenario: Escenarios (Mañana/Tarde/Noche) y Clima (Lluvia/Viento/Sol) */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Selector de los 3 momentos del día */}
        <div className="flex items-center gap-1 bg-[#100e1c]/80 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => {
              setTimeOfDay('manana');
              if (weather.sol === false) setWeather((w) => ({ ...w, sol: true }));
            }}
            className={`px-2 py-1 rounded-lg transition-all font-medium text-[11px] flex items-center gap-1 ${
              timeOfDay === 'manana'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/30 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3 text-amber-400" />
            <span>Mañana</span>
          </button>

          <button
            onClick={() => setTimeOfDay('tarde')}
            className={`px-2 py-1 rounded-lg transition-all font-medium text-[11px] flex items-center gap-1 ${
              timeOfDay === 'tarde'
                ? 'bg-orange-500/30 text-orange-200 border border-orange-400/30 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>🌇</span>
            <span>Tarde</span>
          </button>

          <button
            onClick={() => {
              setTimeOfDay('noche');
              setWeather((w) => ({ ...w, sol: false }));
            }}
            className={`px-2 py-1 rounded-lg transition-all font-medium text-[11px] flex items-center gap-1 ${
              timeOfDay === 'noche'
                ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Moon className="w-3 h-3 text-cyan-300" />
            <span>Noche</span>
          </button>
        </div>

        {/* Interruptores de Elementos Secundarios: Lluvia, Viento, Sol */}
        <div className="flex items-center gap-1 bg-[#100e1c]/80 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setWeather((w) => ({ ...w, lluvia: !w.lluvia }))}
            title="Activar/desactivar lluvia"
            className={`p-1.5 rounded-lg transition-all ${
              weather.lluvia
                ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setWeather((w) => ({ ...w, viento: !w.viento }))}
            title="Activar/desactivar viento"
            className={`p-1.5 rounded-lg transition-all ${
              weather.viento
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setWeather((w) => ({ ...w, sol: !w.sol }))}
            title="Activar/desactivar rayos de sol"
            className={`p-1.5 rounded-lg transition-all ${
              weather.sol
                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Pixel Art Inspirado en la Imagen de Referencia (220 x 120 resolución lógica) */}
      <svg
        viewBox="0 0 220 120"
        className="w-full h-auto block pixel-art"
        style={{ backgroundColor: currentAtmo.wall }}
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Cielo Ventanal */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={currentAtmo.skyTop} />
            <stop offset="100%" stopColor={currentAtmo.skyBottom} />
          </linearGradient>

          {/* Resplandor Monitor Lo-Fi */}
          <radialGradient id="screenRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={currentAtmo.screenGlow} stopOpacity="0.45" />
            <stop offset="100%" stopColor={currentAtmo.screenGlow} stopOpacity="0" />
          </radialGradient>

          {/* Rayos de sol volumétricos */}
          <linearGradient id="sunbeamGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ========================================================= */}
        {/* 1. VENTANAL PANORÁMICO (LADO IZQUIERDO - 14 a 135)        */}
        {/* ========================================================= */}
        <g>
          {/* Relleno del cielo exterior */}
          <rect x="18" y="7" width="116" height="88" fill="url(#skyGrad)" />

          {/* Luna Creciente Cian / Dorada */}
          {timeOfDay === 'noche' && (
            <g>
              <ellipse cx="38" cy="22" rx="7" ry="8" fill="#5eead4" />
              <ellipse cx="41" cy="22" rx="6" ry="8" fill={currentAtmo.skyTop} />
            </g>
          )}

          {/* Sol en Mañana / Tarde */}
          {timeOfDay === 'manana' && (
            <circle cx="40" cy="22" r="7" fill="#fef08a" opacity="0.9" />
          )}
          {timeOfDay === 'tarde' && (
            <circle cx="44" cy="28" r="9" fill="#f97316" opacity="0.85" />
          )}

          {/* Estrellas Titilantes en Noche */}
          {timeOfDay === 'noche' && (
            <g className="animate-pulse">
              <rect x="26" y="16" width="1" height="1" fill="#ffffff" />
              <rect x="52" y="14" width="1" height="1" fill="#bae6fd" />
              <rect x="74" y="22" width="1" height="1" fill="#ffffff" />
              <rect x="96" y="15" width="1" height="1" fill="#bae6fd" />
              <rect x="115" y="24" width="1" height="1" fill="#ffffff" />
              <rect x="62" y="32" width="1" height="1" fill="#bae6fd" />
              <rect x="85" y="36" width="1" height="1" fill="#ffffff" />
            </g>
          )}

          {/* Skyline de la Ciudad (Siluetas de Rascacielos - Capa de Fondo) */}
          <g fill={currentAtmo.citySilhouette}>
            <rect x="20" y="65" width="12" height="30" />
            <rect x="34" y="58" width="14" height="37" />
            <rect x="50" y="62" width="10" height="33" />
            <rect x="62" y="52" width="18" height="43" />
            <rect x="82" y="57" width="15" height="38" />
            <rect x="99" y="60" width="16" height="35" />
            <rect x="117" y="66" width="15" height="29" />
          </g>

          {/* Skyline Frontal (Capa Intermedia con Ventanas Iluminadas) */}
          <g fill={currentAtmo.citySilhouetteFront}>
            <rect x="25" y="70" width="16" height="25" />
            <rect x="44" y="66" width="14" height="29" />
            <rect x="68" y="60" width="20" height="35" />
            <rect x="90" y="68" width="14" height="27" />
            <rect x="106" y="64" width="22" height="31" />
          </g>

          {/* Luces de ventanas de la ciudad nocturna */}
          {timeOfDay === 'noche' && (
            <g fill="#7dd3fc" opacity="0.6">
              <rect x="28" y="73" width="1" height="1" />
              <rect x="31" y="76" width="1" height="1" />
              <rect x="47" y="70" width="1" height="1" />
              <rect x="53" y="74" width="1" height="1" />
              <rect x="72" y="64" width="1" height="1" />
              <rect x="76" y="68" width="1" height="1" />
              <rect x="80" y="64" width="1" height="1" />
              <rect x="94" y="72" width="1" height="1" />
              <rect x="110" y="68" width="1" height="1" />
              <rect x="118" y="72" width="1" height="1" />
            </g>
          )}

          {/* --- ELEMENTO SECUNDARIO: LLUVIA PIXELADA CAYENDO EN LA VENTANA --- */}
          {weather.lluvia && (
            <g opacity="0.85">
              {/* Gotas/trazas de lluvia verticales auténticas de la imagen de referencia */}
              <line x1="28" y1="18" x2="28" y2="28" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="42" y1="30" x2="42" y2="44" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="56" y1="14" x2="56" y2="26" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="70" y1="36" x2="70" y2="52" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="4 3" />
              <line x1="84" y1="20" x2="84" y2="34" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="98" y1="32" x2="98" y2="48" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="4 3" />
              <line x1="112" y1="16" x2="112" y2="30" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="126" y1="34" x2="126" y2="50" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4 2" />

              {/* Gotas adicionales dispersas */}
              <rect x="34" y="52" width="1" height="3" fill="#e0f2fe" opacity="0.6" />
              <rect x="62" y="62" width="1" height="4" fill="#e0f2fe" opacity="0.6" />
              <rect x="90" y="56" width="1" height="3" fill="#e0f2fe" opacity="0.6" />
              <rect x="118" y="64" width="1" height="4" fill="#e0f2fe" opacity="0.6" />
            </g>
          )}

          {/* --- ELEMENTO SECUNDARIO: VIENTO / BRISA FLOTANDO --- */}
          {weather.viento && (
            <g opacity="0.75" className="animate-pulse">
              <path d="M 24 38 Q 40 34 56 38" stroke="#6ee7b7" strokeWidth="0.8" fill="transparent" />
              <path d="M 64 48 Q 80 44 96 48" stroke="#6ee7b7" strokeWidth="0.8" fill="transparent" />
              {/* Hoja verde flotando */}
              <rect x="52" y="36" width="2" height="1" fill="#4ade80" />
              <rect x="88" y="46" width="2" height="1" fill="#4ade80" />
            </g>
          )}

          {/* --- ELEMENTO SECUNDARIO: RAYOS DE SOL VOLUMÉTRICOS --- */}
          {weather.sol && (
            <polygon
              points="18,7 60,7 120,95 40,95"
              fill="url(#sunbeamGrad)"
              className="pointer-events-none"
            />
          )}

          {/* Marco Superior y Riel de la Cortina */}
          <rect x="0" y="5" width="145" height="3" fill="#3a3455" />
          {/* Anillas de la cortina */}
          <rect x="8" y="4" width="2" height="1" fill="#71717a" />
          <rect x="14" y="4" width="2" height="1" fill="#71717a" />
          <rect x="20" y="4" width="2" height="1" fill="#71717a" />

          {/* Gran Cortina Izquierda Plegada */}
          <rect x="0" y="8" width="18" height="92" fill={currentAtmo.curtain} />
          {/* Pliegues verticales de la cortina */}
          <line x1="5" y1="8" x2="5" y2="100" stroke="#0b0a1a" strokeWidth="1" />
          <line x1="11" y1="8" x2="11" y2="100" stroke="#0b0a1a" strokeWidth="1" />
          <line x1="17" y1="8" x2="17" y2="100" stroke="#0b0a1a" strokeWidth="1" />
        </g>

        {/* ========================================================= */}
        {/* 2. SUELO DE LA HABITACIÓN (y=94 hacia abajo)              */}
        {/* ========================================================= */}
        <rect x="0" y="94" width="220" height="26" fill={currentAtmo.floor} />
        {/* Línea de rodapié */}
        <rect x="0" y="93" width="220" height="1" fill="#0d0a17" />
        {/* Listones de madera del suelo */}
        <line x1="0" y1="102" x2="220" y2="102" stroke="#120e21" strokeWidth="0.8" />
        <line x1="0" y1="111" x2="220" y2="111" stroke="#120e21" strokeWidth="0.8" />

        {/* ========================================================= */}
        {/* 3. CAMA Y MASCOTA (EL PERRITO 'BODHI' SENTADO)            */}
        {/* ========================================================= */}
        <g
          className="cursor-pointer"
          onClick={() => {
            const item = unlockablesList.find((i) => i.id === 'golden_pup');
            if (item) setSelectedItem(item);
          }}
        >
          {/* Base de la cama */}
          <rect x="14" y="86" width="100" height="15" fill="#0c1126" />
          <rect x="14" y="84" width="100" height="3" fill="#1b2342" />

          {/* Colchón y edredón azul noche acogedor */}
          <rect x="16" y="78" width="96" height="9" fill="#1e3a68" />
          <rect x="16" y="76" width="96" height="3" fill="#2d528f" />

          {/* Almohadas mullidas al lado izquierdo */}
          <rect x="20" y="72" width="18" height="6" fill="#0d7490" />
          <rect x="22" y="73" width="14" height="4" fill="#14b8a6" />
          <rect x="36" y="74" width="18" height="5" fill="#0891b2" />

          {/* Sábana doblada en el borde */}
          <rect x="74" y="76" width="38" height="11" fill="#38bdf8" opacity="0.75" />

          {/* Mueblecito bajo junto a la cama */}
          <rect x="84" y="88" width="30" height="12" fill="#1e1833" />
          <rect x="85" y="89" width="28" height="10" fill="#292243" />

          {/* PERRITO DORADO 'BODHI' SENTADO EN LA CAMA (Como en la foto) */}
          {isUnlocked('golden_pup') && isActive('golden_pup') && (
            <g className="transition-transform">
              {/* Sombra debajo del perrito */}
              <ellipse cx="90" cy="77" rx="9" ry="2.5" fill="#0d1b33" />

              {/* Cuerpo regordete y cálido */}
              <rect x="84" y="67" width="13" height="9" fill="#d97706" />
              <rect x="85" y="68" width="11" height="7" fill="#f59e0b" />

              {/* Cabeza del cachorro */}
              <rect x="91" y="63" width="8" height="7" fill="#d97706" />
              <rect x="92" y="64" width="6" height="5" fill="#f59e0b" />

              {/* Hocico claro */}
              <rect x="96" y="65" width="3" height="3" fill="#fed7aa" />
              {/* Trufa / nariz negra */}
              <rect x="98" y="65" width="1.5" height="1.5" fill="#18181b" />

              {/* Ojo negro sereno */}
              <rect x="94" y="65" width="1.2" height="1.5" fill="#18181b" />

              {/* Orejita doblada tierna */}
              <rect x="90" y="64" width="2" height="3" fill="#b45309" />

              {/* Cola curvada hacia arriba */}
              <rect x="80" y="67" width="4" height="2" fill="#d97706" />
              <rect x="79" y="66" width="2" height="2" fill="#f59e0b" />

              {/* Patitas apoyadas */}
              <rect x="87" y="75" width="3" height="2" fill="#b45309" />
              <rect x="93" y="75" width="3" height="2" fill="#b45309" />
            </g>
          )}
        </g>

        {/* ========================================================= */}
        {/* 4. MÓVIL COLGANTE DE PLANETAS (SOBRE LA CAMA)             */}
        {/* ========================================================= */}
        {isUnlocked('hanging_mobile') && isActive('hanging_mobile') && (
          <g
            className="cursor-pointer"
            onClick={() => {
              const item = unlockablesList.find((i) => i.id === 'hanging_mobile');
              if (item) setSelectedItem(item);
            }}
            opacity="0.85"
          >
            {/* Cuerda central desde el techo */}
            <line x1="180" y1="0" x2="180" y2="12" stroke="#52525b" strokeWidth="0.8" />
            {/* Barra horizontal cruzada */}
            <line x1="165" y1="12" x2="195" y2="12" stroke="#71717a" strokeWidth="1" />

            {/* Planeta 1 con Anillos de Saturno */}
            <line x1="168" y1="12" x2="168" y2="22" stroke="#52525b" strokeWidth="0.6" />
            <ellipse cx="168" cy="24" rx="4" ry="4" fill="#a78bfa" />
            <ellipse cx="168" cy="24" rx="7" ry="1.8" fill="transparent" stroke="#e0e7ff" strokeWidth="0.8" />

            {/* Planeta 2 (Esfera verde / Luna) */}
            <line x1="192" y1="12" x2="192" y2="20" stroke="#52525b" strokeWidth="0.6" />
            <circle cx="192" cy="22" r="3" fill="#34d399" />

            {/* Estrella o luna colgante central */}
            <line x1="180" y1="12" x2="180" y2="26" stroke="#52525b" strokeWidth="0.6" />
            <circle cx="180" cy="27" r="1.5" fill="#fef08a" />
          </g>
        )}

        {/* ========================================================= */}
        {/* 5. PARED DERECHA: CUADROS "I ❤️ U" Y LETRERO "SHANTI"     */}
        {/* ========================================================= */}
        <g
          className="cursor-pointer"
          onClick={() => {
            const item = unlockablesList.find((i) => i.id === 'shanti_art');
            if (item) setSelectedItem(item);
          }}
        >
          {/* Tres cuadros pequeños estilo de la foto ("I", "❤️", "U") */}
          {/* Cuadro 1: "I" */}
          <rect x="154" y="38" width="12" height="13" fill="#1b172e" />
          <rect x="155" y="39" width="10" height="11" fill="#e2e8f0" />
          <rect x="159" y="42" width="2" height="5" fill="#1e1b2e" />
          <rect x="158" y="41" width="4" height="1" fill="#1e1b2e" />
          <rect x="158" y="47" width="4" height="1" fill="#1e1b2e" />

          {/* Cuadro 2: "❤️" */}
          <rect x="171" y="38" width="12" height="13" fill="#1b172e" />
          <rect x="172" y="39" width="10" height="11" fill="#e2e8f0" />
          <polygon points="174,43 176,41 178,43 180,41 182,43 178,48" fill="#ef4444" />

          {/* Cuadro 3: "U" */}
          <rect x="188" y="38" width="12" height="13" fill="#1b172e" />
          <rect x="189" y="39" width="10" height="11" fill="#e2e8f0" />
          <path d="M 192 42 L 192 46 Q 194 48 196 46 L 196 42" stroke="#1e1b2e" strokeWidth="1.5" fill="transparent" />

          {/* Letrero con la palabra "SHANTI" (Paz Interior) */}
          <rect x="168" y="55" width="22" height="7" fill="#1b172e" />
          <rect x="169" y="56" width="20" height="5" fill="#f1f5f9" />
          <text
            x="171"
            y="60"
            fill="#1e1b2e"
            fontSize="3.6"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.8"
          >
            SHANTI
          </text>

          {/* Pequeño interruptor de luz en la pared */}
          <rect x="140" y="64" width="4" height="6" fill="#1e1830" />
          <rect x="141" y="65" width="2" height="4" fill="#e2e8f0" />
          <rect x="141.5" y="66" width="1" height="1.5" fill="#94a3b8" />

          {/* Estante de pared con libros Zen a la derecha */}
          <rect x="207" y="48" width="13" height="2" fill="#3f2b45" />
          <rect x="209" y="42" width="2" height="6" fill="#38bdf8" />
          <rect x="212" y="41" width="2.5" height="7" fill="#fbbf24" />
          <rect x="215" y="43" width="2" height="5" fill="#f43f5e" />
        </g>

        {/* ========================================================= */}
        {/* 6. ESCRITORIO, MONITOR, PERSONAJE MEDITANDO Y SETUP LO-FI */}
        {/* ========================================================= */}
        <g>
          {/* Mueble del escritorio (con estantes abajo) */}
          <rect x="172" y="78" width="42" height="23" fill="#16233b" />
          <rect x="170" y="76" width="45" height="3" fill="#203354" />

          {/* Estantería derecha del escritorio */}
          <rect x="194" y="79" width="1" height="22" fill="#0f172a" />
          <rect x="194" y="87" width="20" height="1.5" fill="#0f172a" />

          {/* Torre del PC con tira LED RGB al pie (como en la foto de ref) */}
          <rect x="196" y="89" width="16" height="11" fill="#090d16" />
          {/* Tira LED RGB animada */}
          <g className="animate-pulse">
            <rect x="198" y="97" width="12" height="1.5" fill="#38bdf8" />
            <rect x="203" y="96" width="2" height="1.5" fill="#a855f7" />
          </g>

          {/* Resplandor radial emitido por el monitor */}
          <circle cx="187" cy="69" r="22" fill="url(#screenRadial)" />

          {/* Monitor Lo-Fi en el escritorio */}
          {/* Pie del monitor */}
          <rect x="186" y="72" width="2" height="4" fill="#0f172a" />
          <rect x="183" y="75" width="8" height="1.5" fill="#0f172a" />
          {/* Pantalla del monitor */}
          <rect x="176" y="61" width="22" height="12" fill="#090d16" />
          <rect x="177" y="62" width="20" height="10" fill={currentAtmo.screenGlow} opacity="0.9" />
          {/* Texto 'HI' en el monitor (como en la imagen de referencia) */}
          <text
            x="183"
            y="69"
            fill="#0f172a"
            fontSize="4.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            HI
          </text>

          {/* Taza humeante de té en el escritorio */}
          {isUnlocked('steaming_tea') && isActive('steaming_tea') && (
            <g
              className="cursor-pointer"
              onClick={() => {
                const item = unlockablesList.find((i) => i.id === 'steaming_tea');
                if (item) setSelectedItem(item);
              }}
            >
              <rect x="200" y="73" width="3" height="3" fill="#cbd5e1" />
              {/* Vapor */}
              <rect x="201" y="70" width="1" height="2" fill="#f8fafc" opacity="0.7" className="animate-pulse" />
            </g>
          )}

          {/* Pequeña plantita en el estante del escritorio */}
          <g>
            <rect x="198" y="83" width="4" height="3" fill="#78350f" />
            <rect x="199" y="81" width="2" height="2" fill="#22c55e" />
          </g>

          {/* Silla ergonómica de escritorio con ruedas */}
          <rect x="156" y="80" width="13" height="3" fill="#1e293b" />
          <rect x="154" y="70" width="3" height="13" fill="#1e293b" />
          <line x1="162" y1="83" x2="162" y2="95" stroke="#334155" strokeWidth="1.5" />
          <line x1="157" y1="95" x2="167" y2="95" stroke="#334155" strokeWidth="1.5" />

          {/* PERSONAJE LO-FI MEDITANDO / TRABAJANDO (Inspirado en la imagen) */}
          <g>
            {/* Piernas relajadas en la silla */}
            <rect x="163" y="81" width="9" height="4" fill="#64748b" />
            <rect x="170" y="84" width="4" height="11" fill="#e2e8f0" />
            {/* Pies / calcetines blancos */}
            <rect x="170" y="94" width="7" height="3" fill="#f8fafc" />

            {/* Torso con sudadera holgada */}
            <rect x="158" y="71" width="10" height="11" fill="#64748b" />
            <rect x="160" y="73" width="8" height="9" fill="#94a3b8" />

            {/* Brazos hacia el teclado */}
            <rect x="166" y="76" width="11" height="2.5" fill="#94a3b8" />

            {/* Cabeza y cabello castaño acogedor */}
            <circle cx="163" cy="65" r="5" fill="#78350f" />
            <rect x="161" y="62" width="8" height="6" fill="#a16207" />
            {/* Rostro suave en perfil */}
            <rect x="165" y="64" width="4" height="4" fill="#ffedd5" />
            {/* Ojo relajado en calma */}
            <rect x="167" y="65" width="1" height="1" fill="#1c1917" />
          </g>

          {/* Mochila apoyada en el suelo junto a la silla */}
          <rect x="142" y="84" width="10" height="12" fill="#18181b" rx="2" />
          <rect x="144" y="86" width="6" height="8" fill="#27272a" />
          <rect x="146" y="82" width="2" height="3" fill="#3f3f46" />

          {/* Botella / termo de agua al extremo derecho */}
          <rect x="215" y="88" width="3" height="8" fill="#18181b" />
          <rect x="215.5" y="86" width="2" height="2" fill="#38bdf8" />
        </g>
      </svg>

      {/* Modal / Sheet Informativo al hacer clic en un objeto decorativo */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute inset-x-3 bottom-3 z-40 p-3 bg-stone-900/95 backdrop-blur-md rounded-2xl border border-stone-700/60 shadow-xl text-stone-100 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 bg-stone-800 rounded-xl">{selectedItem.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-xs text-amber-200">{selectedItem.name}</h4>
                  {isUnlocked(selectedItem.id) ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Desbloqueado
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400">
                      Req: {selectedItem.requiredMinutes}m · Racha {selectedItem.requiredStreak}d
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 line-clamp-1">{selectedItem.description}</p>
                <p className="text-[10px] text-amber-300/80 italic mt-0.5">{selectedItem.lore}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isUnlocked(selectedItem.id) ? (
                <button
                  onClick={() => onToggleItemActive(selectedItem.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                    isActive(selectedItem.id)
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
                  }`}
                >
                  {isActive(selectedItem.id) ? 'En habitación' : 'Guardar'}
                </button>
              ) : (
                <div className="text-[10px] text-amber-300/80 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40">
                  Bloqueado
                </div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pie de Escenario con Información de Shanti */}
      <div className="px-4 py-2.5 bg-[#141122] border-t border-white/5 flex items-center justify-between text-xs text-stone-300">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-amber-400 font-pixel">शान्ति</span>
          <span className="text-stone-300">
            Escenario: <strong className="text-white capitalize">{timeOfDay}</strong> · Clima:{' '}
            <span className="text-stone-400">
              {weather.lluvia ? 'Lluvia' : ''} {weather.viento ? '· Viento' : ''}{' '}
              {weather.sol ? '· Sol' : ''} {!weather.lluvia && !weather.viento && !weather.sol ? 'Despejado' : ''}
            </span>
          </span>
        </div>
        <div className="text-stone-400 font-pixel text-[10px]">
          {activeItemIds.length}/{unlockablesList.length} ACTIVOS
        </div>
      </div>
    </div>
  );
};
