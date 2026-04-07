type SoundId = string;

interface SoundConfig {
  url: string;
  layer: 'ambient' | 'action' | 'transition';
}

const SOUND_MAP: Record<SoundId, SoundConfig> = {
  'ambient-drone': { url: '/audio/drone-low-freq.mp3', layer: 'ambient' },
  'ambient-wind': { url: '/audio/wind-whisper.mp3', layer: 'ambient' },
  'action-beat': { url: '/audio/wood-knock.mp3', layer: 'action' },
  'action-paper': { url: '/audio/paper-rustle.mp3', layer: 'action' },
  'transition-invocation': { url: '/audio/candle-whoosh.mp3', layer: 'transition' },
  'transition-sealing': { url: '/audio/gong-resonate.mp3', layer: 'transition' },
  'transition-result': { url: '/audio/wind-gust.mp3', layer: 'transition' },
};

const VOLUME = {
  master: 0.7,
  ambient: 0.3,
  action: 0.6,
  transition: 0.8,
} as const;

class AudioManagerSingleton {
  private ctx: AudioContext | null = null;
  private buffers: Map<SoundId, AudioBuffer> = new Map();
  private ambientNode: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) {
      // Resume if suspended (iOS Safari tab backgrounded)
      if (this.ctx?.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    this.ctx = new AudioContext();

    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = VOLUME.master;
    this.masterGain.connect(this.ctx.destination);

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.initialized = true;
  }

  async loadSound(id: SoundId): Promise<void> {
    if (!this.ctx) return;
    if (this.buffers.has(id)) return;

    const config = SOUND_MAP[id];
    if (!config) return;

    try {
      const response = await fetch(config.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.buffers.set(id, audioBuffer);
    } catch {
      // Sound file not available yet (stub phase)
    }
  }

  async loadCriticalSounds(): Promise<void> {
    await Promise.all([
      this.loadSound('ambient-drone'),
      this.loadSound('action-beat'),
    ]);
  }

  async playAmbient(id: SoundId, volume?: number): Promise<void> {
    if (!this.ctx || !this.masterGain) return;

    // Stop existing ambient
    this.stopAmbient();

    await this.loadSound(id);
    const buffer = this.buffers.get(id);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = volume ?? VOLUME.ambient;
    this.ambientGain.connect(this.masterGain);
    source.connect(this.ambientGain);
    source.start();

    this.ambientNode = source;
  }

  stopAmbient(): void {
    if (this.ambientNode) {
      try {
        this.ambientNode.stop();
      } catch {
        // Already stopped
      }
      this.ambientNode = null;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
  }

  playAction(id: SoundId, volume?: number): void {
    this.playOneShot(id, volume ?? VOLUME.action);
  }

  playTransition(id: SoundId, volume?: number): void {
    this.playOneShot(id, volume ?? VOLUME.transition);
  }

  private playOneShot(id: SoundId, volume: number): void {
    if (!this.ctx || !this.masterGain) return;

    const buffer = this.buffers.get(id);
    if (!buffer) {
      // Lazy load for next time
      this.loadSound(id);
      return;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // Slight random pitch variation for action sounds
    const config = SOUND_MAP[id];
    if (config?.layer === 'action') {
      source.playbackRate.value = 0.9 + Math.random() * 0.2;
    }

    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain);
    source.connect(gain);

    source.onended = () => {
      gain.disconnect();
    };

    source.start();
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
    this.buffers.clear();
    this.masterGain = null;
    this.initialized = false;
    instance = null;
  }
}

// Singleton instance
let instance: AudioManagerSingleton | null = null;

export function getAudioManager(): AudioManagerSingleton {
  if (!instance) {
    instance = new AudioManagerSingleton();
  }
  return instance;
}

export type AudioManager = AudioManagerSingleton;
