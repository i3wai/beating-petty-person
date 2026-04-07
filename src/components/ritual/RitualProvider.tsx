'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';

// --- State Types ---

export type RitualState =
  | 'idle'
  | 'invocation'
  | 'select'
  | 'beating'
  | 'burning'
  | 'sealing'
  | 'result';

export type PaymentTier = 'free' | 'named' | 'sealed' | 'full';

export interface EnemyData {
  category: string;
  name?: string;
}

export interface RitualContextShape {
  state: RitualState;
  dispatch: Dispatch<RitualAction>;
  enemy: EnemyData | null;
  paymentTier: PaymentTier;
  isPaid: boolean;
}

// --- Action Types ---

export type RitualAction =
  | { type: 'START_RITUAL' }
  | { type: 'INVOCATION_COMPLETE' }
  | { type: 'SELECT_ENEMY'; payload: EnemyData }
  | { type: 'BEATING_COMPLETE' }
  | { type: 'BURNING_COMPLETE' }
  | { type: 'SEALING_COMPLETE' }
  | { type: 'RESET' };

// --- Internal State ---

interface RitualInternalState {
  ritualState: RitualState;
  enemy: EnemyData | null;
  paymentTier: PaymentTier;
}

const initialState: RitualInternalState = {
  ritualState: 'idle',
  enemy: null,
  paymentTier: 'free',
};

// --- Reducer ---

function ritualReducer(
  state: RitualInternalState,
  action: RitualAction,
): RitualInternalState {
  switch (action.type) {
    case 'START_RITUAL':
      return state.ritualState === 'idle'
        ? { ...state, ritualState: 'invocation' }
        : state;

    case 'INVOCATION_COMPLETE':
      return state.ritualState === 'invocation'
        ? { ...state, ritualState: 'select' }
        : state;

    case 'SELECT_ENEMY':
      return state.ritualState === 'select'
        ? {
            ...state,
            ritualState: 'beating',
            enemy: action.payload,
          }
        : state;

    case 'BEATING_COMPLETE':
      return state.ritualState === 'beating'
        ? { ...state, ritualState: 'burning' }
        : state;

    case 'BURNING_COMPLETE':
      return state.ritualState === 'burning'
        ? { ...state, ritualState: 'sealing' }
        : state;

    case 'SEALING_COMPLETE':
      return state.ritualState === 'sealing'
        ? { ...state, ritualState: 'result' }
        : state;

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// --- Context ---

const RitualContext = createContext<RitualContextShape | null>(null);

export function RitualProvider({ children }: { children: ReactNode }) {
  const [internal, dispatch] = useReducer(ritualReducer, initialState);

  const contextValue: RitualContextShape = {
    state: internal.ritualState,
    dispatch,
    enemy: internal.enemy,
    paymentTier: internal.paymentTier,
    isPaid: internal.paymentTier !== 'free',
  };

  return (
    <RitualContext.Provider value={contextValue}>
      {children}
    </RitualContext.Provider>
  );
}

export function useRitual(): RitualContextShape {
  const ctx = useContext(RitualContext);
  if (!ctx) {
    throw new Error('useRitual must be used within a RitualProvider');
  }
  return ctx;
}
