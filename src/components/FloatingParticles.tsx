'use client';

/**
 * FloatingParticles — Subtle floating ember/ash particles.
 * 10 tiny particles, gold/vermillion, floating upward.
 * Pure CSS animation — no JS loop. Each particle has unique timing.
 */

interface FloatingParticlesProps {
  className?: string;
}

const PARTICLES = [
  { x: '10%', size: 2, delay: '0s', duration: '22s', color: 'var(--color-gold)' },
  { x: '25%', size: 1.5, delay: '3s', duration: '28s', color: 'var(--color-vermillion)' },
  { x: '40%', size: 2.5, delay: '7s', duration: '25s', color: 'var(--color-gold-light)' },
  { x: '55%', size: 1, delay: '1s', duration: '30s', color: 'var(--color-ember)' },
  { x: '65%', size: 2, delay: '10s', duration: '24s', color: 'var(--color-gold)' },
  { x: '75%', size: 1.5, delay: '5s', duration: '27s', color: 'var(--color-vermillion)' },
  { x: '85%', size: 2, delay: '8s', duration: '26s', color: 'var(--color-gold-light)' },
  { x: '15%', size: 1, delay: '12s', duration: '29s', color: 'var(--color-ember)' },
  { x: '50%', size: 1.5, delay: '15s', duration: '23s', color: 'var(--color-gold)' },
  { x: '92%', size: 2, delay: '4s', duration: '25s', color: 'var(--color-vermillion-light)' },
];

export default function FloatingParticles({ className = '' }: FloatingParticlesProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="floating-particle"
          style={{
            left: p.x,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}, ${p.delay}`,
            animationDuration: `${p.duration}, 8s`,
          }}
        />
      ))}
    </div>
  );
}
