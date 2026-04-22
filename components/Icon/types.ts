/**
 * Icon System Type Definitions for Toy Genius App
 * 
 * Generated based on approved specification p2_icon_system_specs.md
 */

export type SlotIconName = 
  | 'slot_add'
  | 'slot_remove'
  | 'slot_lock_filled'
  | 'slot_lock_outline';

export type AchievementIconName =
  | 'achievement_gold'
  | 'achievement_silver'
  | 'achievement_bronze';

export type AllIconNames = SlotIconName | AchievementIconName;

// Asset import map for runtime resolution
export const ICON_ASSETS: Record<AllIconNames, string> = {
  // Slot icons
  slot_add: require('./slots/slot_add.svg'),
  slot_remove: require('./slots/slot_remove.svg'),
  slot_lock_filled: require('./slots/slot_lock_filled.svg'),
  slot_lock_outline: require('./slots/slot_lock_outline.svg'),
  
  // Achievement icons
  achievement_gold: require('./achievements/achievement_gold.svg'),
  achievement_silver: require('./achievements/achievement_silver.svg'),
  achievement_bronze: require('./achievements/achievement_bronze.svg'),
};

// Export icon paths for documentation
export const ICON_PATHS = {
  slots: {
    slot_add: '/assets/icons/svgs/slots/slot_add.svg',
    slot_remove: '/assets/icons/svgs/slots/slot_remove.svg',
    slot_lock_filled: '/assets/icons/svgs/slots/slot_lock_filled.svg',
    slot_lock_outline: '/assets/icons/svgs/slots/slot_lock_outline.svg',
  },
  achievements: {
    achievement_gold: '/assets/icons/svgs/achievements/achievement_gold.svg',
    achievement_silver: '/assets/icons/svgs/achievements/achievement_silver.svg',
    achievement_bronze: '/assets/icons/svgs/achievements/achievement_bronze.svg',
  },
};
