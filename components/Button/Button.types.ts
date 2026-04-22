// V0.3 Button Component Types
// Design Spec: V0.3_ui_components_spec.md
// Version: 0.3 | Style: Flat Filled Design

import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

export interface BaseButtonProps {
  /** Button label text */
  title: string;
  /** Press handler */
  onPress?: (event: GestureResponderEvent) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state - shows activity indicator */
  loading?: boolean;
  /** Optional icon component (left of text) */
  icon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Additional style overrides */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}

export interface PrimaryButtonProps extends BaseButtonProps {}

export interface SecondaryButtonProps extends BaseButtonProps {}

export interface TextButtonProps extends BaseButtonProps {
  /** Show underline on text */
  underline?: boolean;
}
