/**
 * Adaptador de persistencia de datos local estilo MMKV.
 * Proporciona acceso rápido síncrono/asíncrono para el progreso del usuario,
 * historial de meditación y configuraciones.
 */

import { UserProgress, MeditationSession, MoodCheckIn, UnlockableItem } from '../types/meditation';

const STORAGE_KEYS = {
  USER_PROGRESS: 'komorebi_user_progress',
  SESSIONS: 'komorebi_sessions',
  MOOD_LOGS: 'komorebi_mood_logs',
  SETTINGS: 'komorebi_settings',
};

// Elementos desbloqueables del escenario Cozy Pixel
export const INITIAL_UNLOCKABLE_ITEMS: UnlockableItem[] = [
  {
    id: 'golden_pup',
    name: 'Perrito Fiel (Bodhi)',
    description: 'Un cachorro dorado que descansa en la cama, contemplando la lluvia en el ventanal.',
    requiredMinutes: 5,
    requiredStreak: 1,
    icon: '🐕',
    category: 'compania',
    unlocked: true,
    activeInRoom: true,
    lore: 'Su presencia calmada transmite Shanti: paz y sosiego sin juzgar.',
  },
  {
    id: 'steaming_tea',
    name: 'Taza Humeante de Té',
    description: 'Una taza tibia en el escritorio que despide volutas aromáticas de vapor.',
    requiredMinutes: 10,
    requiredStreak: 1,
    icon: '🍵',
    category: 'ambiente',
    unlocked: true,
    activeInRoom: true,
    lore: 'El calor en las manos nos ancla en la respiración presente.',
  },
  {
    id: 'shanti_art',
    name: 'Cuadros de Pared "I ❤️ U" & Shanti',
    description: 'Ilustraciones minimalistas de amor bondadoso y serenidad mental en la pared.',
    requiredMinutes: 20,
    requiredStreak: 2,
    icon: '🖼️',
    category: 'decoracion',
    unlocked: false,
    activeInRoom: false,
    lore: 'Recordatorios visuales de Metta (amor benevolente) y Shanti (paz profunda).',
  },
  {
    id: 'hanging_mobile',
    name: 'Móvil de Planetas Orbitantes',
    description: 'Pequeños planetas con anillos de Saturno flotando suavemente sobre la cama.',
    requiredMinutes: 40,
    requiredStreak: 3,
    icon: '🪐',
    category: 'decoracion',
    unlocked: false,
    activeInRoom: false,
    lore: 'Observar los cuerpos celestes evoca la inmensidad del universo y la levedad.',
  },
  {
    id: 'desk_plant',
    name: 'Suculenta y Flores de Escritorio',
    description: 'Pequeñas plantas verdes que aportan oxígeno y vitalidad al rincón de estudio.',
    requiredMinutes: 65,
    requiredStreak: 4,
    icon: '🪴',
    category: 'ambiente',
    unlocked: false,
    activeInRoom: false,
    lore: 'El contacto visual con la naturaleza reduce la ansiedad y el estrés acumulado.',
  },
  {
    id: 'rgb_lamp',
    name: 'Luz Ambiental Lo-Fi & Monitor',
    description: 'Un brillo cian y ámbar suave que ilumina el setup sin fatiga visual.',
    requiredMinutes: 90,
    requiredStreak: 5,
    icon: '💡',
    category: 'luz',
    unlocked: false,
    activeInRoom: false,
    lore: 'La iluminación indirecta tenue favorece el estado de meditación vespertina.',
  },
  {
    id: 'city_view',
    name: 'Ventanal Panorámico Cityscape',
    description: 'Vista completa de los rascacielos iluminados en el horizonte nocturno.',
    requiredMinutes: 130,
    requiredStreak: 7,
    icon: '🌃',
    category: 'ambiente',
    unlocked: false,
    activeInRoom: false,
    lore: 'Ver la ciudad en calma a lo lejos nos conecta con la armonía del mundo exterior.',
  },
];

const DEFAULT_USER_PROGRESS: UserProgress = {
  streakDays: 3,
  bestStreak: 5,
  totalMinutes: 28,
  totalSessions: 4,
  lastSessionDate: new Date().toISOString().split('T')[0],
  unlockedItemIds: ['golden_pup', 'steaming_tea'],
  activeItemIds: ['golden_pup', 'steaming_tea'],
  favoriteSounds: ['rain', 'crickets'],
  preferredDuration: 10,
  preferredBreathingId: 'box_4_4',
};

// Historial inicial de prueba para visualización rica
const DEFAULT_SESSIONS: MeditationSession[] = [
  {
    id: 'sess-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    timestamp: Date.now() - 86400000 * 2,
    durationMinutes: 10,
    actualSeconds: 600,
    technique: 'Respiración Cuadrada (4-4-4-4)',
    preMood: 'stressed',
    postMood: 'calm',
    soundscapeSummary: ['Lluvia suave'],
    completed: true,
  },
  {
    id: 'sess-2',
    date: new Date(Date.now() - 86400000).toISOString(),
    timestamp: Date.now() - 86400000,
    durationMinutes: 8,
    actualSeconds: 480,
    technique: 'Calma 4-7-8',
    preMood: 'anxious',
    postMood: 'calm',
    soundscapeSummary: ['Fuego crujiente', 'Viento suave'],
    completed: true,
  },
  {
    id: 'sess-3',
    date: new Date().toISOString(),
    timestamp: Date.now(),
    durationMinutes: 10,
    actualSeconds: 600,
    technique: 'Resonancia Coherente (5-5)',
    preMood: 'tired',
    postMood: 'happy',
    soundscapeSummary: ['Arroyo cristalino', 'Grillos nocturnos'],
    completed: true,
  },
];

class LocalStorageAdapter {
  public getUserProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USER_PROGRESS;
  }

  public saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch {
      // Fallback
    }
  }

  public getSessions(): MeditationSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SESSIONS;
  }

  public saveSessions(sessions: MeditationSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {
      // Fallback
    }
  }

  public recordCompletedSession(
    durationMinutes: number,
    actualSeconds: number,
    techniqueName: string,
    preMood?: import('../types/meditation').MoodType,
    postMood?: import('../types/meditation').MoodType,
    soundscapeSummary?: string[]
  ): {
    newSession: MeditationSession;
    updatedProgress: UserProgress;
    newlyUnlockedItems: UnlockableItem[];
  } {
    const sessions = this.getSessions();
    const progress = this.getUserProgress();

    const todayStr = new Date().toISOString().split('T')[0];
    const isConsecutiveDay = progress.lastSessionDate
      ? (new Date(todayStr).getTime() - new Date(progress.lastSessionDate).getTime()) <= 86400000 * 1.5
      : true;

    const isSameDay = progress.lastSessionDate === todayStr;

    let newStreak = progress.streakDays;
    if (!isSameDay) {
      if (isConsecutiveDay) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const newTotalMinutes = progress.totalMinutes + Math.round(actualSeconds / 60);
    const newTotalSessions = progress.totalSessions + 1;
    const newBestStreak = Math.max(progress.bestStreak, newStreak);

    // Calcular desbloqueos
    const currentUnlocked = new Set(progress.unlockedItemIds);
    const newlyUnlocked: UnlockableItem[] = [];

    INITIAL_UNLOCKABLE_ITEMS.forEach((item) => {
      if (!currentUnlocked.has(item.id)) {
        if (newTotalMinutes >= item.requiredMinutes || newStreak >= item.requiredStreak) {
          currentUnlocked.add(item.id);
          newlyUnlocked.push(item);
        }
      }
    });

    const updatedUnlockedArray = Array.from(currentUnlocked);
    // Auto-activar items desbloqueados en la habitación
    const updatedActiveArray = Array.from(new Set([...progress.activeItemIds, ...newlyUnlocked.map((i) => i.id)]));

    const updatedProgress: UserProgress = {
      ...progress,
      streakDays: newStreak,
      bestStreak: newBestStreak,
      totalMinutes: newTotalMinutes,
      totalSessions: newTotalSessions,
      lastSessionDate: todayStr,
      unlockedItemIds: updatedUnlockedArray,
      activeItemIds: updatedActiveArray,
    };

    const newSession: MeditationSession = {
      id: `sess-${Date.now()}`,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      durationMinutes,
      actualSeconds,
      technique: techniqueName,
      preMood,
      postMood,
      soundscapeSummary,
      completed: true,
    };

    const updatedSessions = [newSession, ...sessions];
    this.saveUserProgress(updatedProgress);
    this.saveSessions(updatedSessions);

    return {
      newSession,
      updatedProgress,
      newlyUnlockedItems: newlyUnlocked,
    };
  }
}

export const localStore = new LocalStorageAdapter();
