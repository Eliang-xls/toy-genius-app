// ScoreBadge - AI Score Display Badge
// Design Spec: V0.3 - Pill shape with score-colored background
// High (8-10): accent | Medium (5-7.9): warning | Low (0-4.9): danger

import React from 'react';
import { View, Text } from 'react-native';
import type { ScoreBadgeProps, ScoreLevel } from './Badge.types';

// Score level thresholds
function getScoreLevel(score: number, maxScore: number): ScoreLevel {
  const normalized = (score / maxScore) * 10;
  if (normalized >= 8) return 'high';
  if (normalized >= 5) return 'medium';
  return 'low';
}

// Color mapping for score levels
const SCORE_COLORS: Record<ScoreLevel, { bg: string; border: string; text: string; hex: string }> = {
  high: {
    bg: 'bg-success/10',
    border: 'border-success',
    text: 'text-success',
    hex: '#6B8E23',
  },
  medium: {
    bg: 'bg-warning/10',
    border: 'border-warning',
    text: 'text-warning',
    hex: '#CD853F',
  },
  low: {
    bg: 'bg-danger/10',
    border: 'border-danger',
    text: 'text-danger',
    hex: '#CD5C5C',
  },
};

// Size variants
const SIZE_STYLES = {
  sm: {
    container: 'px-2 py-0.5',
    text: 'text-caption',
    minWidth: 40,
    height: 20,
  },
  md: {
    container: 'px-2 py-1',
    text: 'text-label',
    minWidth: 48,
    height: 24,
  },
  lg: {
    container: 'px-3 py-1.5',
    text: 'text-label',
    minWidth: 56,
    height: 28,
  },
};

export function ScoreBadge({
  score,
  maxScore = 10,
  showLabel = true,
  size = 'md',
  style,
}: ScoreBadgeProps) {
  const level = getScoreLevel(score, maxScore);
  const colors = SCORE_COLORS[level];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <View
      className={`
        flex-row items-center justify-center
        rounded-full
        border
        ${colors.bg}
        ${colors.border}
        ${sizeStyle.container}
      `}
      style={[
        {
          minWidth: sizeStyle.minWidth,
          height: sizeStyle.height,
        },
        style,
      ]}
    >
      {showLabel && (
        <Text className={`text-text-muted font-label mr-0.5 ${sizeStyle.text}`}>
          AI
        </Text>
      )}
      <Text className={`${colors.text} font-label font-medium ${sizeStyle.text}`}>
        {score.toFixed(1)}
      </Text>
    </View>
  );
}

export default ScoreBadge;
