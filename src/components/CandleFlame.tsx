'use client';

/**
 * CandleFlame — Pure CSS candle flame animation.
 * 3 candles at different scales for depth.
 * Uses layered gradients + keyframe flicker, no JS animation loop.
 */

interface CandleFlameProps {
  className?: string;
}

export default function CandleFlame({ className = '' }: CandleFlameProps) {
  return (
    <div className={`flex items-end justify-center gap-6 md:gap-10 ${className}`}>
      {/* Candle 1 — small, left */}
      <div className="candle candle-sm">
        <div className="candle-flame">
          <div className="candle-flame-inner" />
          <div className="candle-flame-outer" />
        </div>
        <div className="candle-wick" />
        <div className="candle-body" />
      </div>

      {/* Candle 2 — large, center */}
      <div className="candle candle-lg">
        <div className="candle-flame">
          <div className="candle-flame-inner" />
          <div className="candle-flame-outer" />
        </div>
        <div className="candle-wick" />
        <div className="candle-body" />
      </div>

      {/* Candle 3 — medium, right */}
      <div className="candle candle-md">
        <div className="candle-flame">
          <div className="candle-flame-inner" />
          <div className="candle-flame-outer" />
        </div>
        <div className="candle-wick" />
        <div className="candle-body" />
      </div>
    </div>
  );
}
