/**
 * Toy Genius - Unified Icon Component
 * 
 * Centralized icon system using V2.0 color tokens (#5D4037, #6B8E23, #D2B48C)
 * Provides consistent icon rendering across the app
 */

import React from 'react';
import { View, TouchableOpacity, type ViewStyle } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from 'react-native-svg';

// Icon file mapping
const ICON_PATHS: Record<string, string> = {
  // Core Navigation Icons
  'search': '/assets/icons/core/search.svg',
  'filter': '/assets/icons/core/filter.svg',
  'heart-outline': '/assets/icons/core/heart-outline.svg',
  'heart-filled': '/assets/icons/core/heart-filled.svg',
  'home': '/assets/icons/core/home.svg',
  'back': '/assets/icons/core/back.svg',
  'menu': '/assets/icons/core/menu.svg',
  'close': '/assets/icons/core/close.svg',
  'add': '/assets/icons/core/add.svg',
  'star-outline': '/assets/icons/core/star-outline.svg',
  'star-filled': '/assets/icons/core/star-filled.svg',
  'share': '/assets/icons/core/share.svg',
  'bookmark': '/assets/icons/core/bookmark.svg',
  
  // Status Icons
  'success': '/assets/icons/status/success.svg',
  'warning': '/assets/icons/status/warning.svg',
  'error': '/assets/icons/status/error.svg',
  'info': '/assets/icons/status/info.svg',
  'loading': '/assets/icons/status/loading.svg',
  
  // Content Icons
  'toy': '/assets/icons/content/toy.svg',
  'age': '/assets/icons/content/age.svg',
  'ai': '/assets/icons/content/ai.svg',
  'safety': '/assets/icons/content/safety.svg',
  'price': '/assets/icons/content/price.svg',
  
  // Action Icons
  'delete': '/assets/icons/action/delete.svg',
  'edit': '/assets/icons/action/edit.svg',
  'save': '/assets/icons/action/save.svg',
  
  // Achievement Icons
  'bronze': '/assets/icons/achievement/bronze.svg',
  'silver': '/assets/icons/achievement/silver.svg',
  'gold': '/assets/icons/achievement/gold.svg',
  'diamond': '/assets/icons/achievement/diamond.svg',
};

export type IconName = keyof typeof ICON_PATHS;

export interface IconProps extends Omit<React.SVGProps<any>, 'src'> {
  name: IconName;
  size?: number;
  color?: string;
  onPress?: () => void;
  accessible?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#5D4037',
  onPress,
  accessible = true,
  accessibilityLabel,
  style,
  ...props
}) => {
  const IconComponent = require(`../assets/icons/${ICON_PATHS[name]}`).default;
  
  const content = (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <IconComponent
        width={size}
        height={size}
        fill={color}
        stroke={color}
        {...props}
      />
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel || name}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};
