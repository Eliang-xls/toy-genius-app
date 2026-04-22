// AgeBadge - Age Group Classification Badge
// Design Spec: V0.3 - Color-coded pill badge by age group
// Colors: infant (purple), toddler (pink), preschool (green), early school (blue), school age (gold)

import React from 'react';
import { View, Text } from 'react-native';
import type { AgeBadgeProps, AgeGroup } from './Badge.types';

// Age group color mapping (from tailwind.config.js)
const AGE_COLORS: Record<AgeGroup, string> = {
  '0-1': 'bg-age-0-1',    // #9370DB - Medium purple (infant)
  '1-3': 'bg-age-1-3',    // #DB7093 - Pale violet red (toddler)
  '3-5': 'bg-age-3-5',    // #3CB371 - Medium sea green (preschool)
  '5-8': 'bg-age-5-8',    // #6495ED - Cornflower blue (early school)
  '8+': 'bg-age-8+',      // #DAA520 - Goldenrod (school age)
};

// Default labels for age groups
const AGE_LABELS: Record<AgeGroup, string> = {
  '0-1': '0-1yr',
  '1-3': '1-3yr',
  '3-5': '3-5yr',
  '5-8': '5-8yr',
  '8+': '8+yr',
};

// Size variants
const SIZE_STYLES = {
  sm: {
    container: 'px-1.5 py-0.5',
    text: 'text-caption',
    minWidth: 32,
    height: 18,
  },
  md: {
    container: 'px-2 py-1',
    text: 'text-label',
    minWidth: 40,
    height: 24,
  },
};

export function AgeBadge({
  ageGroup,
  label,
  size = 'md',
  style,
}: AgeBadgeProps) {
  const bgColor = AGE_COLORS[ageGroup];
  const displayLabel = label || AGE_LABELS[ageGroup];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <View
      className={`
        items-center justify-center
        rounded-full
        ${bgColor}
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
      <Text className={`text-white font-label font-medium ${sizeStyle.text}`}>
        {displayLabel}
      </Text>
    </View>
  );
}

export default AgeBadge;
