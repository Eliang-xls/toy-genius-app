import React from 'react';
import { TouchableOpacity, AccessibilityProps } from 'react-native';
import { Image as SvgImage } from 'expo-image';
import { AllIconNames, ICON_ASSETS } from './types';

interface IconProps extends AccessibilityProps {
  /** Icon name from the approved icon system */
  name: AllIconNames;
  /** Icon size variants */
  size?: 'sm' | 'md' | 'lg'; // Maps to 24/32/48pt
  /** Custom color (falls back to theme primary if omitted) */
  color?: string;
  /** Press handler with haptic feedback */
  onPress?: () => void;
  /** Optional disabled state */
  disabled?: boolean;
}

const SIZE_MAP = {
  sm: 24,
  md: 32,
  lg: 48,
};

/**
 * Central Icon component for Toy Genius app
 * 
 * Provides consistent rendering of all approved slot and achievement icons
 * with accessibility support and haptic feedback integration.
 * 
 * Usage:
 * ```tsx
 * <Icon name="slot_add" size="md" onPress={handleAdd} />
 * <Icon name="achievement_gold" size="lg" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color,
  onPress,
  disabled = false,
  accessibilityLabel,
}) => {
  const asset = ICON_ASSETS[name];
  const scaledSize = SIZE_MAP[size];
  
  const handlePress = () => {
    if (!onPress || disabled) return;
    
    // Import haptics lazily to avoid circular dependencies
    import('expo-haptics').then(({ ImpactFeedbackStyle, impactAsync }) => {
      impactAsync(ImpactFeedbackStyle.Light);
    }).catch(() => {
      console.warn('Haptics module not available');
    });
    
    onPress();
  };
  
  const containerProps = onPress && !disabled
    ? {
        onPress: handlePress,
        accessible: true,
        accessibilityLabel: accessibilityLabel || `Icon: ${name}`,
      }
    : {
        accessible: true,
        accessibilityLabel: accessibilityLabel || `Icon: ${name}`,
      };
  
  return (
    <TouchableOpacity
      {...containerProps}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      disabled={disabled}
    >
      <SvgImage
        source={asset}
        style={{
          width: scaledSize,
          height: scaledSize,
          tintColor: color,
        }}
      />
    </TouchableOpacity>
  );
};

export default Icon;
