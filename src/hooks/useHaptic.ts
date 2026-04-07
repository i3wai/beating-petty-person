'use client';

export function useHaptic() {
  const vibrate = (duration: number = 50) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  return { vibrate };
}
