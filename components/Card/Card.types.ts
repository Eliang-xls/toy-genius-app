// V0.3 Card Component Types
// Design Spec: V0.3_ui_components_spec.md
// Version: 0.3 | Style: Flat Filled Design

import type { ReactNode } from 'react';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import type { AgeGroup } from '../Badge/Badge.types';

// ========== ProductCard Types ==========
export interface ProductCardContent {
  /** Unique product identifier */
  id: string;
  /** Product display name */
  name: string;
  /** Product description (optional) */
  description?: string;
  /** Product price (optional) */
  price?: string | number;
  /** Currency symbol (default: $) */
  currency?: string;
  /** AI score (0-10) */
  score?: number;
  /** Age group for badge */
  ageGroup?: AgeGroup;
  /** Image URL */
  imageUrl?: string;
  /** Product category (optional) */
  category?: string;
}

export interface ProductCardProps {
  /** Product data */
  product: ProductCardContent;
  /** Press handler */
  onPress?: (product: ProductCardContent) => void;
  /** Favorite state */
  isFavorited?: boolean;
  /** Toggle favorite handler */
  onFavoriteToggle?: (productId: string) => void;
  /** Show add-to-slot button */
  showAddToSlot?: boolean;
  /** Add to slot handler */
  onAddToSlot?: (productId: string) => void;
  /** Show status badge */
  status?: {
    label: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  };
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

// ========== ContentCard Types ==========
export interface ContentCardProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Main content text */
  content?: string;
  /** Optional header icon */
  icon?: ReactNode;
  /** Optional footer action button */
  action?: {
    label: string;
    onPress: (event: GestureResponderEvent) => void;
  };
  /** Optional timestamp */
  timestamp?: string;
  /** Press handler for the entire card */
  onPress?: (event: GestureResponderEvent) => void;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}
