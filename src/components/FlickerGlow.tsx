'use client';

/**
 * FlickerGlow — Background atmospheric glow.
 * Subtle pulsing vermillion/gold radial gradients.
 * Creates "candlelit room" feel. 2-3 glow orbs at different rhythms.
 */

interface FlickerGlowProps {
  className?: string;
}

export default function FlickerGlow({ className = '' }: FlickerGlowProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Primary glow — center-bottom, vermillion */}
      <div className="glow-orb glow-orb-primary" />

      {/* Secondary glow — top-right, gold */}
      <div className="glow-orb glow-orb-secondary hidden md:block" />

      {/* Subtle tertiary — bottom-left, warm */}
      <div className="glow-orb glow-orb-tertiary" />
    </div>
  );
}
