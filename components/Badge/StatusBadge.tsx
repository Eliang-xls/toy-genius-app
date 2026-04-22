// StatusBadge - Status Indicator Badge
// Design Spec: V0.3 - Rectangular badge with status color
// Variants: success, warning, danger, info, neutral

import React from 'react';
import { View, Text } from 'react-native';
import type { StatusBadgeProps, StatusVariant } from './Badge.types';

// Status color mapping (from tailwind.config.js semantic colors)
const STATUS_COLORS: Record<StatusVariant, { bg: string; text: string }> = {
  success: {
    bg: 'bg-success',       // #6B8E23 - Olive green
    text: 'text-white',
  },
  warning: {
    bg: 'bg-warning',       // #CD853F - Peru
    text: 'text-white',
  },
  danger: {
    bg: 'bg-danger',        // #CD5C5C - Indian red
    text: 'text-white',
  },
  info: {
    bg: 'bg-info',          // #5F9EA0 - Cadet blue
    text: 'text-white',
  },
  neutral: {
    bg: 'bg-surface-dark',  // #D1D5DB - Gray
    text: 'text-primary',
  },
};

// Size variants
const SIZE_STYLES = {
  sm: {
    container: 'px-1.5 py-0.5',
    text: 'text-caption',
    height: 20,
    iconSize: 12,
  },
  md: {
    container: 'px-2 py-1',
    text: 'text-label',
    height: 24,
    iconSize: 16,
  },
};

export function StatusBadge({
  label,
  variant,
  icon,
  size = 'md',
  style,
}: StatusBadgeProps) {
  const colors = STATUS_COLORS[variant];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <View
      className={`
        flex-row items-center justify-center
        rounded-sm
        ${colors.bg}
        ${sizeStyle.container}
      `}
      style={[
        {
          height: sizeStyle.height,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {icon && (
        <View className="mr-1" style={{ width: sizeStyle.iconSize, height: sizeStyle.iconSize }}>
          {icon}
        </View>
      )}
      <Text className={`${colors.text} font-label font-medium ${sizeStyle.text}`}>
        {label}
      </Text>
    </View>
  );
}

// Convenience status badge factory functions
export const SuccessBadge = (props: Omit<StatusBadgeProps, 'variant'>) => (
  <StatusBadge {...props} variant="success" />
);

export const WarningBadge = (props: Omit<StatusBadgeProps, 'variant'>) => (
  <StatusBadge {...props} variant="warning" />
);

export const DangerBadge = (props: Omit<StatusBadgeProps, 'variant'>) => (
  <StatusBadge {...props} variant="danger" />
);

export const InfoBadge = (props: Omit<StatusBadgeProps, 'variant'>) => (
  <StatusBadge {...props} variant="info" />
);

export const NeutralBadge = (props: Omit<StatusBadgeProps, 'variant'>) => (
  <StatusBadge {...props} variant="neutral" />
);

export default StatusBadge;
