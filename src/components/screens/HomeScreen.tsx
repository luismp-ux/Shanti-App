import React from 'react';
import { UserProgress, UnlockableItem } from '../../types/meditation';
import { PixelCozyRoom } from '../pixel/PixelCozyRoom';
import { PixelIcon } from '../pixel/PixelIcon';
import { Play, Sparkles, Flame, Clock, Trophy, ArrowRight, Heart } from 'lucide-react';

interface HomeScreenProps {
  progress: UserProgress;
  unlockablesList: UnlockableItem[];
  onStartMeditation: () => void;
  onOpenSoundscapes: () => void;
  onOpenProgress: () => void;
  onToggleItemActive: (itemId: string) => void;
  onOpenMoodCheckIn: () => void;
  activeSoundTracks?: string[];
}

const DAILY_REFLECTIONS = [
  'Shanti: La verdadera paz no depende de que todo esté en calma afuera, sino de la serenidad adentro.',
  'La mente es como el agua: cuando cesan las olas de agitación, todo se refleja con claridad.',
  'Una respiración consciente a la vez es suficiente para reconectar con tu santuario interior.',
  'El descanso consciente y la pausa no son un lujo, son la raíz de la compasión y la claridad.',
  'Deja que los pensamientos pasen como la lluvia al otro lado del cristal: obsérvalos y déjalos ir.',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  unlockablesList,
  onStartMeditation,
  onOpenSoundscapes,
  onOpenProgress,
  onToggleItemActive,
  onOpenMoodCheckIn,
  activeSoundTracks = [],
}) => {
  // Encontrar el siguiente elemento por desbloquear
  const nextItemToUnlock = unlockablesList.find(
    (item) => !progress.unlockedItemIds.includes(item.id)
  );

  // Cálculo de progreso hacia el siguiente item
  const minutesNeeded = nextItemToUnlock ? Math.max(0, nextItemToUnlock.requiredMinutes - progress.totalMinutes) : 0;
  const progressPercent = nextItemToUnlock
    ? Math.min(100, Math.round((progress.totalMinutes / nextItemToUnlock.requiredMinutes) * 100))
    : 100;

  // Reflexión diaria determinista basada en el día
  const dailyQuote = DAILY_REFLECTIONS[new Date().getDate() % DAILY_REFLECTIONS.length];

  return (
    <div className="flex flex-col h-full min-h-[580px] p-4 space-y-4 bg-[#14121e] text-stone-100 overflow-y-auto">
      {/* Top Header: Saludo y Racha Diaria */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="font-pixel text-[10px] text-amber-300 tracking-wider uppercase flex items-center gap-1.5">
            <span>शान्ति</span>
            <span>· Santuario Shanti</span>
          </span>
          <h1 className="text-xl font-bold font-display text-white tracking-tight">
            Paz interior, buscador
          </h1>
        </div>

        {/* Insignia de Racha Diaria (Streak) */}
        <div
          onClick={onOpenProgress}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 cursor-pointer hover:bg-amber-950/60 transition-colors shadow-sm"
        >
          <PixelIcon name="streak" size={20} />
          <div className="text-right">
            <span className="font-bold text-sm text-amber-300 font-mono leading-none block">
              {progress.streakDays}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-amber-400/80 font-medium">
              Días Racha
            </span>
          </div>
        </div>
      </div>

      {/* Frase / Intención Diaria Zen */}
      <div className="px-3.5 py-2.5 rounded-xl bg-stone-900/50 border border-stone-800/80 text-xs text-stone-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="italic leading-relaxed">{dailyQuote}</p>
      </div>

      {/* --- ESCENARIO PIXEL ART CENTRAL (Habitación Evolutiva) --- */}
      <div className="relative">
        <PixelCozyRoom
          unlockedItemIds={progress.unlockedItemIds}
          activeItemIds={progress.activeItemIds}
          onToggleItemActive={onToggleItemActive}
          unlockablesList={unlockablesList}
          activeSoundTracks={activeSoundTracks}
        />
      </div>

      {/* Botón Principal CTA: Iniciar Meditación & Acceso rápido a Mood */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onStartMeditation}
          className="col-span-3 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-sm shadow-lg shadow-orange-900/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Iniciar Sesión de Paz ({progress.preferredDuration || 10}m)</span>
        </button>

        <button
          onClick={onOpenMoodCheckIn}
          className="py-3.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700/60 flex flex-col items-center justify-center text-[10px] font-medium transition-colors"
          title="Hacer check-in de estado de ánimo"
        >
          <Heart className="w-4 h-4 text-rose-400 mb-0.5" />
          <span>Ánimo</span>
        </button>
      </div>

      {/* Próximo Desbloqueo (Gamificación de progreso) */}
      {nextItemToUnlock && (
        <div
          onClick={onOpenProgress}
          className="p-3 rounded-2xl bg-stone-900/40 border border-stone-800/90 hover:border-stone-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base">{nextItemToUnlock.icon}</span>
              <div>
                <span className="text-stone-400 text-[10px] block">Próximo objeto para tu espacio:</span>
                <span className="font-semibold text-stone-200">{nextItemToUnlock.name}</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-amber-300">
              {minutesNeeded > 0 ? `Faltan ${minutesNeeded} min` : '¡Listo para desbloquear!'}
            </span>
          </div>

          {/* Barra de progreso suave */}
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Métricas Resumen Rápidas */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-3 rounded-2xl bg-stone-900/40 border border-stone-800/80 text-center">
          <Clock className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
          <div className="text-base font-bold font-mono text-white leading-tight">
            {progress.totalMinutes}m
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Minutos Totales</div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-900/40 border border-stone-800/80 text-center">
          <Trophy className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
          <div className="text-base font-bold font-mono text-white leading-tight">
            {progress.totalSessions}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Sesiones</div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-900/40 border border-stone-800/80 text-center">
          <Flame className="w-3.5 h-3.5 text-orange-400 mx-auto mb-1" />
          <div className="text-base font-bold font-mono text-white leading-tight">
            {progress.bestStreak}d
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Mejor Racha</div>
        </div>
      </div>
    </div>
  );
};
