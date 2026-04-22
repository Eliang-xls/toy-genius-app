// SecondaryButton - Outline Style Button
// Design Spec: V0.3 - transparent bg, 1px solid border
// Min height: 48px, Padding: 12px 24px, Radius: 8px

import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import type { SecondaryButtonProps } from './Button.types';

export function SecondaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  accessibilityLabel,
  testID,
}: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      className={`
        flex-row items-center justify-center
        bg-transparent rounded-button
        px-6 py-3
        min-h-[48px] min-w-[120px]
        border border-surface-dark
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'border-gray-300' : 'active:border-accent active:bg-accent/10'}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#5D4037" />
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            className={`
              text-primary text-label font-body
              ${disabled ? 'text-text-muted' : ''}
            `}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default SecondaryButton;
