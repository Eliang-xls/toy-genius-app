// PrimaryButton - Main CTA Button
// Design Spec: V0.3 - accent.DEFAULT (#6B8E23) background
// Min height: 48px, Padding: 12px 24px, Radius: 8px

import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import type { PrimaryButtonProps } from './Button.types';

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  accessibilityLabel,
  testID,
}: PrimaryButtonProps) {
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
        bg-accent rounded-button
        px-6 py-3
        min-h-[48px] min-w-[120px]
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'bg-surface-dark' : 'active:bg-accent-dark'}
      `}
      style={[
        {
          shadowColor: '#3E2723',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            className={`
              text-white text-label font-body
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

export default PrimaryButton;
