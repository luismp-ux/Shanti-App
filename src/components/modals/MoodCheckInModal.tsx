import React, { useState } from 'react';
import { MoodType } from '../../types/meditation';
import { PixelFace } from '../pixel/PixelFace';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface MoodCheckInModalProps {
  stage: 'pre' | 'post';
  onComplete: (mood: MoodType, feelings: string[], notes: string) => void;
  onSkip?: () => void;
  preMood?: MoodType;
}

const MOODS: { type: MoodType; label: string; desc: string; color: string }[] = [
  { type: 'calm', label: 'Calmado', desc: 'En paz y sereno', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200' },
  { type: 'happy', label: 'Feliz', desc: 'Agradecido y vital', color: 'border-amber-500/50 bg-amber-950/20 text-amber-200' },
  { type: 'tired', label: 'Cansado', desc: 'Bajo de energía', color: 'border-stone-500/50 bg-stone-900/40 text-stone-300' },
  { type: 'anxious', label: 'Ansioso', desc: 'Inquieto o alerta', color: 'border-purple-500/50 bg-purple-950/20 text-purple-200' },
  { type: 'stressed', label: 'Estresado', desc: 'Cargado de tensión', color: 'border-rose-500/50 bg-rose-950/20 text-rose-200' },
];

const PRE_FEELING_TAGS = [
  'Mente acelerada',
  'Tensión en cuello',
  'Fatiga mental',
  'Buscando claridad',
  'Ganas de parar',
  'Pesadez física',
];

const POST_FEELING_TAGS = [
  'Respiración profunda',
  'Mente despejada',
  'Cuerpo relajado',
  'Gratitud sincera',
  'Paz interior',
  'Energía serena',
];

export const MoodCheckInModal: React.FC<MoodCheckInModalProps> = ({
  stage,
  onComplete,
  onSkip,
  preMood,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(stage === 'pre' ? 'stressed' : 'calm');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const feelingList = stage === 'pre' ? PRE_FEELING_TAGS : POST_FEELING_TAGS;

  const toggleFeeling = (tag: string) => {
    if (selectedFeelings.includes(tag)) {
      setSelectedFeelings(selectedFeelings.filter((t) => t !== tag));
    } else {
      setSelectedFeelings([...selectedFeelings, tag]);
    }
  };

  const handleFinish = () => {
    onComplete(selectedMood, selectedFeelings, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-[#1e1b2b] border border-stone-700/60 rounded-3xl p-6 shadow-2xl text-stone-100"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <span className="font-pixel text-[11px] text-amber-300 uppercase tracking-wider">
            {stage === 'pre' ? 'Check-in Inicial' : 'Reflexión Post-Sesión'}
          </span>
          <h3 className="text-xl font-bold font-display text-white mt-1">
            {stage === 'pre' ? '¿Cómo llega tu mente hoy?' : '¿Cómo te sientes tras respirar?'}
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            {stage === 'pre'
              ? 'Reconoce tu estado actual sin juzgarlo. Es el primer paso hacia la calma.'
              : 'Observa el espacio de serenidad que has creado en tu interior.'}
          </p>
        </div>

        {/* Comparativa si es post-sesión */}
        {stage === 'post' && preMood && (
          <div className="mb-5 p-3 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-center gap-3 text-xs text-stone-300">
            <div className="flex items-center gap-1.5 opacity-70">
              <span className="text-[10px] uppercase font-mono text-stone-500">Antes:</span>
              <PixelFace mood={preMood} size={24} />
              <span className="capitalize">{preMood}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex items-center gap-1.5 font-medium text-amber-200">
              <span className="text-[10px] uppercase font-mono text-stone-500">Ahora:</span>
              <PixelFace mood={selectedMood} size={24} />
              <span className="capitalize">{selectedMood}</span>
            </div>
          </div>
        )}

        {/* Selector de Caras Pixel Art */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {MOODS.map((item) => {
            const isSelected = selectedMood === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setSelectedMood(item.type)}
                className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                  isSelected
                    ? `${item.color} shadow-lg scale-105 border-amber-400/80`
                    : 'border-stone-800/80 bg-stone-900/30 text-stone-400 hover:border-stone-700'
                }`}
              >
                <PixelFace mood={item.type} size={42} selected={isSelected} />
                <span className="text-[11px] font-medium mt-1.5 text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tags de sensaciones corporales y mentales */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-stone-300 mb-2">
            Sensaciones presentes (opcional):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {feelingList.map((tag) => {
              const active = selectedFeelings.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleFeeling(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    active
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                      : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3 mt-6">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-1/3 py-2.5 text-xs text-stone-400 hover:text-stone-200 font-medium transition-colors"
            >
              Omitir
            </button>
          )}
          <button
            type="button"
            onClick={handleFinish}
            className={`flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium text-sm shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
          >
            <span>{stage === 'pre' ? 'Comenzar Meditación' : 'Guardar en mi diario'}</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
