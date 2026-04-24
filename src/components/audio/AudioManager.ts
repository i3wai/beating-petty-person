type SoundId = string;

// --- Sound Synthesis ---
// Instead of loading external MP3 files, we synthesize sounds
// using the Web Audio API. This eliminates the need for audio files
// and works immediately without network requests.

interface SynthConfig {
  type: 'oscillator' | 'noise' | 'filtered-noise';
  frequency?: number;
  duration: number; // ms
  gain: number;
  // Oscillator-specific
  oscType?: OscillatorType;
  frequencyEnd?: number;
  // Filter
  filterFreq?: number;
  filterQ?: number;
  filterType?: BiquadFilterType;
  // LFO modulation
  lfoFreq?: number;
  lfoDepth?: number;
  lfoGainDepth?: number;
}

const SOUND_SYNTH: Record<SoundId, SynthConfig> = {
  'ambient-drone': {
    type: 'oscillator',
    oscType: 'sawtooth',
    frequency: 55,
    frequencyEnd: 58,
    duration: 0, // 0 = loop
    gain: 0.15,
    filterFreq: 200,
    filterQ: 2,
    filterType: 'lowpass',
  },
  'ambient-wind': {
    type: 'filtered-noise',
    duration: 0,
    gain: 0.08,
    filterFreq: 800,
    filterQ: 0.5,
    filterType: 'bandpass',
  },
  'action-beat': {
    type: 'noise',
    duration: 80,
    gain: 0.4,
    filterFreq: 2000,
    filterQ: 1,
    filterType: 'highpass',
  },
  'action-paper': {
    type: 'noise',
    duration: 120,
    gain: 0.2,
    filterFreq: 4000,
    filterQ: 0.8,
    filterType: 'bandpass',
  },
  'action-thwack': {
    type: 'noise',
    duration: 60,
    gain: 0.5,
    filterFreq: 1200,
    filterQ: 2,
    filterType: 'bandpass',
  },
  'transition-invocation': {
    type: 'oscillator',
    oscType: 'sine',
    frequency: 200,
    frequencyEnd: 60,
    duration: 5000,
    gain: 0.25,
  },
  'transition-result': {
    type: 'filtered-noise',
    duration: 1000,
    gain: 0.15,
    filterFreq: 500,
    filterQ: 1,
    filterType: 'lowpass',
  },
  'action-divination': {
    type: 'noise',
    duration: 150,
    gain: 0.5,
    filterFreq: 800,
    filterQ: 2,
    filterType: 'bandpass',
  },
  'action-scatter': {
    type: 'noise',
    duration: 200,
    gain: 0.35,
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'highpass',
  },
  'transition-blessing': {
    type: 'oscillator',
    oscType: 'sine',
    frequency: 300,
    frequencyEnd: 600,
    duration: 2000,
    gain: 0.3,
  },
  'result-saint': {
    type: 'oscillator',
    oscType: 'sine',
    frequency: 220,
    frequencyEnd: 440,
    duration: 2000,
    gain: 0.35,
  },
  'result-laugh': {
    type: 'noise',
    duration: 80,
    gain: 0.3,
    filterFreq: 2000,
    filterQ: 1,
    filterType: 'bandpass',
  },
  'result-anger': {
    type: 'noise',
    duration: 250,
    gain: 0.45,
    filterFreq: 200,
    filterQ: 3,
    filterType: 'lowpass',
  },
  'landing-suspense': {
    type: 'oscillator',
    oscType: 'sine',
    frequency: 85,
    duration: 0,
    gain: 0.18,
    filterFreq: 200,
    filterQ: 3,
    filterType: 'lowpass',
    lfoFreq: 0.15,
    lfoDepth: 8,
    lfoGainDepth: 0.04,
  },
};

const VOLUME = {
  master: 0.7,
  ambient: 0.3,
  action: 0.6,
  transition: 0.8,
} as const;

class AudioManagerSingleton {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private ambientGains: GainNode[] = [];
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  private async _doInit(): Promise<void> {
    if (this.initialized) {
      if (this.ctx?.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = VOLUME.master;
    this.masterGain.connect(this.ctx.destination);

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.initialized = true;
  }

  // --- Synthesis helpers ---

  private createNoiseBuffer(durationSec: number): AudioBuffer {
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private makeGain(volume: number): GainNode {
    const gain = this.ctx!.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain!);
    return gain;
  }

  // --- Ambient sounds (loop) ---

  playAmbientLayers(ids: SoundId[]): void {
    if (!this.ctx || !this.masterGain) return;
    this.stopAmbient();
    for (const id of ids) {
      this.startAmbientLayer(id);
    }
  }

  private startAmbientLayer(id: SoundId, volume?: number): void {
    if (!this.ctx || !this.masterGain) return;

    const config = SOUND_SYNTH[id];
    if (!config) return;

    const layerGain = this.makeGain(volume ?? VOLUME.ambient);

    if (config.type === 'oscillator') {
      const osc = this.ctx.createOscillator();
      osc.type = config.oscType ?? 'sine';
      osc.frequency.value = config.frequency ?? 100;
      if (config.frequencyEnd) {
        osc.frequency.linearRampToValueAtTime(
          config.frequencyEnd,
          this.ctx.currentTime + 4,
        );
      }

      let lastNode: AudioNode = osc;

      if (config.filterFreq) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = config.filterType ?? 'lowpass';
        filter.frequency.value = config.filterFreq;
        filter.Q.value = config.filterQ ?? 1;
        osc.connect(filter);
        lastNode = filter;
      }

      lastNode.connect(layerGain);
      osc.start();

      // LFO modulation — slow frequency + gain breathing
      if (config.lfoFreq) {
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = config.lfoFreq;
        const lfoGainNode = this.ctx.createGain();
        lfoGainNode.gain.value = config.lfoDepth ?? 5;
        lfo.connect(lfoGainNode);
        lfoGainNode.connect(osc.frequency);
        lfo.start();
        this.ambientNodes.push(lfo, lfoGainNode);
      }
      if (config.lfoGainDepth) {
        const gainLfo = this.ctx.createOscillator();
        gainLfo.frequency.value = config.lfoFreq ?? 0.1;
        const gainLfoNode = this.ctx.createGain();
        gainLfoNode.gain.value = config.lfoGainDepth;
        gainLfo.connect(gainLfoNode);
        gainLfoNode.connect(layerGain.gain);
        gainLfo.start();
        this.ambientNodes.push(gainLfo, gainLfoNode);
      }

      this.ambientNodes.push(osc);
      this.ambientGains.push(layerGain);

    } else if (config.type === 'filtered-noise') {
      const buffer = this.createNoiseBuffer(2);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = config.filterType ?? 'bandpass';
      filter.frequency.value = config.filterFreq ?? 1000;
      filter.Q.value = config.filterQ ?? 1;

      source.connect(filter);
      filter.connect(layerGain);
      source.start();
      this.ambientNodes.push(source, filter);
      this.ambientGains.push(layerGain);
    }
  }

  async playAmbient(id: SoundId, volume?: number): Promise<void> {
    if (!this.ctx || !this.masterGain) return;
    this.stopAmbient();
    this.startAmbientLayer(id, volume);
  }

  stopAmbient(): void {
    for (const node of this.ambientNodes) {
      try {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
          node.stop();
        }
        node.disconnect();
      } catch {
        // Already stopped
      }
    }
    for (const gain of this.ambientGains) {
      try { gain.disconnect(); } catch { /* ok */ }
    }
    this.ambientNodes = [];
    this.ambientGains = [];
  }

  // --- One-shot sounds ---

  playAction(id: SoundId, volume?: number): void {
    this.playOneShot(id, volume ?? VOLUME.action);
  }

  playTransition(id: SoundId, volume?: number): void {
    this.playOneShot(id, volume ?? VOLUME.transition);
  }

  private playOneShot(id: SoundId, volume: number): void {
    if (!this.ctx || !this.masterGain) return;

    const config = SOUND_SYNTH[id];
    if (!config) return;

    const pitchVar = 0.9 + Math.random() * 0.2;
    const freq = (config.frequency ?? 100) * pitchVar;

    const layerGain = this.makeGain(volume);

    if (config.type === 'oscillator' || config.type === 'filtered-noise') {
      const osc = this.ctx.createOscillator();
      osc.type = config.oscType ?? 'sine';
      osc.frequency.value = freq;
      if (config.frequencyEnd) {
        osc.frequency.linearRampToValueAtTime(
          config.frequencyEnd * pitchVar,
          this.ctx.currentTime + config.duration / 1000,
        );
      }

      let lastNode: AudioNode = osc;

      if (config.filterFreq) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = config.filterType ?? 'lowpass';
        filter.frequency.value = config.filterFreq;
        filter.Q.value = config.filterQ ?? 1;
        osc.connect(filter);
        lastNode = filter;
      }

      lastNode.connect(layerGain);
      osc.start();
      osc.stop(this.ctx.currentTime + config.duration / 1000);

    } else if (config.type === 'noise') {
      const durationSec = config.duration / 1000;
      const buffer = this.createNoiseBuffer(durationSec);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = config.filterType ?? 'highpass';
      filter.frequency.value = (config.filterFreq ?? 1000) * pitchVar;
      filter.Q.value = config.filterQ ?? 1;

      const envelope = this.ctx.createGain();
      envelope.gain.setValueAtTime(0, this.ctx.currentTime);
      envelope.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.005);
      envelope.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + durationSec);

      source.connect(filter);
      filter.connect(envelope);
      envelope.connect(layerGain);
      source.start();
      source.stop(this.ctx.currentTime + durationSec);
    }
  }

  setMasterVolume(v: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, v));
    }
  }

  dispose(): void {
    this.stopAmbient();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.masterGain = null;
    this.initialized = false;
    instance = null;
  }
}

// Singleton
let instance: AudioManagerSingleton | null = null;

export function getAudioManager(): AudioManagerSingleton {
  if (!instance) {
    instance = new AudioManagerSingleton();
  }
  return instance;
}

export type AudioManager = AudioManagerSingleton;
