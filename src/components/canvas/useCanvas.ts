'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { ParticleSystem } from '@/components/canvas/ParticleSystem';
import { type ParticleType } from '@/components/canvas/particles';

interface UseCanvasOptions {
  /** Auto-start animation loop on mount (default: true) */
  autoStart?: boolean;
  /** Callback on each tap/click interaction with x, y coordinates */
  onInteraction?: (x: number, y: number) => void;
}

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  emit: (type: ParticleType, x: number, y: number, count: number) => void;
  system: ParticleSystem | null;
  isActive: boolean;
  start: () => void;
  stop: () => void;
}

export function useCanvas(options: UseCanvasOptions = {}): UseCanvasReturn {
  const { autoStart = true, onInteraction } = options;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const [system, setSystem] = useState<ParticleSystem | null>(null);
  const [isActive, setIsActive] = useState(false);
  const onInteractionRef = useRef(onInteraction);
  onInteractionRef.current = onInteraction;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ps = new ParticleSystem(canvas);
    systemRef.current = ps;
    setSystem(ps);

    // ResizeObserver for responsive canvas
    const observer = new ResizeObserver(() => {
      ps.resize();
    });
    observer.observe(canvas);

    if (autoStart) {
      ps.start();
      setIsActive(true);
    }

    return () => {
      observer.disconnect();
      ps.destroy();
      systemRef.current = null;
      setSystem(null);
      setIsActive(false);
    };
  }, [autoStart]);

  const emit = useCallback(
    (type: ParticleType, x: number, y: number, count: number) => {
      systemRef.current?.emit(type, x, y, count);
      onInteractionRef.current?.(x, y);
    },
    [],
  );

  const start = useCallback(() => {
    systemRef.current?.start();
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    systemRef.current?.stop();
    setIsActive(false);
  }, []);

  return { canvasRef, emit, system, isActive, start, stop };
}
