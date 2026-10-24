import React, { useState, useEffect, useRef } from 'react';
import { BreathingPattern } from '../../types/meditation';
import { soundEngine } from '../../services/soundEngine';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Maximize2, Minimize2, Bell } from 'lucide-react';
import { PixelIcon } from '../pixel/PixelIcon';

interface MeditationTimerProps {
  onSessionFinish: (durationMinutes: number, actualSeconds: number, techniqueName: string) => void;
  onOpenSoundMixer?: () => void;
  activeSoundCount?: number;
}

// Técnicas de respiración basadas en evidencia
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box_4_4',
    name: 'Respiración Cuadrada',
    description: '4s Inhala · 4s Retén · 4s Exhala · 4s Pausa',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  {
    id: 'calm_4_7_8',
    name: 'Calma Profunda (4-7-8)',
    description: '4s Inhala · 7s Retén · 8s Exhala suave',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
  },
  {
    id: 'coherent_5_5',
    name: 'Resonancia Cardíaca (5-5)',
    description: '5s Inhala · 5s Exhala continuo',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0,
  },
  {
    id: 'free_flow',
    name: 'Respiración Libre',
    description: 'Ritmo orgánico y natural sin conteo',
    inhale: 4,
    hold1: 1,
    exhale: 4,
    hold2: 1,
  },
];

const PRESET_DURATIONS = [3, 5, 10, 15, 20, 30]; // Minutos

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  onSessionFinish,
  onOpenSoundMixer,
  activeSoundCount = 0,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Estados de la fase de respiración actual
  type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(selectedPattern.inhale);

  const totalTargetSeconds = selectedDuration * 60;
  const remainingSeconds = Math.max(0, totalTargetSeconds - elapsedSeconds);

  // Referencias para timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Manejo del ciclo de respiración
  useEffect(() => {
    if (!isRunning) {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      return;
    }

    breathTimerRef.current = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Cambiar a la siguiente fase
          let nextPhase: BreathPhase = 'inhale';
          let nextDuration = selectedPattern.inhale;

          if (currentPhase === 'inhale') {
            if (selectedPattern.hold1 > 0) {
              nextPhase = 'hold1';
              nextDuration = selectedPattern.hold1;
            } else {
              nextPhase = 'exhale';
              nextDuration = selectedPattern.exhale;
            }
          } else if (currentPhase === 'hold1') {
            nextPhase = 'exhale';
            nextDuration = selectedPattern.exhale;
          } else if (currentPhase === 'exhale') {
            if (selectedPattern.hold2 > 0) {
              nextPhase = 'hold2';
              nextDuration = selectedPattern.hold2;
            } else {
              nextPhase = 'inhale';
              nextDuration = selectedPattern.inhale;
            }
          } else if (currentPhase === 'hold2') {
            nextPhase = 'inhale';
            nextDuration = selectedPattern.inhale;
          }

          setCurrentPhase(nextPhase);
          return nextDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [isRunning, currentPhase, selectedPattern]);

  // Manejo del temporizador de sesión principal
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= totalTargetSeconds) {
          handleFinishSession(next);
          return next;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, totalTargetSeconds]);

  const handleStart = () => {
    soundEngine.playSingingBowl(5); // Campana de inicio
    setIsRunning(true);
    setCurrentPhase('inhale');
    setPhaseSecondsLeft(selectedPattern.inhale);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setCurrentPhase('inhale');
    setPhaseSecondsLeft(selectedPattern.inhale);
  };

  const handleFinishSession = (seconds = elapsedSeconds) => {
    setIsRunning(false);
    soundEngine.playSingingBowl(6); // Campana de fin
    onSessionFinish(selectedDuration, seconds, selectedPattern.name);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Configuración de texto y escala según fase de respiración
  const getPhaseDetails = () => {
    switch (currentPhase) {
      case 'inhale':
        return {
          label: 'Inhala',
          sublabel: 'Llena de aire tus pulmones y expande el pecho',
          scale: 1.35,
          color: 'from-amber-400 via-orange-400 to-rose-400',
          glow: 'rgba(251, 146, 60, 0.45)',
        };
      case 'hold1':
        return {
          label: 'Sostén',
          sublabel: 'Siente la plenitud y calma en el pecho',
          scale: 1.35,
          color: 'from-amber-300 via-yellow-400 to-amber-500',
          glow: 'rgba(250, 204, 21, 0.45)',
        };
      case 'exhale':
        return {
          label: 'Exhala',
          sublabel: 'Suelta toda tensión suavemente por la boca',
          scale: 0.82,
          color: 'from-indigo-400 via-purple-400 to-pink-400',
          glow: 'rgba(168, 85, 247, 0.4)',
        };
      case 'hold2':
        return {
          label: 'Pausa',
          sublabel: 'Descansa en el vacío y sosiego',
          scale: 0.82,
          color: 'from-stone-500 via-purple-500 to-indigo-600',
          glow: 'rgba(148, 163, 184, 0.3)',
        };
    }
  };

  const phaseDetails = getPhaseDetails();

  return (
    <div
      className={`relative flex flex-col justify-between h-full min-h-[580px] p-5 transition-colors duration-700 ${
        isZenMode ? 'bg-[#0f0e17]' : 'bg-[#181622]'
      }`}
    >
      {/* Top Bar del Temporizador */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="font-pixel text-[10px] text-amber-300 tracking-wider uppercase">
            Mindfulness Activo
          </span>
          <h2 className="text-xl font-bold font-display text-white">Temporizador Visual</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Campana manual de prueba */}
          <button
            onClick={() => soundEngine.playSingingBowl(4)}
            title="Tocar cuenco tibetano"
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-amber-300 transition-colors border border-stone-700/50"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Acceso a mezclador sonoro */}
          {onOpenSoundMixer && (
            <button
              onClick={onOpenSoundMixer}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                activeSoundCount > 0
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                  : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{activeSoundCount > 0 ? `${activeSoundCount} pistas` : 'Sonidos'}</span>
            </button>
          )}

          {/* Toggle Modo Zen Pantalla Completa */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors border border-stone-700/50"
            title={isZenMode ? 'Salir de Modo Zen' : 'Modo Zen minimalista'}
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Selectores de Configuración (Visibles sólo si no está corriendo la sesión para evitar distracciones) */}
      {!isRunning && elapsedSeconds === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-3 space-y-3 z-10"
        >
          {/* Selector de Minutos */}
          <div>
            <label className="text-xs text-stone-400 font-medium block mb-1.5">
              Duración de la sesión:
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_DURATIONS.map((min) => (
                <button
                  key={min}
                  onClick={() => setSelectedDuration(min)}
                  className={`py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
                    selectedDuration === min
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'bg-stone-800/60 text-stone-400 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Patrón de Respiración */}
          <div>
            <label className="text-xs text-stone-400 font-medium block mb-1.5">
              Técnica de respiración:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BREATHING_PATTERNS.map((p) => {
                const isSelected = selectedPattern.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPattern(p);
                      setPhaseSecondsLeft(p.inhale);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/70 text-amber-100 shadow-sm'
                        : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">{p.name}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{p.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* --- ÁREA CENTRAL: ORBE DE RESPIRACIÓN PIXEL ART --- */}
      <div className="relative flex-1 flex flex-col items-center justify-center py-6">
        {/* Anillo de tiempo restante (SVG Circular) */}
        <div className="relative flex items-center justify-center">
          <svg className="w-72 h-72 transform -rotate-90">
            {/* Círculo de fondo */}
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="#262335"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Círculo de progreso */}
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="#f59e0b"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={
                2 * Math.PI * 130 * (1 - (totalTargetSeconds - remainingSeconds) / totalTargetSeconds)
              }
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Contenedor Interior del Orbe Animado */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Orbe de respiración pixelado animado con Motion */}
            <motion.div
              animate={{
                scale: isRunning ? phaseDetails.scale : 1,
              }}
              transition={{
                duration: isRunning ? phaseSecondsLeft : 1.2,
                ease: 'easeInOut',
              }}
              className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-2xl"
              style={{
                boxShadow: `0 0 60px ${phaseDetails.glow}`,
              }}
            >
              {/* Capas de degradado pixel art */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr ${phaseDetails.color} opacity-85 blur-sm transition-colors duration-1000`}
              />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/30 backdrop-blur-sm" />

              {/* Matriz pixelada central (SVG Orbe) */}
              <svg
                viewBox="0 0 16 16"
                className="w-24 h-24 pixel-art z-10 drop-shadow-md opacity-90"
                shapeRendering="crispEdges"
              >
                {/* Núcleo de luz pixelado */}
                <rect x="5" y="2" width="6" height="2" fill="#ffffff" />
                <rect x="3" y="4" width="10" height="2" fill="#fffbeb" />
                <rect x="2" y="6" width="12" height="4" fill="#fef08a" />
                <rect x="3" y="10" width="10" height="2" fill="#fde047" />
                <rect x="5" y="12" width="6" height="2" fill="#f59e0b" />
                {/* Destello cálido interior */}
                <rect x="6" y="6" width="4" height="4" fill="#ffffff" />
              </svg>

              {/* Texto de respiración sobre el orbe */}
              <div className="absolute z-20 text-center pointer-events-none">
                <span className="font-display font-bold text-2xl text-stone-950 tracking-wide drop-shadow-sm">
                  {isRunning ? phaseDetails.label : 'Listo'}
                </span>
                {isRunning && (
                  <span className="block font-mono text-sm font-bold text-stone-900/90">
                    {phaseSecondsLeft}s
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mensaje descriptivo de la fase de respiración */}
        <div className="mt-5 text-center h-12 flex flex-col items-center justify-center">
          {isRunning ? (
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-0.5"
            >
              <div className="text-xs font-semibold text-amber-200 uppercase tracking-widest font-pixel">
                Fase: {phaseDetails.label}
              </div>
              <div className="text-xs text-stone-400">{phaseDetails.sublabel}</div>
            </motion.div>
          ) : (
            <div className="text-xs text-stone-400 italic">
              Pulsa el botón de inicio cuando encuentres una postura cómoda
            </div>
          )}
        </div>

        {/* Tiempo digital grande */}
        <div className="mt-2 text-center">
          <div className="text-3xl font-mono font-bold tracking-wider text-white">
            {formatTime(remainingSeconds)}
          </div>
          <div className="text-[11px] text-stone-400 font-medium">
            Transcurrido: {formatTime(elapsedSeconds)} · Meta: {selectedDuration}m
          </div>
        </div>
      </div>

      {/* --- BARRA DE ACCIONES INFERIOR (Botones de control del temporizador) --- */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 z-10">
        <button
          onClick={handleReset}
          disabled={elapsedSeconds === 0 && !isRunning}
          className="p-3.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-stone-300 transition-colors border border-stone-700/50"
          title="Reiniciar temporizador"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Botón Principal Play / Pause */}
        <button
          onClick={isRunning ? handlePause : handleStart}
          className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{elapsedSeconds > 0 ? 'Reanudar' : 'Iniciar Sesión'}</span>
            </>
          )}
        </button>

        {/* Botón Finalizar Sesión Anticipada */}
        {elapsedSeconds > 30 && (
          <button
            onClick={() => handleFinishSession(elapsedSeconds)}
            className="px-4 py-3.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-amber-200 text-xs font-semibold transition-colors border border-stone-700/50"
          >
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
};
