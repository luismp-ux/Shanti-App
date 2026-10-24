import React, { useState } from 'react';
import { SoundTrack } from '../../types/meditation';
import { soundEngine } from '../../services/soundEngine';
import { PixelIcon } from '../pixel/PixelIcon';
import { Volume2, VolumeX, Sparkles, Sliders, Play, Square } from 'lucide-react';

interface SoundMixerProps {
  tracks: SoundTrack[];
  onUpdateTrack: (trackId: string, isPlaying: boolean, volume: number) => void;
  onSetPreset: (presetName: string) => void;
  onStopAllSounds: () => void;
}

export const SOUND_PRESETS = [
  {
    name: 'Cabaña Lluviosa',
    description: 'Lluvia constante y leña crepitando al calor del fuego',
    icon: '🌧️',
    tracks: { rain: 65, fire: 50, wind: 20 },
  },
  {
    name: 'Noche de Campamento',
    description: 'Fuego de campamento, viento suave y grillos nocturnos',
    icon: '🏕️',
    tracks: { fire: 60, wind: 30, crickets: 45 },
  },
  {
    name: 'Ribera del Bosque',
    description: 'Corriente de agua pura con pájaros lejanos y brisa',
    icon: '🍃',
    tracks: { river: 60, birds: 35, wind: 25 },
  },
  {
    name: 'Silencio Aislante',
    description: 'Onda de ruido marrón profundo para silenciar pensamientos',
    icon: '🧘',
    tracks: { brownNoise: 55, rain: 25 },
  },
];

export const SoundMixer: React.FC<SoundMixerProps> = ({
  tracks,
  onUpdateTrack,
  onSetPreset,
  onStopAllSounds,
}) => {
  const [masterVolume, setMasterVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const activeTracksCount = tracks.filter((t) => t.isPlaying).length;

  const handleMasterVolumeChange = (newVol: number) => {
    setMasterVolume(newVol);
    if (!isMuted) {
      soundEngine.setMasterVolume(newVol);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      soundEngine.setMasterVolume(masterVolume);
    } else {
      setIsMuted(true);
      soundEngine.setMasterVolume(0);
    }
  };

  const handleTrackToggle = (track: SoundTrack) => {
    const nextPlaying = !track.isPlaying;
    const vol = track.volume || 60;
    onUpdateTrack(track.id, nextPlaying, vol);
    soundEngine.setTrack(track.id, nextPlaying, vol);
  };

  const handleVolumeChange = (trackId: string, newVol: number) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return;
    const isPlaying = newVol > 0 ? true : track.isPlaying;
    onUpdateTrack(trackId, isPlaying, newVol);
    soundEngine.setTrack(trackId, isPlaying, newVol);
  };

  const applyPreset = (preset: typeof SOUND_PRESETS[0]) => {
    // Aplicar preset en lote
    const presetTracks = preset.tracks as unknown as Record<string, number | undefined>;
    tracks.forEach((t) => {
      const vol = presetTracks[t.id];
      if (vol !== undefined) {
        onUpdateTrack(t.id, true, vol);
        soundEngine.setTrack(t.id, true, vol);
      } else {
        onUpdateTrack(t.id, false, t.volume);
        soundEngine.setTrack(t.id, false, t.volume);
      }
    });
  };

  return (
    <div className="flex flex-col h-full min-h-[580px] p-5 bg-[#171521] text-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-pixel text-[10px] text-amber-300 tracking-wider uppercase">
            Paisajes Sonoros Lo-Fi
          </span>
          <h2 className="text-xl font-bold font-display text-white">Mezclador Acústico</h2>
        </div>

        {activeTracksCount > 0 && (
          <button
            onClick={onStopAllSounds}
            className="px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700/50 flex items-center gap-1.5 transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Detener todo</span>
          </button>
        )}
      </div>

      {/* Control de Volumen Maestro */}
      <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 mb-5 flex items-center justify-between gap-4">
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 transition-colors"
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="font-medium text-stone-300">Volumen General</span>
            <span className="font-mono">{isMuted ? '0%' : `${masterVolume}%`}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : masterVolume}
            onChange={(e) => handleMasterVolumeChange(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="text-[11px] font-pixel text-amber-400/80 px-2 py-1 bg-amber-950/30 rounded border border-amber-900/30 shrink-0">
          {activeTracksCount} ACTIVAS
        </div>
      </div>

      {/* Presets Rápidos de Paisajes */}
      <div className="mb-5">
        <label className="text-xs text-stone-400 font-medium block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Combinaciones recomendadas:</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SOUND_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="p-2.5 rounded-xl bg-stone-800/50 hover:bg-stone-800 border border-stone-700/50 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{preset.icon}</span>
                <span className="text-xs font-semibold text-stone-200 group-hover:text-amber-200">
                  {preset.name}
                </span>
              </div>
              <p className="text-[10px] text-stone-400 mt-1 line-clamp-1">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Pistas Ambientales con Iconos Pixel Art y Sliders */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        <label className="text-xs text-stone-400 font-medium block flex items-center gap-1.5 mb-1">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Pistas individuales sintetizadas:</span>
        </label>

        {tracks.map((track) => {
          return (
            <div
              key={track.id}
              className={`p-3 rounded-2xl border transition-all ${
                track.isPlaying
                  ? 'bg-stone-800/80 border-amber-500/40 shadow-sm'
                  : 'bg-stone-900/30 border-stone-800/70 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Botón de reproducción de la pista con icono pixel art */}
                <button
                  type="button"
                  onClick={() => handleTrackToggle(track)}
                  className={`flex items-center gap-3 text-left transition-colors flex-1 ${
                    track.isPlaying ? 'text-amber-200' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl border transition-colors ${
                      track.isPlaying
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                        : 'bg-stone-800 border-stone-700 text-stone-400'
                    }`}
                  >
                    <PixelIcon
                      name={track.id as any}
                      size={24}
                      active={track.isPlaying}
                    />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-stone-200 flex items-center gap-2">
                      <span>{track.name}</span>
                      {track.isPlaying && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400 capitalize">
                      {track.category} · {track.isPlaying ? 'Sonando' : 'Pausado'}
                    </div>
                  </div>
                </button>

                {/* Control de volumen de la pista */}
                <div className="w-36 flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={track.isPlaying ? track.volume : 0}
                    onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-stone-400 w-8 text-right">
                    {track.isPlaying ? `${track.volume}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-center text-xs text-stone-400">
        ✨ Audio generado en tiempo real con Web Audio API · 100% offline y sin latencia
      </div>
    </div>
  );
};
