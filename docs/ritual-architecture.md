# Ritual Architecture Design

> Owner: Ritual Engineer | Last updated: 2026-04-07
> Status: Design phase — no code yet, blocked on Task #1 (Next.js init)

---

## 1. State Machine

### States

```
idle → invocation → select → beating → burning → sealing → result
         (transition)  (step 1)  (step 2)  (step 3)  (transition) (step 4)
```

| State | Type | Duration | Entry Condition | Exit Condition |
|-------|------|----------|-----------------|----------------|
| `idle` | initial | - | Page load | User taps "Begin Ritual" |
| `invocation` | transition | ~3s | User taps "Begin Ritual" (also unlocks AudioContext on iOS) | Candle animation completes |
| `select` | step 1 | user-driven | Invocation ends | User picks petty person type + taps confirm |
| `beating` | step 2 | 30-60s | Selection confirmed | Timer expires OR user taps "Enough" |
| `burning` | step 3 | ~8-10s | Beating timer done | Fire animation completes (paper fully consumed) |
| `sealing` | transition | ~3s | Burning ends | Stamp + rune flash completes |
| `result` | step 4 | permanent | Sealing ends | User navigates away or shares |

### State Machine Implementation

```
useReducer + React Context

type RitualState = 'idle' | 'invocation' | 'select' | 'beating' | 'burning' | 'sealing' | 'result'

type RitualAction =
  | { type: 'START_RITUAL' }           // idle → invocation
  | { type: 'INVOCATION_COMPLETE' }    // invocation → select
  | { type: 'SELECT_ENEMY'; payload: { category: string; name?: string } }  // select → beating
  | { type: 'BEATING_COMPLETE' }       // beating → burning (timer or manual)
  | { type: 'BURNING_COMPLETE' }       // burning → sealing
  | { type: 'SEALING_COMPLETE' }       // sealing → result
  | { type: 'RESET' }                  // any → idle
```

### Context Shape

```
RitualContext = {
  state: RitualState
  dispatch: (action: RitualAction) => void
  enemy: { category: string; name?: string } | null
  paymentTier: 'free' | 'named' | 'sealed' | 'full'
  isPaid: boolean
}
```

### Component Tree (per state)

```
<RitualProvider>
  <RitualOrchestrator>           ← reads state, renders current step
    <InvocationTransition />     ← state === 'invocation'
    <EnemySelectStep />          ← state === 'select'
    <BeatingStep />              ← state === 'beating'
    <BurningStep />              ← state === 'burning'
    <SealingTransition />        ← state === 'sealing'
    <ResultStep />               ← state === 'result'
  </RitualOrchestrator>
</RitualProvider>
```

Each step component is lazy-loaded with `React.lazy()` + `Suspense` to avoid loading Canvas code upfront.

---

## 2. Canvas 2D Particle System

### Design Constraints

- **Max particles: 80** — hard limit, oldest particles recycled
- **Target: 30fps on low-end Android** (Snapdragon 400-series, 2GB RAM)
- **Canvas resolution: device pixel ratio capped at 2** — avoid 3x retina overhead
- **No WebGL, no Three.js, no Lottie** — pure Canvas 2D API

### Particle Types

| Type | Used In | Visual | Lifetime | Count |
|------|---------|--------|----------|-------|
| `HitSpark` | Beating | Orange/red sparks radiating from tap point | 400-600ms | Burst of 8-12 per tap |
| `FireFlame` | Burning | Orange/yellow flame particles rising | 800-1200ms | Continuous, 20-40 active |
| `Smoke` | Burning | Gray translucent circles drifting up | 1500-2000ms | Continuous, 10-20 active |
| `SealGlow` | Sealing | Gold rune flash particles | 500-800ms | Burst of 15-20 |

### ParticleSystem Class

```
class ParticleSystem {
  particles: Particle[]          // max 80
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  animationId: number | null

  emit(type: ParticleType, x: number, y: number, count: number): void
  update(dt: number): void       // called per frame
  render(): void                 // called per frame
  start(): void                  // requestAnimationFrame loop
  stop(): void                   // cancelAnimationFrame
  clear(): void                  // remove all particles
}
```

### Particle Object

```
Particle {
  type: ParticleType
  x, y: number              // position
  vx, vy: number            // velocity
  life: number              // remaining ms
  maxLife: number            // total ms
  size: number
  opacity: number            // derived from life/maxLife
  color: string              // vermillion, gold, smoke-gray
}
```

### Performance Strategy

1. **Object pool**: Pre-allocate 80 Particle objects, reuse via reset instead of `new`
2. **No alpha compositing on bulk**: Use `globalAlpha` sparingly, prefer opaque draws
3. **Skip frames**: If `dt > 50ms` (below 20fps), skip render rather than accumulate particles
4. **Resolution cap**: `canvas.width = canvas.clientWidth * Math.min(dpr, 2)`
5. **Dirty rect tracking**: Only clear/redraw area with active particles (optimization for later if needed)

### Custom Hook: `useCanvas`

```
useCanvas(options: {
  particleTypes: ParticleType[]
  onFrame?: (ctx, dt) => void
  onInteraction?: (x, y) => void
}) => {
  canvasRef: RefObject<HTMLCanvasElement>
  emit: (type, x, y, count) => void
  system: ParticleSystem | null
}
```

- Handles canvas setup, DPR scaling, resize observer
- Starts/stops animation loop on mount/unmount
- Returns `emit` for step components to trigger particles

---

## 3. Audio System

### Three-Layer Architecture

| Layer | Type | Playback | Examples |
|-------|------|----------|----------|
| Ambient | Loop | Continuous during ritual | Low-frequency drone, wind |
| Action | One-shot | Triggered by user interaction | Wood knock (beat), paper crumple (select) |
| Transition | One-shot | Triggered by state change | Gong (sealing), candle whoosh (invocation) |

### AudioContext Manager (Singleton)

```
AudioManager {
  ctx: AudioContext | null        // lazy init on first user interaction
  ambientNode: AudioBufferSourceNode | null
  loadedBuffers: Map<string, AudioBuffer>

  async init(): Promise<void>     // create AudioContext, resume if suspended
  async loadSound(id: string, url: string): Promise<void>
  playAmbient(id: string, volume?: number): void   // loop = true
  stopAmbient(): void
  playAction(id: string, volume?: number): void    // one-shot
  playTransition(id: string, volume?: number): void // one-shot, higher priority
  setMasterVolume(v: number): void
  dispose(): void                                  // cleanup on unmount
}
```

### Sound Map

| ID | Layer | File | Trigger |
|----|-------|------|---------|
| `ambient-drone` | ambient | drone-low-freq.mp3 | Ritual start (invocation) |
| `ambient-wind` | ambient | wind-whisper.mp3 | Burning step |
| `action-beat` | action | wood-knock.mp3 | Each tap during beating |
| `action-paper` | action | paper-rustle.mp3 | Enemy type selection |
| `transition-invocation` | transition | candle-whoosh.mp3 | Idle → Invocation |
| `transition-sealing` | transition | gong-resonate.mp3 | Burning → Sealing |
| `transition-result` | transition | wind-gust.mp3 | Sealing → Result |

### iOS Safari Audio Unlock

iOS Safari requires a **user gesture** to create/resume AudioContext. Strategy:

1. **Invocation transition is the unlock point**: User taps "Begin Ritual" button
2. On that tap handler:
   ```
   await audioManager.init()  // creates AudioContext
   // AudioContext is now "running" because it was triggered by user gesture
   audioManager.playAmbient('ambient-drone')
   ```
3. All subsequent sounds work without restriction
4. If AudioContext gets suspended (rare, tab backgrounded), resume on next interaction

### Preloading Strategy

- **Critical sounds** (ambient drone, first action sound): Load during invocation transition (3s window)
- **Step sounds**: Load lazily when entering each step
- **Cache**: `loadedBuffers` Map prevents re-downloading
- **Format**: MP3 (universal), with OGG fallback for Android (smaller file size)

### Volume Control

- Master volume: 0.7 default (not max — avoids distortion on phone speakers)
- Ambient: 0.3 (background, subtle)
- Action: 0.6 (noticeable but not jarring)
- Transition: 0.8 (these are the "wow" moments)

---

## 4. Step Details

### Step 1: Select Enemy (CSS-only, no Canvas)

- **Visual**: 6 paper-figure silhouettes arranged in 2x3 grid (mobile) or 3x2 (desktop)
- **Interaction**: Hover glow (CSS), tap to select (active state), confirm button
- **Custom name**: Text input slides up if "Custom" is selected
- **Animation**: Paper figure fades in with slight scale (CSS `@keyframes`)
- **Sound**: `action-paper` on selection
- **No Canvas needed** — pure CSS + Tailwind

### Step 2: Beating (Canvas 2D)

- **Visual**: Paper figure in center, HitSpark particles on each tap
- **Interaction**: Tap/click anywhere on paper figure area
- **Timer**: 30s default, user can extend to 60s or tap "Enough" to skip
- **Haptic**: `navigator.vibrate(50)` on each tap (Android only, graceful no-op on iOS)
- **Progress**: Visual "damage" — paper figure gradually darkens/crumples (CSS opacity/transform driven by tap count)
- **Particle budget**: Max 30 active HitSpark particles at any time (leaves room for system)
- **Sound**: `action-beat` on each tap (with slight random pitch variation via playbackRate)

### Step 3: Burning (Canvas 2D)

- **Visual**: FireFlame + Smoke particles rise from bottom, paper figure dissolves from edges inward
- **Duration**: ~8-10s auto-play
- **Paper dissolution**: CSS clip-path or mask-image animated to reveal "burned" state
- **Particle budget**: 40 FireFlame + 15 Smoke = 55 active (under 80 limit)
- **Sound**: `ambient-wind` replaces `ambient-drone`, plus crackling fire one-shots

### Step 4: Result (CSS + optional Canvas for paid)

- **Free result**: Text reveal with CSS fade-in animation
- **Paid seal (optional Canvas)**: Gold seal stamp animation with SealGlow particles (15-20)
- **Certificate**: Pure HTML/CSS, no Canvas

---

## 5. Transition Animations

### Invocation (idle → select)

- **Duration**: ~3 seconds
- **Visual**: Screen darkens, candle flames appear (CSS animation with box-shadow glow), light flicker effect
- **CSS**: `@keyframes candleFlicker` with randomized `box-shadow` offsets and opacity
- **Sound**: `transition-invocation` + `ambient-drone` starts
- **Purpose**: Sets mood, unlocks AudioContext via user tap

### Sealing (burning → result)

- **Duration**: ~3 seconds
- **Visual**: Stamp slams down (CSS scale + opacity transition), rune circle flashes gold
- **CSS**: `@keyframes stampSlam` (scale from 2x to 1x with overshoot), `@keyframes runeFlash` (opacity pulse)
- **Sound**: `transition-sealing` (gong)
- **Paid enhancement**: Seal animation is longer and more dramatic, includes Canvas SealGlow particles

---

## 6. prefers-reduced-motion Degradation

### Detection

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

### Degradation Map

| Feature | Normal | Reduced Motion |
|---------|--------|----------------|
| Particle effects | Canvas 2D animation | Disabled entirely |
| Invocation transition | 3s candle flicker | Instant state change (0s) |
| Beating sparks | Canvas burst per tap | Simple CSS scale pulse on paper figure |
| Burning fire | Canvas particles + dissolution | Simple CSS fade-out of paper figure (2s) |
| Sealing stamp | 3s stamp + rune flash | Instant stamp appear |
| Ambient audio | Plays | Still plays (not motion-related) |
| Haptic feedback | Vibrates | Still vibrates (not motion-related) |

### Implementation

- `useReducedMotion()` hook reads media query, returns boolean
- Each step component checks hook, conditionally renders Canvas or CSS fallback
- ParticleSystem never initializes if reduced motion is active
- No separate code path — same components, just skip Canvas layer

---

## 7. File Structure (Planned)

```
src/
  components/
    ritual/
      RitualProvider.tsx          # Context + Reducer
      RitualOrchestrator.tsx      # State-based step renderer
      InvocationTransition.tsx    # Transition animation (CSS)
      SealingTransition.tsx       # Transition animation (CSS)
      steps/
        EnemySelectStep.tsx       # Step 1 (CSS only)
        BeatingStep.tsx           # Step 2 (Canvas + haptic)
        BurningStep.tsx           # Step 3 (Canvas)
        ResultStep.tsx            # Step 4 (CSS + optional Canvas)
    canvas/
      ParticleSystem.ts           # Core particle engine class
      particles.ts                # Particle types + factory
      useCanvas.ts                # Canvas hook
    audio/
      AudioManager.ts             # AudioContext singleton
      useAudio.ts                 # React hook wrapper
      sounds.ts                   # Sound ID → URL map
    hooks/
      useReducedMotion.ts         # prefers-reduced-motion hook
      useHaptic.ts                # navigator.vibrate wrapper
```

---

## 8. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| FPS (beating step) | >= 30fps | Chrome DevTools Performance tab |
| FPS (burning step) | >= 30fps | Same |
| Particle count | <= 80 | Runtime assert |
| Audio latency (action sounds) | < 100ms | Perceived responsiveness |
| First interactive (step 1) | < 2s after invocation | User perception |
| Canvas init time | < 200ms | Performance.mark |
| Memory (total ritual) | < 50MB additional | Chrome Memory panel |

### Low-end Android Baseline

- Device profile: Snapdragon 450, 2GB RAM, Android 11
- Chrome GPU blacklist: Canvas 2D should still work (software rendering fallback)
- If FPS drops below 20: automatically reduce particle count to 40
- If FPS drops below 15: disable particles, switch to CSS-only

---

## 9. Edge Cases

| Case | Handling |
|------|----------|
| User refreshes mid-ritual | State lost (by design — ritual = one continuous session). Re-start from idle. |
| Tab backgrounds during burning | Canvas pauses (rAF stops). Resume from same point on return. |
| AudioContext suspended | Resume on next user tap within ritual. |
| Screen rotation (mobile) | Canvas resize via ResizeObserver, particles adjust. No state loss. |
| Double-tap (beating) | Debounce 100ms. Each tap = one burst of particles + one sound. |
| Very fast tapping | Cap particle emission rate to 4 bursts/second max. |

---

## 10. Implementation Order (once unblocked)

1. **RitualProvider + state machine** — foundation, no visuals
2. **useReducedMotion + useCanvas hooks** — infrastructure
3. **ParticleSystem class** — core engine, test in isolation
4. **AudioManager** — init + ambient layer first
5. **EnemySelectStep** — simplest step, CSS-only, validates state flow
6. **InvocationTransition** — validates iOS audio unlock
7. **BeatingStep** — first Canvas integration + haptic
8. **BurningStep** — complex particles + paper dissolution
9. **SealingTransition** — CSS animation
10. **ResultStep** — final step, integrates payment tier display
