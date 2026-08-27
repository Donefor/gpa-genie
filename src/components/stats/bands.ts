import { StatGrade } from '@/data/gradeStats';

/**
 * Stack order: best grade first, so the strongest band is anchored at the
 * baseline and comparable across rows at a glance.
 */
export const BAND_ORDER: StatGrade[] = ['Excellent', 'Very Good', 'Good', 'Pass'];

export const BAND_COLOR: Record<StatGrade, string> = {
  Excellent: 'var(--band-excellent)',
  'Very Good': 'var(--band-verygood)',
  Good: 'var(--band-good)',
  Pass: 'var(--band-pass)',
};
