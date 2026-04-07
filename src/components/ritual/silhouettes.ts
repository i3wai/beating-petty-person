/**
 * Unique silhouette clip-paths per enemy type.
 * Shared across EnemySelectStep, BeatingStep, and BurningStep
 * so the paper figure shape is consistent throughout the ritual.
 */

export type EnemyCategory =
  | 'backstabber'
  | 'toxicBoss'
  | 'ex'
  | 'energyVampire'
  | 'bully'
  | 'custom';

export const ENEMY_CATEGORIES: EnemyCategory[] = [
  'backstabber',
  'toxicBoss',
  'ex',
  'energyVampire',
  'bully',
  'custom',
];

export const SILHOUETTE_CLIPS: Record<EnemyCategory, string> = {
  backstabber:
    'polygon(50% 0%, 75% 12%, 80% 40%, 70% 60%, 85% 100%, 15% 100%, 30% 60%, 20% 40%, 25% 12%)',
  toxicBoss:
    'polygon(40% 0%, 60% 0%, 65% 10%, 70% 25%, 75% 50%, 80% 100%, 20% 100%, 25% 50%, 30% 25%, 35% 10%)',
  ex:
    'polygon(50% 0%, 35% 15%, 25% 35%, 30% 55%, 20% 70%, 25% 100%, 75% 100%, 80% 70%, 70% 55%, 75% 35%, 65% 15%)',
  energyVampire:
    'polygon(45% 0%, 55% 0%, 60% 8%, 65% 20%, 60% 45%, 70% 65%, 75% 100%, 25% 100%, 30% 65%, 40% 45%, 35% 20%, 40% 8%)',
  bully:
    'polygon(50% 0%, 70% 8%, 75% 22%, 72% 42%, 80% 58%, 78% 100%, 22% 100%, 20% 58%, 28% 42%, 25% 22%, 30% 8%)',
  custom:
    'polygon(50% 0%, 68% 10%, 78% 30%, 82% 55%, 75% 75%, 65% 90%, 50% 100%, 35% 90%, 25% 75%, 18% 55%, 22% 30%, 32% 10%)',
};

/** Default fallback silhouette (custom shape) */
export const DEFAULT_CLIP = SILHOUETTE_CLIPS.custom;
