'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { getAudioManager } from './AudioManager';

// --- Sound ID Constants ---
export const SOUND_IDS = {
  AMBIENT_DRONE: 'ambient-drone',
  AMBIENT_WIND: 'ambient-wind',
  ACTION_BEAT: 'action-beat',
  ACTION_PAPER: 'action-paper',
  ACTION_THWACK: 'action-thwack',
  ACTION_DIVINATION: 'action-divination',
  ACTION_SCATTER: 'action-scatter',
  TRANSITION_INVOCATION: 'transition-invocation',
  TRANSITION_RESULT: 'transition-result',
  TRANSITION_BLESSING: 'transition-blessing',
  RESULT_SAINT: 'result-saint',
  RESULT_LAUGH: 'result-laugh',
  RESULT_ANGER: 'result-anger',
} as const;

export type SoundId = (typeof SOUND_IDS)[keyof typeof SOUND_IDS];

/**
 * Hook wrapping the AudioManager singleton for React components.
 *
 * IMPORTANT: Does NOT dispose AudioManager on unmount because it is a
 * process-wide singleton shared across all ritual steps. Disposal would
 * kill audio for every subsequent component.
 *
 * Only the top-level RitualProvider should ever call dispose().
 */
export function useAudio() {
  const [isReady, setIsReady] = useState(false);

  const getMgr = useCallback(() => getAudioManager(), []);

  const init = useCallback(async () => {
    const mgr = getMgr();
    await mgr.init();
    setIsReady(true);
  }, [getMgr]);

  const playAction = useCallback(
    (id: string) => {
      getMgr().playAction(id);
    },
    [getMgr],
  );

  const playAmbient = useCallback(
    (id: string) => {
      getMgr().playAmbient(id);
    },
    [getMgr],
  );

  const stopAmbient = useCallback(() => {
    getMgr().stopAmbient();
  }, [getMgr]);

  const playTransition = useCallback(
    (id: string) => {
      getMgr().playTransition(id);
    },
    [getMgr],
  );

  return useMemo(
    () => ({ init, playAction, playAmbient, stopAmbient, playTransition, isReady }),
    [init, playAction, playAmbient, stopAmbient, playTransition, isReady],
  );
}

