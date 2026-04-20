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
  | 'invocation'      // Step 1: 請神
  | 'select'          // Step 2: 稟告
  | 'firePass'        // Step 3: 過火
  | 'beating'         // Step 4: 打小人
  | 'burning'         // Step 5: 祭白虎/焚化
  | 'paywall'         // 付費轉場
  | 'purification'    // Step 6: 化解
  | 'blessing'        // Step 7: 祈福/進寶
  | 'divination';     // Step 8: 擲筊

export type PaymentTier = 'free' | 'reading' | 'completion' | 'full';

export type DivinationResult = 'saint' | 'laugh' | 'anger';

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
  divinationResult: DivinationResult | null;
}

// --- Action Types ---

export type RitualAction =
  | { type: 'START_RITUAL' }
  | { type: 'INVOCATION_COMPLETE' }
  | { type: 'SELECT_ENEMY'; payload: EnemyData }
  | { type: 'FIRE_PASS_COMPLETE' }
  | { type: 'BEATING_COMPLETE' }
  | { type: 'BURNING_COMPLETE' }
  | { type: 'PAYMENT_COMPLETED'; payload: { tier: PaymentTier } }
  | { type: 'PURIFICATION_COMPLETE' }
  | { type: 'BLESSING_COMPLETE' }
  | { type: 'RESET' };

// --- Internal State ---

interface RitualInternalState {
  ritualState: RitualState;
  enemy: EnemyData | null;
  paymentTier: PaymentTier;
  divinationResult: DivinationResult | null;
}

const defaultState: RitualInternalState = {
  ritualState: 'idle',
  enemy: null,
  paymentTier: 'free',
  divinationResult: null,
};

// --- Reducer ---

function ritualReducer(
  state: RitualInternalState,
  action: RitualAction,
): RitualInternalState {
  switch (action.type) {
    case 'START_RITUAL':
      return state.ritualState === 'idle'
        ? { ...defaultState, ritualState: 'invocation' }
        : state;

    case 'INVOCATION_COMPLETE':
      return state.ritualState === 'invocation'
        ? { ...state, ritualState: 'select' }
        : state;

    case 'SELECT_ENEMY':
      return state.ritualState === 'select'
        ? {
            ...state,
            ritualState: 'firePass',
            enemy: action.payload,
          }
        : state;

    case 'FIRE_PASS_COMPLETE':
      return state.ritualState === 'firePass'
        ? { ...state, ritualState: 'beating' }
        : state;

    case 'BEATING_COMPLETE':
      return state.ritualState === 'beating'
        ? { ...state, ritualState: 'burning' }
        : state;

    case 'BURNING_COMPLETE':
      return state.ritualState === 'burning'
        ? { ...state, ritualState: 'paywall' }
        : state;

    case 'PAYMENT_COMPLETED':
      return state.ritualState === 'paywall'
        ? {
            ...state,
            ritualState: 'purification',
            paymentTier: action.payload.tier,
          }
        : state;

    case 'PURIFICATION_COMPLETE':
      return state.ritualState === 'purification'
        ? { ...state, ritualState: 'blessing' }
        : state;

    case 'BLESSING_COMPLETE':
      return state.ritualState === 'blessing'
        ? { ...state, ritualState: 'divination' }
        : state;

    case 'RESET':
      return defaultState;

    default:
      return state;
  }
}

// --- Context ---

const RitualContext = createContext<RitualContextShape | null>(null);

interface RitualProviderProps {
  children: ReactNode;
  initialState?: Partial<RitualInternalState>;
}

export function RitualProvider({ children, initialState: overrideState }: RitualProviderProps) {
  const mergedInitial = overrideState
    ? { ...defaultState, ...overrideState }
    : defaultState;
  const [internal, dispatch] = useReducer(ritualReducer, mergedInitial);

  const contextValue: RitualContextShape = {
    state: internal.ritualState,
    dispatch,
    enemy: internal.enemy,
    paymentTier: internal.paymentTier,
    isPaid: internal.paymentTier !== 'free',
    divinationResult: internal.divinationResult,
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
