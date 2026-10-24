/**
 * Tipos e interfaces de datos estrictamente tipadas para la aplicación
 * de meditación y mindfulness estilo cozy pixel art.
 */

export type MoodType = 'calm' | 'happy' | 'stressed' | 'anxious' | 'tired';

export type TimeOfDay = 'manana' | 'tarde' | 'noche';

export type WeatherElement = 'lluvia' | 'viento' | 'sol' | 'estrellas';

export interface MoodCheckIn {
  id: string;
  timestamp: number;
  mood: MoodType;
  notes?: string;
  feelingTags: string[];
  stage: 'pre' | 'post';
}

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number; // segundos
  hold1: number;
  exhale: number;
  hold2: number;
}

export interface SoundTrack {
  id: 'rain' | 'fire' | 'wind' | 'river' | 'crickets' | 'birds' | 'brownNoise';
  name: string;
  iconName: string;
  volume: number; // 0 to 100
  isPlaying: boolean;
  category: 'naturaleza' | 'calor' | 'noche' | 'ambiente';
  color: string;
}

export interface UnlockableItem {
  id: string;
  name: string;
  description: string;
  requiredMinutes: number;
  requiredStreak: number;
  icon: string;
  category: 'decoracion' | 'compania' | 'ambiente' | 'luz' | 'calor';
  unlocked: boolean;
  activeInRoom: boolean;
  lore: string;
}

export interface MeditationSession {
  id: string;
  date: string; // ISO string
  timestamp: number;
  durationMinutes: number;
  actualSeconds: number;
  technique: string;
  preMood?: MoodType;
  postMood?: MoodType;
  soundscapeSummary?: string[];
  completed: boolean;
}

export interface UserProgress {
  streakDays: number;
  bestStreak: number;
  totalMinutes: number;
  totalSessions: number;
  lastSessionDate: string | null;
  unlockedItemIds: string[];
  activeItemIds: string[];
  favoriteSounds: string[];
  preferredDuration: number;
  preferredBreathingId: string;
}

export type AppTab = 'home' | 'timer' | 'soundscapes' | 'progress';
