// V0.3 Icon Component Types
// Design Spec: icon_library_spec.md
// Version: 0.3 | Style: Flat Filled Design

import type { StyleProp, ViewStyle, ColorValue } from 'react-native';

// ========== Icon Name Types ==========
// 图标名称类型，基于 assets/icons 目录结构
export type IconName = 
  // 成就图标
  | 'achievements/bronze'
  | 'achievements/diamond'
  | 'achievements/gold'
  | 'achievements/silver'
  // 操作图标
  | 'actions/add'
  | 'actions/delete'
  | 'actions/edit'
  | 'actions/save'
  | 'actions/share'
  | 'actions/heart'
  | 'actions/heart-outline'
  // 内容图标
  | 'content/age'
  | 'content/ai'
  | 'content/price'
  | 'content/safety'
  | 'content/toy'
  // 状态图标
  | 'status/error'
  | 'status/info'
  | 'status/loading'
  | 'status/success'
  | 'status/warning';

// ========== Icon Size Types ==========
export type IconSize = 16 | 24 | 32;

// ========== Icon Color Types ==========
export type IconColor = ColorValue | string;

// ========== Icon Component Props ==========
export interface IconProps {
  /** 图标名称，对应 assets/icons 目录下的文件名 */
  name: IconName;
  /** 图标尺寸，支持 16px, 24px, 32px */
  size?: IconSize;
  /** 图标颜色，默认使用主题深棕色 #5D4037 */
  color?: IconColor;
  /** 是否填充图标（用于填充/描边切换） */
  filled?: boolean;
  /** 自定义样式 */
  style?: StyleProp<ViewStyle>;
  /** 无障碍标签 */
  accessibilityLabel?: string;
  /** 测试ID */
  testID?: string;
}

// ========== Icon Map Type ==========
// 图标路径映射表类型
export type IconMapType = Record<IconName, any>;