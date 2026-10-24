import React, { useState } from 'react';
import { Copy, Check, Code, FolderTree, Smartphone, Download } from 'lucide-react';

interface ExpoCodeModalProps {
  onClose: () => void;
}

export const ExpoCodeModal: React.FC<ExpoCodeModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('structure');
  const [copied, setCopied] = useState<boolean>(false);

  const files: Record<string, { title: string; filename: string; content: string }> = {
    structure: {
      title: 'Estructura de Carpetas',
      filename: 'folder_structure.txt',
      content: `shanti-mindfulness-mobile/
├── App.tsx                     # Punto de entrada, configuración de Navigation y tema Shanti
├── app.json                    # Configuración de Expo (nombre Shanti, orientación portrait, splash)
├── package.json                # Dependencias (react-native-mmkv, expo-av, reanimated, etc.)
├── tsconfig.json               # Configuración TypeScript estricta
│
├── src/
│   ├── types/
│   │   └── meditation.ts       # Interfaces estrictas (MoodType, TimeOfDay, WeatherElement, etc.)
│   │
│   ├── services/
│   │   ├── storageMMKV.ts      # Instancia MMKV con react-native-mmkv para persistencia instantánea
│   │   └── soundService.ts     # Controlador de audio con Expo AV / Soundscapes
│   │
│   ├── constants/
│   │   ├── colors.ts           # Paleta lo-fi cálida (pasteles, terracotas, índigo noche, cian)
│   │   └── unlockables.ts      # Catálogo de objetos desbloqueables (perrito Bodhi, té, Shanti art...)
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx      # Barra superior limpia sin distracciones
│   │   │   └── CustomButton.tsx
│   │   ├── pixel/
│   │   │   ├── PixelFace.tsx   # Placeholder/SVG con caras pixel art (calm, happy, etc.)
│   │   │   ├── PixelIcon.tsx   # Iconos pixel art para sonidos e items
│   │   │   └── PixelCozyRoom.tsx # Escenario lo-fi (Mañana, Tarde, Noche + Lluvia, Viento, Sol)
│   │   └── modals/
│   │       └── MoodCheckInModal.tsx # Check-in pre/post sesión con caras pixel art
│   │
│   └── screens/
│       ├── HomeScreen.tsx      # Dashboard con racha, escenario pixel art y gamificación
│       ├── MeditationTimer.tsx # Temporizador con animación de respiración y cuenco tibetano
│       ├── SoundMixer.tsx      # Mezclador multicanal de paisajes sonoros (lluvia, fuego...)
│       └── ProgressScreen.tsx  # Historial de estados de ánimo y colección del santuario
`,
    },

    app: {
      title: 'App.tsx (Navegación)',
      filename: 'App.tsx',
      content: `import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { MeditationTimer } from './src/screens/MeditationTimer';
import { SoundMixer } from './src/screens/SoundMixer';
import { MoodCheckInModal } from './src/components/modals/MoodCheckInModal';
import { Colors } from './src/constants/colors';
import { MoodType } from './src/types/meditation';

export type TabScreen = 'home' | 'timer' | 'sounds';

export default function App(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<TabScreen>('home');
  const [isMoodModalVisible, setIsMoodModalVisible] = useState(false);
  const [moodStage, setMoodStage] = useState<'pre' | 'post'>('pre');
  const [currentPreMood, setCurrentPreMood] = useState<MoodType | undefined>();

  const handleStartSession = () => {
    // Abrir check-in de estado de ánimo previo
    setMoodStage('pre');
    setIsMoodModalVisible(true);
  };

  const handlePreMoodSelected = (mood: MoodType) => {
    setCurrentPreMood(mood);
    setIsMoodModalVisible(false);
    setCurrentTab('timer');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        {/* Renderizado de pantalla según la pestaña seleccionada */}
        <View style={styles.screenContainer}>
          {currentTab === 'home' && (
            <HomeScreen
              onStartMeditation={handleStartSession}
              onNavigateToSounds={() => setCurrentTab('sounds')}
            />
          )}

          {currentTab === 'timer' && (
            <MeditationTimer
              preMood={currentPreMood}
              onFinishSession={() => {
                setMoodStage('post');
                setIsMoodModalVisible(true);
              }}
              onNavigateToHome={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'sounds' && (
            <SoundMixer onNavigateToHome={() => setCurrentTab('home')} />
          )}
        </View>

        {/* Barra de Navegación Inferior (Headspace style minimalista) */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, currentTab === 'home' && styles.tabItemActive]}
            onPress={() => setCurrentTab('home')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, currentTab === 'home' && styles.tabTextActive]}>
              Santuario
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, currentTab === 'timer' && styles.tabItemActive]}
            onPress={() => setCurrentTab('timer')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, currentTab === 'timer' && styles.tabTextActive]}>
              Meditar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, currentTab === 'sounds' && styles.tabItemActive]}
            onPress={() => setCurrentTab('sounds')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, currentTab === 'sounds' && styles.tabTextActive]}>
              Sonidos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal de Check-in de Ánimo */}
        {isMoodModalVisible && (
          <MoodCheckInModal
            stage={moodStage}
            preMood={currentPreMood}
            onSelectMood={handlePreMoodSelected}
            onClose={() => setIsMoodModalVisible(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#161420',
  },
  container: {
    flex: 1,
    backgroundColor: '#161420',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#1c1928',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tabItemActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  tabText: {
    fontSize: 13,
    color: '#a8a29e',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fbbf24',
    fontWeight: '700',
  },
});
`,
    },

    home: {
      title: 'HomeScreen.tsx',
      filename: 'HomeScreen.tsx',
      content: `import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MMKVStorage } from '../services/storageMMKV';
import { UserProgress, UnlockableItem } from '../types/meditation';
import { INITIAL_UNLOCKABLES } from '../constants/unlockables';
import { PixelCozyRoomPlaceholder } from '../components/pixel/PixelCozyRoomPlaceholder';

interface HomeScreenProps {
  onStartMeditation: () => void;
  onNavigateToSounds: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartMeditation,
  onNavigateToSounds,
}) => {
  const [progress, setProgress] = useState<UserProgress>(MMKVStorage.getProgress());
  const [unlockables, setUnlockables] = useState<UnlockableItem[]>(INITIAL_UNLOCKABLES);

  useEffect(() => {
    // Escuchar actualizaciones de progreso almacenadas en MMKV
    const saved = MMKVStorage.getProgress();
    setProgress(saved);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      {/* Header con Racha */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>SANTUARIO INTERIOR</Text>
          <Text style={styles.title}>Espacio Cozy</Text>
        </View>

        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View>
            <Text style={styles.streakNumber}>{progress.streakDays}</Text>
            <Text style={styles.streakLabel}>RACHA</Text>
          </View>
        </View>
      </View>

      {/* Escenario Pixel Art Evolutivo */}
      <View style={styles.sceneWrapper}>
        <PixelCozyRoomPlaceholder
          unlockedItems={progress.unlockedItemIds}
          activeItems={progress.activeItemIds}
        />
      </View>

      {/* Botón Principal CTA (Headspace style) */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={onStartMeditation}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaButtonText}>Iniciar Sesión de Paz (10 min)</Text>
      </TouchableOpacity>

      {/* Tarjeta de Próximo Desbloqueo */}
      <View style={styles.unlockCard}>
        <Text style={styles.unlockTitle}>Próximo objeto para tu cuarto</Text>
        <Text style={styles.unlockName}>🏮 Lámpara de Papel Washi</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '65%' }]} />
        </View>
        <Text style={styles.unlockHint}>Faltan 12 min de meditación para desbloquear</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#161420',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 10,
    color: '#f59e0b',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  streakNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fbbf24',
  },
  streakLabel: {
    fontSize: 8,
    color: '#fef3c7',
    fontWeight: '600',
  },
  sceneWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#1c1917',
    fontSize: 16,
    fontWeight: '700',
  },
  unlockCard: {
    backgroundColor: '#1f1c2d',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  unlockTitle: {
    fontSize: 11,
    color: '#a8a29e',
  },
  unlockName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fed7aa',
    marginTop: 4,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#2a263c',
    borderRadius: 4,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f97316',
    borderRadius: 4,
  },
  unlockHint: {
    fontSize: 11,
    color: '#78716c',
  },
});
`,
    },

    timer: {
      title: 'MeditationTimer.tsx',
      filename: 'MeditationTimer.tsx',
      content: `import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { MoodType } from '../types/meditation';

interface MeditationTimerProps {
  preMood?: MoodType;
  onFinishSession: () => void;
  onNavigateToHome: () => void;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  onFinishSession,
  onNavigateToHome,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(selectedMinutes * 60);

  // Animación de respiración con Animated API
  const breathAnim = useRef(new Animated.Value(1)).current;
  const [phase, setPhase] = useState<'Inhala' | 'Sostén' | 'Exhala' | 'Pausa'>('Inhala');

  useEffect(() => {
    let breathLoop: Animated.CompositeAnimation | null = null;

    if (isRunning) {
      // Ciclo de Respiración Cuadrada (4s Inhala, 4s Sostén, 4s Exhala, 4s Pausa)
      const cycle = Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.4,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.delay(4000),
        Animated.timing(breathAnim, {
          toValue: 0.85,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.delay(4000),
      ]);

      breathLoop = Animated.loop(cycle);
      breathLoop.start();
    } else {
      breathAnim.setValue(1);
    }

    return () => {
      if (breathLoop) breathLoop.stop();
    };
  }, [isRunning]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            setIsRunning(false);
            onFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return \`\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateToHome}>
          <Text style={styles.navBack}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Respiración Consciente</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Animación central de orbe de respiración */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.breathOrb,
            {
              transform: [{ scale: breathAnim }],
            },
          ]}
        >
          <View style={styles.pixelOrbCore}>
            <Text style={styles.breathPhaseText}>{isRunning ? phase : 'Listo'}</Text>
          </View>
        </Animated.View>

        <Text style={styles.timerDigital}>{formatTime(secondsLeft)}</Text>
        <Text style={styles.techniqueLabel}>Técnica: Caja 4-4-4-4</Text>
      </View>

      {/* Controles Play / Pause */}
      <View style={styles.controlRow}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setIsRunning(!isRunning)}
          activeOpacity={0.8}
        >
          <Text style={styles.playButtonText}>{isRunning ? 'Pausar' : 'Comenzar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#161420',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBack: {
    color: '#a8a29e',
    fontSize: 14,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathOrb: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pixelOrbCore: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathPhaseText: {
    color: '#1c1917',
    fontSize: 18,
    fontWeight: '800',
  },
  timerDigital: {
    fontSize: 44,
    fontWeight: '800',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  techniqueLabel: {
    fontSize: 12,
    color: '#a8a29e',
    marginTop: 6,
  },
  controlRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#1c1917',
    fontSize: 16,
    fontWeight: '700',
  },
});
`,
    },

    mixer: {
      title: 'SoundMixer.tsx',
      filename: 'SoundMixer.tsx',
      content: `import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { SoundTrack } from '../types/meditation';

interface SoundMixerProps {
  onNavigateToHome: () => void;
}

const INITIAL_TRACKS: SoundTrack[] = [
  { id: 'rain', name: 'Lluvia en tejado', iconName: '🌧️', volume: 60, isPlaying: true, category: 'naturaleza', color: '#60a5fa' },
  { id: 'fire', name: 'Fuego crujiente', iconName: '🔥', volume: 45, isPlaying: true, category: 'calor', color: '#f97316' },
  { id: 'wind', name: 'Brisa en el bosque', iconName: '🍃', volume: 30, isPlaying: false, category: 'ambiente', color: '#34d399' },
  { id: 'river', name: 'Arroyo cristalino', iconName: '🌊', volume: 40, isPlaying: false, category: 'naturaleza', color: '#38bdf8' },
  { id: 'crickets', name: 'Grillos de noche', iconName: '🦗', volume: 50, isPlaying: false, category: 'noche', color: '#a3e635' },
];

export const SoundMixer: React.FC<SoundMixerProps> = ({ onNavigateToHome }) => {
  const [tracks, setTracks] = useState<SoundTrack[]>(INITIAL_TRACKS);

  const toggleTrack = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPlaying: !t.isPlaying } : t))
    );
  };

  const updateVolume = (id: string, vol: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, volume: vol, isPlaying: vol > 0 ? true : t.isPlaying } : t))
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateToHome}>
          <Text style={styles.navBack}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Paisajes Sonoros</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>Mezcla sonidos relajantes simultáneos</Text>

      {/* Lista de Pistas Ambientales con Slider */}
      {tracks.map((track) => (
        <View
          key={track.id}
          style={[styles.trackCard, track.isPlaying && styles.trackCardActive]}
        >
          <TouchableOpacity
            style={styles.trackInfo}
            onPress={() => toggleTrack(track.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.trackIcon}>{track.iconName}</Text>
            <View>
              <Text style={styles.trackName}>{track.name}</Text>
              <Text style={styles.trackStatus}>
                {track.isPlaying ? 'Sonando' : 'Silenciado'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.sliderContainer}>
            <Slider
              style={{ width: 140, height: 40 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={track.isPlaying ? track.volume : 0}
              minimumTrackTintColor="#f59e0b"
              maximumTrackTintColor="#3a364d"
              thumbTintColor="#f59e0b"
              onValueChange={(val) => updateVolume(track.id, val)}
            />
            <Text style={styles.volText}>{track.isPlaying ? \`\${track.volume}%\` : '0%'}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161420',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  navBack: {
    color: '#a8a29e',
    fontSize: 14,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#a8a29e',
    fontSize: 12,
    marginBottom: 20,
  },
  trackCard: {
    backgroundColor: '#1d1a29',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  trackCardActive: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: '#242033',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  trackName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  trackStatus: {
    color: '#a8a29e',
    fontSize: 11,
    marginTop: 2,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volText: {
    color: '#a8a29e',
    fontSize: 11,
    width: 32,
    textAlign: 'right',
  },
});
`,
    },

    storage: {
      title: 'storageMMKV.ts (Persistencia)',
      filename: 'storageMMKV.ts',
      content: `import { MMKV } from 'react-native-mmkv';
import { UserProgress } from '../types/meditation';

// Inicialización de la base de datos de clave-valor ultra-rápida MMKV
export const storage = new MMKV({
  id: 'komorebi-user-storage',
});

const PROGRESS_KEY = 'user_progress';

export const MMKVStorage = {
  getProgress: (): UserProgress => {
    const raw = storage.getString(PROGRESS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return {
      streakDays: 3,
      bestStreak: 5,
      totalMinutes: 28,
      totalSessions: 4,
      lastSessionDate: new Date().toISOString().split('T')[0],
      unlockedItemIds: ['steaming_tea', 'sleeping_cat'],
      activeItemIds: ['steaming_tea', 'sleeping_cat'],
      favoriteSounds: ['rain', 'fire'],
      preferredDuration: 10,
      preferredBreathingId: 'box_4_4',
    };
  },

  saveProgress: (progress: UserProgress): void => {
    storage.set(PROGRESS_KEY, JSON.stringify(progress));
  },
};
`,
    },
  };

  const currentFileData = files[selectedFile];

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentFileData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[85vh] bg-[#14121d] border border-stone-700/70 rounded-3xl flex flex-col overflow-hidden shadow-2xl text-stone-100">
        {/* Top Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold font-display text-white text-base">
                Código Fuente Expo / React Native + TypeScript
              </h3>
              <p className="text-xs text-stone-400">
                Arquitectura modular con MMKV, StyleSheet y tipado estricto
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Archivo'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Layout en dos columnas: Archivos a la izquierda, Código a la derecha */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navegador de archivos */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-800/80 p-3 bg-[#181624] space-y-1 overflow-y-auto">
            <span className="text-[10px] uppercase font-pixel text-stone-400 px-2 block mb-2">
              Archivos del Proyecto
            </span>
            {Object.entries(files).map(([key, item]) => {
              const active = selectedFile === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFile(key)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                    active
                      ? 'bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/40'
                      : 'text-stone-300 hover:bg-stone-800/60'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-stone-400" />
                  <span className="truncate">{item.filename}</span>
                </button>
              );
            })}
          </div>

          {/* Visor de Código con Scroll */}
          <div className="flex-1 bg-[#0f0e16] p-4 overflow-y-auto font-mono text-xs text-stone-300 leading-relaxed">
            <div className="mb-2 pb-2 border-b border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span>{currentFileData.title}</span>
              <span className="text-stone-500">{currentFileData.filename}</span>
            </div>
            <pre className="whitespace-pre-wrap">{currentFileData.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
