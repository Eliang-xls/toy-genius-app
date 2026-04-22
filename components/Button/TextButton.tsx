// TextButton - Minimal Text-Only Button
// Design Spec: V0.3 - no background, accent color text
// Min height: 44px, Padding: 8px 16px, Radius: 4px

import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import type { TextButtonProps } from './Button.types';

export function TextButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  underline = false,
  fullWidth = false,
  style,
  accessibilityLabel,
  testID,
}: TextButtonProps) {
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
        bg-transparent
        px-4 py-2
        min-h-[44px]
        rounded-sm
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? '' : 'active:bg-accent/10'}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#6B8E23" />
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-1.5">{icon}</View>}
          <Text
            className={`
              text-accent text-label font-body
              ${underline ? 'underline' : ''}
              ${disabled ? 'text-text-muted no-underline' : 'active:text-accent-dark'}
            `}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default TextButton;
