import * as HapticsModule from 'expo-haptics';

/**
 * Haptic feedback patterns for Toy Genius
 * Provides consistent tactile feedback across the app
 */

export const Haptics = {
  /** Light tap - button press, UI interactions */
  light: () => {
    HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Light);
  },

  /** Medium tap - card selection, primary actions */
  medium: () => {
    HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Medium);
  },

  /** Heavy tap - long press, important confirmations */
  heavy: () => {
    HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Heavy);
  },

  /** Selection change - scrolling through options */
  selection: () => {
    HapticsModule.selectionAsync();
  },

  /** Success notification - favorite added, action completed */
  success: () => {
    HapticsModule.notificationAsync(HapticsModule.NotificationFeedbackType.Success);
  },

  /** Warning notification - validation error */
  warning: () => {
    HapticsModule.notificationAsync(HapticsModule.NotificationFeedbackType.Warning);
  },

  /** Error notification - action failed */
  error: () => {
    HapticsModule.notificationAsync(HapticsModule.NotificationFeedbackType.Error);
  },
};

export default Haptics;
