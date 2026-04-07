'use client';

import { lazy, Suspense } from 'react';
import { useRitual } from '@/components/ritual/RitualProvider';

// Lazy-load step components — avoid loading Canvas code upfront
const InvocationTransition = lazy(
  () => import('@/components/ritual/InvocationTransition'),
);
const EnemySelectStep = lazy(
  () => import('@/components/ritual/steps/EnemySelectStep'),
);
const BeatingStep = lazy(
  () => import('@/components/ritual/steps/BeatingStep'),
);
const BurningStep = lazy(
  () => import('@/components/ritual/steps/BurningStep'),
);
const SealingTransition = lazy(
  () => import('@/components/ritual/SealingTransition'),
);
const ResultStep = lazy(
  () => import('@/components/ritual/steps/ResultStep'),
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
 */
export default function RitualOrchestrator() {
  const { state } = useRitual();

  return (
    <Suspense fallback={<StepLoader />}>
      {state === 'invocation' && <InvocationTransition />}
      {state === 'select' && <EnemySelectStep />}
      {state === 'beating' && <BeatingStep />}
      {state === 'burning' && <BurningStep />}
      {state === 'sealing' && <SealingTransition />}
      {state === 'result' && <ResultStep />}
    </Suspense>
  );
}
