import type { EnemyCategory } from '@/components/ritual/silhouettes';

export interface ReadingFragments {
  openings: string[];
  impacts: string[];
  timings: string[];
  weaknesses: string[];
  closings: string[];
}

export interface GuidanceFragments {
  insights: string[];
  resolutions: string[];
  prophecies: string[];
}

export interface GuidanceResult {
  insight: string;
  resolution: string;
  prophecy: string;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickFragment<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length];
}

export function generateReading(
  fragments: ReadingFragments,
  targetName: string,
  seed: string,
): string {
  const hash = hashSeed(seed);

  const opening = pickFragment(fragments.openings, hash, 0)
    .replace(/\{target\}/g, targetName);
  const impact = pickFragment(fragments.impacts, hash, 7)
    .replace(/\{target\}/g, targetName);
  const timing = pickFragment(fragments.timings, hash, 19)
    .replace(/\{target\}/g, targetName);
  const weakness = pickFragment(fragments.weaknesses, hash, 29)
    .replace(/\{target\}/g, targetName);
  const closing = pickFragment(fragments.closings, hash, 37)
    .replace(/\{target\}/g, targetName);

  return `${opening}\n\n${impact}\n\n${timing}\n\n${weakness}\n\n${closing}`;
}

export function generateGuidance(
  fragments: GuidanceFragments,
  targetName: string,
  seed: string,
): GuidanceResult {
  const hash = hashSeed(seed);

  return {
    insight: pickFragment(fragments.insights, hash, 41)
      .replace(/\{target\}/g, targetName),
    resolution: pickFragment(fragments.resolutions, hash, 53)
      .replace(/\{target\}/g, targetName),
    prophecy: pickFragment(fragments.prophecies, hash, 67)
      .replace(/\{target\}/g, targetName),
  };
}

export function resolveTarget(
  enemyCategory: EnemyCategory,
  enemyName: string | undefined,
  localizedTypeName: string,
): string {
  return enemyName?.trim() || localizedTypeName;
}
