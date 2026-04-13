import {
  Particle,
  ParticleType,
  createParticle,
  resetParticle,
  updateParticle,
} from './particles';

const MAX_PARTICLES = 80;
const MAX_DPR = 2;
const FRAME_SKIP_THRESHOLD = 50; // skip render if dt > 50ms (<20fps)
const FPS_DEGRADE_LOW = 20;
const FPS_DEGRADE_CRITICAL = 15;

export class ParticleSystem {
  private particles: Particle[];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private lastTime: number = 0;
  private dpr: number;
  private activeCount: number = 0;
  private emitRateLimit = 4; // max bursts per second
  private lastEmitTime = 0;
  private fpsHistory: number[] = [];
  private degraded = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;

    this.dpr = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      MAX_DPR,
    );

    // Pre-allocate object pool
    this.particles = Array.from({ length: MAX_PARTICLES }, () => createParticle());

    this.setupCanvas();
  }

  private setupCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private findInactive(): number {
    for (let i = 0; i < this.particles.length; i++) {
      if (!this.particles[i].active) return i;
    }
    // Recycle oldest if pool exhausted
    let oldestIdx = 0;
    let oldestLife = Infinity;
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].life < oldestLife) {
        oldestLife = this.particles[i].life;
        oldestIdx = i;
      }
    }
    return oldestIdx;
  }

  emit(type: ParticleType, x: number, y: number, count: number): void {
    const now = performance.now();

    // Rate limit: max N bursts per second
    if (now - this.lastEmitTime < 1000 / this.emitRateLimit) return;
    this.lastEmitTime = now;

    // Degrade: halve count if degraded
    const actualCount = this.degraded ? Math.ceil(count / 2) : count;

    for (let i = 0; i < actualCount; i++) {
      const idx = this.findInactive();
      const p = this.particles[idx];
      if (p.active) this.activeCount--;
      resetParticle(p, type, x, y);
      this.activeCount++;
    }
  }

  private loop = (timestamp: number): void => {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // Track FPS for auto-degradation
    if (dt > 0) {
      const fps = 1000 / dt;
      this.fpsHistory.push(fps);
      if (this.fpsHistory.length > 30) this.fpsHistory.shift();
      this.checkDegradation();
    }

    // Skip frame if too slow
    if (dt > FRAME_SKIP_THRESHOLD) {
      this.animationId = requestAnimationFrame(this.loop);
      return;
    }

    this.update(dt);
    this.render();
    this.animationId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    this.activeCount = 0;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.active) continue;
      updateParticle(p, dt);
      if (p.active) this.activeCount++;
    }
  }

  private render(): void {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.type === ParticleType.Smoke) {
        // Smoke: circle with soft edge
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === ParticleType.HitSpark) {
        // HitSpark: circles for natural particle feel
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Flames, glow: small rectangles (faster rendering)
        this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    }

    this.ctx.globalAlpha = 1;
  }

  private checkDegradation(): void {
    if (this.fpsHistory.length < 10) return;
    const avgFps =
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    if (avgFps < FPS_DEGRADE_CRITICAL) {
      // Critical: stop all particles
      this.degraded = true;
      this.clear();
    } else if (avgFps < FPS_DEGRADE_LOW) {
      // Low: halve particle count
      this.degraded = true;
    } else if (avgFps > FPS_DEGRADE_LOW + 5) {
      // Recovered
      this.degraded = false;
    }
  }

  start(): void {
    if (this.animationId !== null) return;
    this.lastTime = 0;
    this.animationId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  clear(): void {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].active = false;
    }
    this.activeCount = 0;
    const { width, height } = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, width, height);
  }

  resize(): void {
    this.setupCanvas();
  }

  getActiveCount(): number {
    return this.activeCount;
  }

  isDegraded(): boolean {
    return this.degraded;
  }

  destroy(): void {
    this.stop();
    this.clear();
  }
}
