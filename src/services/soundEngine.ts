/**
 * Motor de audio procedural basado en Web Audio API para simular
 * paisajes sonoros relajantes y el cuenco tibetano sin depender
 * de archivos externos que puedan fallar en la red.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Master Gain
  private masterGain: GainNode | null = null;

  // Track nodes dictionary
  private activeNodes: Map<
    string,
    {
      gain: GainNode;
      sources: (AudioNode | number)[];
      cleanup: () => void;
    }
  > = new Map();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(volume: number) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, volume / 100));
    this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  /**
   * Toca un cuenco tibetano (Tibetan Singing Bowl) sintetizado
   * con frecuencias armónicas de afinación 432 Hz y decaimiento suave.
   */
  public playSingingBowl(durationSeconds = 4.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const fundamental = 432; // Hz (tono calmante)
    const harmonics = [1, 2.01, 3.02, 4.04];
    const amplitudes = [0.6, 0.25, 0.12, 0.05];

    harmonics.forEach((ratio, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * ratio, now);

      // Micro vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(4.2, now);
      lfoGain.gain.setValueAtTime(1.5, now);
      lfo.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + durationSeconds);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(amplitudes[idx], now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + durationSeconds);
    });
  }

  /**
   * Inicia o actualiza una pista de sonido ambiental
   */
  public setTrack(trackId: string, isPlaying: boolean, volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const normalizedVol = (volume / 100) * 0.45;

    // Si ya existe la pista
    if (this.activeNodes.has(trackId)) {
      const entry = this.activeNodes.get(trackId)!;
      if (!isPlaying || normalizedVol <= 0.001) {
        // Apagar suavemente
        entry.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.2);
        setTimeout(() => {
          entry.cleanup();
          this.activeNodes.delete(trackId);
        }, 300);
      } else {
        // Actualizar volumen
        entry.gain.gain.setTargetAtTime(normalizedVol, this.ctx.currentTime, 0.1);
      }
      return;
    }

    if (!isPlaying || normalizedVol <= 0.001) return;

    // Crear la pista según el id
    switch (trackId) {
      case 'rain':
        this.createRainTrack(normalizedVol);
        break;
      case 'fire':
        this.createFireTrack(normalizedVol);
        break;
      case 'wind':
        this.createWindTrack(normalizedVol);
        break;
      case 'river':
        this.createRiverTrack(normalizedVol);
        break;
      case 'crickets':
        this.createCricketsTrack(normalizedVol);
        break;
      case 'birds':
        this.createBirdsTrack(normalizedVol);
        break;
      case 'brownNoise':
        this.createBrownNoiseTrack(normalizedVol);
        break;
    }
  }

  // --- SÍNTESIS DE PISTAS ESPECÍFICAS ---

  private createRainTrack(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, now);
    trackGain.gain.setTargetAtTime(volume, now, 0.3);
    trackGain.connect(this.masterGain);

    // Buffer de ruido blanco
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filtro pasa banda para lluvia
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(350, now);

    whiteNoise.connect(filter);
    filter.connect(highpass);
    highpass.connect(trackGain);
    whiteNoise.start(now);

    this.activeNodes.set('rain', {
      gain: trackGain,
      sources: [whiteNoise],
      cleanup: () => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
          filter.disconnect();
          highpass.disconnect();
          trackGain.disconnect();
        } catch {
          // ignore
        }
      },
    });
  }

  private createFireTrack(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, now);
    trackGain.gain.setTargetAtTime(volume, now, 0.3);
    trackGain.connect(this.masterGain);

    // Ruido rosa base
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.15;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    noiseSource.connect(filter);
    filter.connect(trackGain);
    noiseSource.start(now);

    // Generador periódico de crepitar (crackles)
    const crackleInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const cNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();

      osc.type = Math.random() > 0.5 ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 1800, cNow);

      const popVol = (Math.random() * 0.15 + 0.05);
      popGain.gain.setValueAtTime(popVol, cNow);
      popGain.gain.exponentialRampToValueAtTime(0.001, cNow + 0.035);

      osc.connect(popGain);
      popGain.connect(trackGain);

      osc.start(cNow);
      osc.stop(cNow + 0.04);
    }, 180);

    this.activeNodes.set('fire', {
      gain: trackGain,
      sources: [noiseSource, crackleInterval],
      cleanup: () => {
        clearInterval(crackleInterval);
        try {
          noiseSource.stop();
          noiseSource.disconnect();
          filter.disconnect();
          trackGain.disconnect();
        } catch {
          // ignore
        }
      },
    });
  }

  private createWindTrack(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, now);
    trackGain.gain.setTargetAtTime(volume, now, 0.4);
    trackGain.connect(this.masterGain);

    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(2.5, now);

    // LFO para modular la brisa del viento
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.18, now); // brisa lenta
    lfoGain.gain.setValueAtTime(220, now);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(trackGain);

    noise.start(now);
    lfo.start(now);

    this.activeNodes.set('wind', {
      gain: trackGain,
      sources: [noise, lfo],
      cleanup: () => {
        try {
          noise.stop();
          lfo.stop();
          noise.disconnect();
          lfo.disconnect();
          lfoGain.disconnect();
          filter.disconnect();
          trackGain.disconnect();
        } catch {
          // ignore
        }
      },
    });
  }

  private createRiverTrack(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, now);
    trackGain.gain.setTargetAtTime(volume, now, 0.3);
    trackGain.connect(this.masterGain);

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(800, now);

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(450, now);
    filter2.Q.setValueAtTime(1.8, now);

    // LFO para el vaivén del agua
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.6, now);
    lfoGain.gain.setValueAtTime(140, now);

    lfo.connect(lfoGain);
    lfoGain.connect(filter2.frequency);

    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(trackGain);

    noise.start(now);
    lfo.start(now);

    this.activeNodes.set('river', {
      gain: trackGain,
      sources: [noise, lfo],
      cleanup: () => {
        try {
          noise.stop();
          lfo.stop();
          noise.disconnect();
          lfo.disconnect();
          lfoGain.disconnect();
          filter1.disconnect();
          filter2.disconnect();
          trackGain.disconnect();
        } catch {
          // ignore
        }
      },
    });
  }

  private createCricketsTrack(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, now);
    trackGain.gain.setTargetAtTime(volume * 0.7, now, 0.3);
    trackGain.connect(this.masterGain);

    const cricketInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const cNow = this.ctx.currentTime;
      // Trino de grillo (3 o 4 pulsos rápidos)
      const pulses = 3;
      for (let p = 0; p < pulses; p++) {
        const pulseTime = cNow + p * 0.05;
        const osc = this.ctx.createOscillator();
        const pulseGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(4600 + (Math.random() * 200 - 100), pulseTime);

        pulseGain.gain.setValueAtTime(0.001, pulseTime);
        pulseGain.gain.exponentialRampToValueAtTime(0.12, pulseTime + 0.015);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.035);

        osc.connect(pulseGain);
        pulseGain.connect(trackGain);

        osc.start(pulseTime);
        osc.stop(pulseTime + 0.04);
      }
    }, 1100 + Math.random() * 600);

    this.activeNodes.set('crickets', {
      gain: trackGain,
      sources: [cricketInterval],
      cleanup: () => {
        clearInterval(cricketInterval);
        try {
          trackGain.disconnect();
        } catch {
          // ignore
        }
      },
    });
  }

  private createBirdsTrack(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, now);
    trackGain.gain.setTargetAtTime(volume * 0.5, now, 0.3);
    trackGain.connect(this.masterGain);

    const birdInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const cNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 2200 + Math.random() * 600;
      osc.frequency.setValueAtTime(baseFreq, cNow);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, cNow + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, cNow + 0.16);

      chirpGain.gain.setValueAtTime(0.001, cNow);
      chirpGain.gain.exponentialRampToValueAtTime(0.1, cNow + 0.05);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, cNow + 0.2);

      osc.connect(chirpGain);
      chirpGain.connect(trackGain);

      osc.start(cNow);
      osc.stop(cNow + 0.22);
    }, 3200 + Math.random() * 2000);

    this.activeNodes.set('birds', {
      gain: trackGain,
      sources: [birdInterval],
      cleanup: () => {
        clearInterval(birdInterval);
        try {
          trackGain.disconnect();
        } catch {
          // ignore
        }
      },
    });
  }

  private createBrownNoiseTrack(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, now);
    trackGain.gain.setTargetAtTime(volume * 0.6, now, 0.4);
    trackGain.connect(this.masterGain);

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // compensar nivel
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);

    noise.connect(filter);
    filter.connect(trackGain);
    noise.start(now);

    this.activeNodes.set('brownNoise', {
      gain: trackGain,
      sources: [noise],
      cleanup: () => {
        try {
          noise.stop();
          noise.disconnect();
          filter.disconnect();
          trackGain.disconnect();
        } catch {
          // ignore
        }
      },
    });
  }

  public stopAll() {
    this.activeNodes.forEach((entry) => {
      entry.cleanup();
    });
    this.activeNodes.clear();
  }
}

export const soundEngine = new SoundEngine();
