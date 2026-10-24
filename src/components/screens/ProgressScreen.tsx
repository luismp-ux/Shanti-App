import React from 'react';
import { UserProgress, MeditationSession, UnlockableItem } from '../../types/meditation';
import { PixelFace } from '../pixel/PixelFace';
import { Trophy, Calendar, Check, Clock, Flame, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface ProgressScreenProps {
  progress: UserProgress;
  sessions: MeditationSession[];
  unlockablesList: UnlockableItem[];
  onToggleItemActive: (itemId: string) => void;
  onOpenApkModal?: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  progress,
  sessions,
  unlockablesList,
  onToggleItemActive,
  onOpenApkModal,
}) => {
  const isUnlocked = (id: string) => progress.unlockedItemIds.includes(id);
  const isActive = (id: string) => progress.activeItemIds.includes(id);

  // Estadísticas de cambio de ánimo
  const moodTransitions = sessions.filter((s) => s.preMood && s.postMood);

  return (
    <div className="flex flex-col h-full min-h-[580px] p-4 space-y-5 bg-[#171521] text-stone-100 overflow-y-auto">
      {/* Header */}
      <div>
        <span className="font-pixel text-[10px] text-amber-300 tracking-wider uppercase">
          Evolución & Santuario
        </span>
        <h2 className="text-xl font-bold font-display text-white">Tu Viaje de Mindfulness</h2>
      </div>

      {/* Tarjeta de Racha y Tiempo */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-stone-900 border border-amber-600/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-stone-400 font-medium">Racha Actual</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {progress.streakDays} <span className="text-xs font-sans font-normal text-stone-400">días</span>
          </div>
          <p className="text-[10px] text-stone-400 mt-1">Mejor marca: {progress.bestStreak} días seguidos</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-stone-900 border border-indigo-600/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-stone-400 font-medium">Tiempo Meditado</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-200">
            {progress.totalMinutes} <span className="text-xs font-sans font-normal text-stone-400">min</span>
          </div>
          <p className="text-[10px] text-stone-400 mt-1">{progress.totalSessions} sesiones registradas</p>
        </div>
      </div>

      {/* Tarjeta de Estado del APK y Actualizaciones In-App */}
      {onOpenApkModal && (
        <div
          onClick={onOpenApkModal}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#201c34] to-[#1a1728] border border-amber-500/30 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500/60 transition-all shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">Actualizaciones In-App & APK</span>
                <span className="text-[9px] font-pixel text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  ACTIVO
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Versión 1.0.4 instalada · Comprobar actualizaciones OTA
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium border border-amber-500/30 shrink-0">
            Gestionar
          </button>
        </div>
      )}

      {/* Catálogo de Elementos Desbloqueables del Escenario */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold font-display text-stone-200 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Colección del Santuario Cozy ({progress.unlockedItemIds.length}/{unlockablesList.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {unlockablesList.map((item) => {
            const unlocked = isUnlocked(item.id);
            const active = isActive(item.id);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all ${
                  unlocked
                    ? 'bg-stone-900/60 border-stone-800'
                    : 'bg-stone-950/40 border-stone-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl p-2 rounded-xl bg-stone-800/80 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        {unlocked && (
                          <span className="text-[9px] font-pixel text-emerald-400 px-1.5 py-0.5 bg-emerald-950/40 rounded border border-emerald-800/30">
                            DESBLOQUEADO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-300 mt-0.5">{item.description}</p>
                      <p className="text-[10px] text-stone-400 italic mt-0.5">{item.lore}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {unlocked ? (
                      <button
                        onClick={() => onToggleItemActive(item.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
                          active
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-white'
                        }`}
                      >
                        {active ? 'En la sala' : 'Guardar'}
                      </button>
                    ) : (
                      <div className="text-[10px] text-stone-400 font-mono">
                        Req: {item.requiredMinutes}m · {item.requiredStreak}d racha
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historial de Sesiones */}
      <div>
        <h3 className="text-sm font-bold font-display text-stone-200 mb-2.5 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Historial Reciente de Meditación</span>
        </h3>

        <div className="space-y-2">
          {sessions.slice(0, 5).map((sess) => {
            const dateStr = new Date(sess.timestamp).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={sess.id}
                className="p-3 rounded-2xl bg-stone-900/40 border border-stone-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{sess.technique}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {dateStr} · {sess.durationMinutes} minutos reales
                  </div>
                  {sess.soundscapeSummary && sess.soundscapeSummary.length > 0 && (
                    <div className="text-[10px] text-amber-400/80 mt-0.5">
                      Pistas: {sess.soundscapeSummary.join(', ')}
                    </div>
                  )}
                </div>

                {sess.preMood && sess.postMood && (
                  <div className="flex items-center gap-1.5 bg-stone-950/60 p-1.5 rounded-xl border border-stone-800 shrink-0">
                    <PixelFace mood={sess.preMood} size={22} />
                    <ArrowRight className="w-3 h-3 text-stone-500" />
                    <PixelFace mood={sess.postMood} size={22} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
