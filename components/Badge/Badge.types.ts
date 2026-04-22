// V0.3 Badge Component Types
// Design Spec: V0.3_ui_components_spec.md
// Version: 0.3 | Style: Flat Filled Design

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ========== ScoreBadge Types ==========
export type ScoreLevel = 'high' | 'medium' | 'low';

export interface ScoreBadgeProps {
  /** AI or user score value (0-10) */
  score: number;
  /** Maximum score value (default: 10) */
  maxScore?: number;
  /** Show "AI" prefix label */
  showLabel?: boolean;
  /** Custom size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional style overrides */
  style?: StyleProp<ViewStyle>;
}

// ========== AgeBadge Types ==========
export type AgeGroup = '0-1' | '1-3' | '3-5' | '5-8' | '8+';

export interface AgeBadgeProps {
  /** Age group identifier */
  ageGroup: AgeGroup;
  /** Custom label override */
  label?: string;
  /** Custom size variant */
  size?: 'sm' | 'md';
  /** Additional style overrides */
  style?: StyleProp<ViewStyle>;
}

// ========== StatusBadge Types ==========
export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
  /** Status text content */
  label: string;
  /** Status type variant */
  variant: StatusVariant;
  /** Optional icon component */
  icon?: ReactNode;
  /** Custom size variant */
  size?: 'sm' | 'md';
  /** Additional style overrides */
  style?: StyleProp<ViewStyle>;
}
