/**
 * Komorebi - Cozy Pixel Art Mindfulness & Meditation
 * Aplicación móvil interactiva con usabilidad fluida, estética cozy lo-fi,
 * temporizador visual de respiración, mezclador de sonidos ambientales y
 * sistema de gamificación evolutivo.
 */

import React, { useState, useEffect } from 'react';
import {
  AppTab,
  UserProgress,
  MeditationSession,
  SoundTrack,
  MoodType,
  UnlockableItem,
} from './types/meditation';
import { localStore, INITIAL_UNLOCKABLE_ITEMS } from './services/storage';
import { soundEngine } from './services/soundEngine';
import { HomeScreen } from './components/screens/HomeScreen';
import { MeditationTimer } from './components/screens/MeditationTimer';
import { SoundMixer } from './components/screens/SoundMixer';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { MoodCheckInModal } from './components/modals/MoodCheckInModal';
import { ExpoCodeModal } from './components/modals/ExpoCodeModal';
import { ApkUpdatesModal } from './components/modals/ApkUpdatesModal';
import { PixelIcon } from './components/pixel/PixelIcon';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Smartphone,
  Maximize2,
  Code2,
  Volume2,
  Trophy,
  Flame,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';

const INITIAL_SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    name: 'Lluvia en el tejado',
    iconName: 'rain',
    volume: 55,
    isPlaying: false,
    category: 'naturaleza',
    color: '#60a5fa',
  },
  {
    id: 'fire',
    name: 'Fuego de leña',
    iconName: 'fire',
    volume: 45,
    isPlaying: false,
    category: 'calor',
    color: '#f97316',
  },
  {
    id: 'wind',
    name: 'Brisa en el bosque',
    iconName: 'wind',
    volume: 30,
    isPlaying: false,
    category: 'ambiente',
    color: '#34d399',
  },
  {
    id: 'river',
    name: 'Arroyo de montaña',
    iconName: 'river',
    volume: 40,
    isPlaying: false,
    category: 'naturaleza',
    color: '#38bdf8',
  },
  {
    id: 'crickets',
    name: 'Grillos en la noche',
    iconName: 'crickets',
    volume: 40,
    isPlaying: false,
    category: 'noche',
    color: '#a3e635',
  },
  {
    id: 'birds',
    name: 'Pájaros al amanecer',
    iconName: 'birds',
    volume: 35,
    isPlaying: false,
    category: 'naturaleza',
    color: '#fbbf24',
  },
  {
    id: 'brownNoise',
    name: 'Ruido Marrón Lo-Fi',
    iconName: 'brownNoise',
    volume: 50,
    isPlaying: false,
    category: 'ambiente',
    color: '#c084fc',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [userProgress, setUserProgress] = useState<UserProgress>(localStore.getUserProgress());
  const [sessions, setSessions] = useState<MeditationSession[]>(localStore.getSessions());
  const [soundTracks, setSoundTracks] = useState<SoundTrack[]>(INITIAL_SOUND_TRACKS);

  // Estados del flujo de Check-in de Ánimo
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [moodStage, setMoodStage] = useState<'pre' | 'post'>('pre');
  const [activePreMood, setActivePreMood] = useState<MoodType | undefined>();
  const [pendingFinishedDuration, setPendingFinishedDuration] = useState<{
    targetMins: number;
    actualSecs: number;
    technique: string;
  } | null>(null);

  // Modal para ver el código React Native / Expo generado
  const [isExpoCodeOpen, setIsExpoCodeOpen] = useState(false);

  // Modal para ver APK, actualizaciones OTA in-app y GitHub
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Toggle de vista de marco de smartphone vs vista responsive completa
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Notificación de nuevo elemento desbloqueado
  const [unlockedCelebration, setUnlockedCelebration] = useState<UnlockableItem | null>(null);

  // Sincronizar tracks activos con el motor de audio al cargar
  const activeSoundsCount = soundTracks.filter((t) => t.isPlaying).length;

  const handleUpdateTrack = (trackId: string, isPlaying: boolean, volume: number) => {
    setSoundTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isPlaying, volume } : t))
    );
  };

  const handleStopAllSounds = () => {
    soundEngine.stopAll();
    setSoundTracks((prev) => prev.map((t) => ({ ...t, isPlaying: false })));
  };

  const handleToggleItemActive = (itemId: string) => {
    const currentActive = new Set(userProgress.activeItemIds);
    if (currentActive.has(itemId)) {
      currentActive.delete(itemId);
    } else {
      currentActive.add(itemId);
    }

    const updated: UserProgress = {
      ...userProgress,
      activeItemIds: Array.from(currentActive),
    };
    setUserProgress(updated);
    localStore.saveUserProgress(updated);
  };

  // Inicio de sesión desde Home
  const handleInitiateSession = () => {
    setMoodStage('pre');
    setIsMoodModalOpen(true);
  };

  // Cuando el usuario confirma su ánimo pre-sesión
  const handlePreMoodComplete = (mood: MoodType) => {
    setActivePreMood(mood);
    setIsMoodModalOpen(false);
    setCurrentTab('timer');
  };

  // Cuando el temporizador concluye
  const handleTimerFinish = (targetMinutes: number, actualSeconds: number, technique: string) => {
    setPendingFinishedDuration({ targetMins: targetMinutes, actualSecs: actualSeconds, technique });
    setMoodStage('post');
    setIsMoodModalOpen(true);
  };

  // Cuando el usuario completa su reflexión post-sesión
  const handlePostMoodComplete = (postMood: MoodType) => {
    setIsMoodModalOpen(false);

    if (pendingFinishedDuration) {
      const activeSoundsSummary = soundTracks
        .filter((t) => t.isPlaying)
        .map((t) => t.name);

      const result = localStore.recordCompletedSession(
        pendingFinishedDuration.targetMins,
        pendingFinishedDuration.actualSecs,
        pendingFinishedDuration.technique,
        activePreMood,
        postMood,
        activeSoundsSummary
      );

      setUserProgress(result.updatedProgress);
      setSessions([result.newSession, ...sessions]);

      // Si hubo desbloqueos, disparar confeti y aviso
      if (result.newlyUnlockedItems.length > 0) {
        setUnlockedCelebration(result.newlyUnlockedItems[0]);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fb923c', '#ea580c', '#fef08a'],
        });
      }

      setPendingFinishedDuration(null);
      setActivePreMood(undefined);
      setCurrentTab('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#110f18] text-[#ede7df] flex flex-col font-sans selection:bg-amber-500/30">
      {/* Top Bar Web Principal (Contrato de 3 zonas) */}
      <header className="flex items-center justify-between gap-8 px-5 py-3.5 border-b border-stone-800/80 bg-[#161422] z-30 shrink-0">
        {/* Zona 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-pixel text-xs">
            ॐ
          </div>
          <span className="font-display font-bold text-base tracking-tight text-white">
            Shanti
          </span>
          <span className="text-[11px] text-stone-400 hidden sm:inline">
            · Mindfulness Lo-Fi & Paz Interior
          </span>
        </div>

        {/* Zona 2: Enlaces / Metadatos rápidos */}
        <div className="hidden md:flex items-center gap-6 text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Racha: <strong className="text-white">{userProgress.streakDays} días</strong></span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total: <strong className="text-white">{userProgress.totalMinutes} min</strong></span>
          </span>
          {activeSoundsCount > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Volume2 className="w-3.5 h-3.5" />
                <span>{activeSoundsCount} sonidos activos</span>
              </span>
            </>
          )}
        </div>

        {/* Zona 3: Acciones primarias (APK/OTA + Exportar Expo + Toggle Marco Móvil) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botón APK & Actualizaciones OTA */}
          <button
            onClick={() => setIsApkModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold shadow-md transition-all"
            title="Generar APK para Android y gestionar actualizaciones OTA in-app"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>APK & Updates OTA</span>
          </button>

          {/* Botón Ver Código Expo/React Native */}
          <button
            onClick={() => setIsExpoCodeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-medium transition-colors"
            title="Ver código fuente estructurado para React Native / Expo"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código RN</span>
          </button>

          {/* Toggle Marco Móvil */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title={isPhoneFrame ? 'Expandir vista completa' : 'Ver marco móvil de smartphone'}
          >
            {isPhoneFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Contenedor Principal de la Aplicación */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        <div
          className={`w-full transition-all duration-300 ${
            isPhoneFrame
              ? 'max-w-[420px] rounded-[40px] border-[6px] border-[#292538] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] bg-[#161420] overflow-hidden flex flex-col h-[820px] relative'
              : 'max-w-4xl rounded-3xl border border-stone-800 bg-[#161420] shadow-2xl overflow-hidden flex flex-col min-h-[700px]'
          }`}
        >
          {/* Barra de estado de smartphone simulada (sólo en modo marco móvil) */}
          {isPhoneFrame && (
            <div className="h-10 bg-[#161420] px-6 flex items-center justify-between text-[11px] font-mono text-stone-400 select-none border-b border-white/5 shrink-0">
              <span className="font-semibold text-white">09:41</span>
              {/* Isla dinámica / notch */}
              <div className="w-20 h-4 bg-black rounded-full" />
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span className="text-emerald-400">100%</span>
              </div>
            </div>
          )}

          {/* Área de Pantallas Activas */}
          <div className="flex-1 overflow-y-auto relative">
            {currentTab === 'home' && (
              <HomeScreen
                progress={userProgress}
                unlockablesList={INITIAL_UNLOCKABLE_ITEMS}
                onStartMeditation={handleInitiateSession}
                onOpenSoundscapes={() => setCurrentTab('soundscapes')}
                onOpenProgress={() => setCurrentTab('progress')}
                onToggleItemActive={handleToggleItemActive}
                onOpenMoodCheckIn={() => {
                  setMoodStage('pre');
                  setIsMoodModalOpen(true);
                }}
                activeSoundTracks={soundTracks.filter((t) => t.isPlaying).map((t) => t.id)}
              />
            )}

            {currentTab === 'timer' && (
              <MeditationTimer
                onSessionFinish={handleTimerFinish}
                onOpenSoundMixer={() => setCurrentTab('soundscapes')}
                activeSoundCount={activeSoundsCount}
              />
            )}

            {currentTab === 'soundscapes' && (
              <SoundMixer
                tracks={soundTracks}
                onUpdateTrack={handleUpdateTrack}
                onSetPreset={() => {}}
                onStopAllSounds={handleStopAllSounds}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressScreen
                progress={userProgress}
                sessions={sessions}
                unlockablesList={INITIAL_UNLOCKABLE_ITEMS}
                onToggleItemActive={handleToggleItemActive}
                onOpenApkModal={() => setIsApkModalOpen(true)}
              />
            )}
          </div>

          {/* Barra de Navegación Inferior (Headspace / Mobile Tab Bar) */}
          <nav className="h-16 bg-[#181624] border-t border-stone-800/80 px-3 grid grid-cols-4 items-center shrink-0 z-20">
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentTab === 'home' ? 'text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <PixelIcon name="tea" size={20} active={currentTab === 'home'} />
              <span className="text-[10px] mt-1 tracking-tight">Santuario</span>
            </button>

            <button
              onClick={() => setCurrentTab('timer')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentTab === 'timer' ? 'text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <PixelIcon name="bowl" size={20} active={currentTab === 'timer'} />
              <span className="text-[10px] mt-1 tracking-tight">Meditar</span>
            </button>

            <button
              onClick={() => setCurrentTab('soundscapes')}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                currentTab === 'soundscapes' ? 'text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <PixelIcon name="rain" size={20} active={currentTab === 'soundscapes'} />
              <span className="text-[10px] mt-1 tracking-tight">Sonidos</span>
              {activeSoundsCount > 0 && (
                <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('progress')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentTab === 'progress' ? 'text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <PixelIcon name="sparkle" size={20} active={currentTab === 'progress'} />
              <span className="text-[10px] mt-1 tracking-tight">Progreso</span>
            </button>
          </nav>
        </div>
      </main>

      {/* Modal de Check-in de Estado de Ánimo */}
      {isMoodModalOpen && (
        <MoodCheckInModal
          stage={moodStage}
          preMood={activePreMood}
          onComplete={moodStage === 'pre' ? handlePreMoodComplete : handlePostMoodComplete}
          onSkip={() => {
            setIsMoodModalOpen(false);
            if (moodStage === 'pre') setCurrentTab('timer');
          }}
        />
      )}

      {/* Modal de Celebración de Desbloqueo */}
      {unlockedCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#1c182a] border border-amber-500/50 rounded-3xl p-6 text-center shadow-2xl animate-fade-in text-stone-100">
            <span className="text-4xl p-3 bg-amber-500/20 rounded-2xl inline-block mb-3">
              {unlockedCelebration.icon}
            </span>
            <span className="font-pixel text-[11px] text-amber-300 uppercase tracking-widest block mb-1">
              ¡Nuevo Elemento Desbloqueado!
            </span>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              {unlockedCelebration.name}
            </h3>
            <p className="text-xs text-stone-300 mb-4">{unlockedCelebration.description}</p>
            <p className="text-[11px] text-amber-200/80 italic mb-5">{unlockedCelebration.lore}</p>
            <button
              onClick={() => setUnlockedCelebration(null)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors"
            >
              Colocar en mi Santuario
            </button>
          </div>
        </div>
      )}

      {/* Modal de Visor de Código Expo / React Native */}
      {isExpoCodeOpen && <ExpoCodeModal onClose={() => setIsExpoCodeOpen(false)} />}

      {/* Modal de APK, Actualizaciones OTA In-App y GitHub */}
      {isApkModalOpen && <ApkUpdatesModal onClose={() => setIsApkModalOpen(false)} />}
    </div>
  );
}
