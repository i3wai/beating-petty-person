'use client';

import { lazy, Suspense, useState, useEffect } from 'react';
import { useRitual } from '@/components/ritual/RitualProvider';

// Lazy-load step components — avoid loading Canvas code upfront
const InvocationTransition = lazy(
  () => import('@/components/ritual/InvocationTransition'),
);
const EnemySelectStep = lazy(
  () => import('@/components/ritual/steps/EnemySelectStep'),
);
const FirePassTransition = lazy(
  () => import('@/components/ritual/FirePassTransition'),
);
const BeatingStep = lazy(
  () => import('@/components/ritual/steps/BeatingStep'),
);
const BurningStep = lazy(
  () => import('@/components/ritual/steps/BurningStep'),
);
const PaywallTransition = lazy(
  () => import('@/components/ritual/PaywallTransition'),
);
const PurificationStep = lazy(
  () => import('@/components/ritual/steps/PurificationStep'),
);
const BlessingStep = lazy(
  () => import('@/components/ritual/steps/BlessingStep'),
);
const DivinationStep = lazy(
  () => import('@/components/ritual/steps/DivinationStep'),
);

function StepLoader() {
  return (
    <div className="min-h-[80dvh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
    </div>
  );
}

/**
 * Reads ritual state and renders the appropriate step component.
 * All steps are lazy-loaded to keep initial bundle small.
 * Includes a 1-second crossfade transition between beating and burning.
 */
export default function RitualOrchestrator() {
  const { state } = useRitual();
  const [burningVisible, setBurningVisible] = useState(false);

  // 1-second crossfade when transitioning to burning
  useEffect(() => {
    if (state === 'burning') {
      const timer = setTimeout(() => setBurningVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setBurningVisible(false);
    }
  }, [state]);

  return (
    <Suspense fallback={<StepLoader />}>
      {state === 'invocation' && <InvocationTransition />}
      {state === 'select' && <EnemySelectStep />}
      {state === 'firePass' && <FirePassTransition />}
      {state === 'beating' && <BeatingStep />}
      {state === 'burning' && (
        <div
          style={{
            opacity: burningVisible ? 1 : 0,
            transition: 'opacity 1s ease-in',
          }}
        >
          <BurningStep />
        </div>
      )}
      {state === 'paywall' && <PaywallTransition />}
      {state === 'purification' && <PurificationStep />}
      {state === 'blessing' && <BlessingStep />}
      {state === 'divination' && <DivinationStep />}
    </Suspense>
  );
}
