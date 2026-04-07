export enum ParticleType {
  HitSpark = 'hit-spark',
  FireFlame = 'fire-flame',
  Smoke = 'smoke',
  SealGlow = 'seal-glow',
}

export interface Particle {
  type: ParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  color: string;
  active: boolean;
}

interface ParticleConfig {
  lifetimeRange: [number, number]; // [min, max] in ms
  sizeRange: [number, number];
  speedRange: [number, number];
  colors: string[];
  gravity?: number;
  spread?: number; // angle spread in radians, PI = full circle
}

const CONFIGS: Record<ParticleType, ParticleConfig> = {
  [ParticleType.HitSpark]: {
    lifetimeRange: [400, 600],
    sizeRange: [2, 5],
    speedRange: [80, 200],
    colors: ['#c23616', '#e55039', '#f39c12', '#ffd32a'],
    gravity: 150,
    spread: Math.PI * 2,
  },
  [ParticleType.FireFlame]: {
    lifetimeRange: [800, 1200],
    sizeRange: [4, 10],
    speedRange: [30, 80],
    colors: ['#c23616', '#e55039', '#f39c12', '#d4a843'],
    gravity: -40, // flames rise
    spread: Math.PI * 0.6,
  },
  [ParticleType.Smoke]: {
    lifetimeRange: [1500, 2000],
    sizeRange: [8, 18],
    speedRange: [15, 40],
    colors: ['#666666', '#555555', '#777777'],
    gravity: -20,
    spread: Math.PI * 0.4,
  },
  [ParticleType.SealGlow]: {
    lifetimeRange: [500, 800],
    sizeRange: [3, 7],
    speedRange: [60, 140],
    colors: ['#d4a843', '#f5c842', '#ffeaa7'],
    gravity: 0,
    spread: Math.PI * 2,
  },
};

export function createParticle(): Particle {
  return {
    type: ParticleType.HitSpark,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 0,
    size: 0,
    opacity: 1,
    color: '#ffffff',
    active: false,
  };
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function resetParticle(
  p: Particle,
  type: ParticleType,
  x: number,
  y: number,
): void {
  const config = CONFIGS[type];
  const angle = Math.random() * (config.spread ?? Math.PI * 2) - (config.spread ?? Math.PI * 2) / 2;
  const speed = randomRange(config.speedRange[0], config.speedRange[1]);

  p.type = type;
  p.x = x;
  p.y = y;
  p.vx = Math.cos(angle) * speed;
  p.vy = Math.sin(angle) * speed;
  p.maxLife = randomRange(config.lifetimeRange[0], config.lifetimeRange[1]);
  p.life = p.maxLife;
  p.size = randomRange(config.sizeRange[0], config.sizeRange[1]);
  p.opacity = 1;
  p.color = config.colors[Math.floor(Math.random() * config.colors.length)];
  p.active = true;
}

export function updateParticle(p: Particle, dt: number): void {
  if (!p.active) return;

  const config = CONFIGS[p.type];
  const dtSec = dt / 1000;

  p.x += p.vx * dtSec;
  p.y += p.vy * dtSec;

  if (config.gravity) {
    p.vy += config.gravity * dtSec;
  }

  p.life -= dt;
  p.opacity = Math.max(0, p.life / p.maxLife);

  if (p.life <= 0) {
    p.active = false;
  }
}
