// V0.3 Icon Component
// Design Spec: icon_library_spec.md
// Version: 0.3 | Style: Flat Filled Design

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { IconProps, IconName, IconSize, IconColor } from './Icon.types';

// 图标映射表 - 暂时只包含部分图标，后续需要生成完整映射
const iconMap: Record<IconName, string> = {
  // 成就图标
  'achievements/bronze': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#CD7F32"/><path d="M12 6L14.5 10.5L19 11L15.5 14.5L16.5 19L12 16.5L7.5 19L8.5 14.5L5 11L9.5 10.5L12 6Z" fill="#FFFFFF"/></svg>',
  'achievements/diamond': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 9L12 22L22 9L12 2Z" fill="#B9F2FF"/><path d="M12 2L2 9H22L12 2Z" fill="#E0FFFF"/><path d="M12 2L7 9L12 22L17 9L12 2Z" fill="#FFFFFF"/></svg>',
  'achievements/gold': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#FFD700"/><path d="M12 6L14.5 10.5L19 11L15.5 14.5L16.5 19L12 16.5L7.5 19L8.5 14.5L5 11L9.5 10.5L12 6Z" fill="#FFFFFF"/></svg>',
  'achievements/silver': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#C0C0C0"/><path d="M12 6L14.5 10.5L19 11L15.5 14.5L16.5 19L12 16.5L7.5 19L8.5 14.5L5 11L9.5 10.5L12 6Z" fill="#FFFFFF"/></svg>',
  
  // 操作图标
  'actions/add': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#5D4037"/><rect x="11" y="7" width="2" height="10" rx="1" fill="#FFFFFF"/><rect x="7" y="11" width="10" height="2" rx="1" fill="#FFFFFF"/></svg>',
  'actions/delete': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#CD5C5C"/><rect x="7" y="11" width="10" height="2" rx="1" fill="#FFFFFF"/></svg>',
  'actions/edit': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 3.5L20.5 7.5L7 21H3V17L16.5 3.5Z" fill="#5D4037"/><path d="M14 6L18 10" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/></svg>',
  'actions/save': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" fill="#5D4037"/><path d="M12 18L12 10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><path d="M9 13H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>',
  'actions/share': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="12" width="12" height="10" rx="2" fill="#5D4037"/><path d="M8 7L12 3L16 7" stroke="#5D4037" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3V14" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="6" r="3" fill="#6B8E23"/><circle cx="18" cy="18" r="3" fill="#6B8E23"/></svg>',
  'actions/heart': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#5D4037"/></svg>',
  'actions/heart-outline': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#5D4037" stroke-width="2" fill="none"/></svg>',
  
  // 内容图标
  'content/age': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="10" r="4" fill="#5D4037"/><path d="M8 16C8 16 9 18 12 18C15 18 16 16 16 16" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/><path d="M12 18V22" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/><path d="M9 22H15" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/></svg>',
  'content/ai': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.5 8L21 9L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9L9.5 8L12 2Z" fill="#6B8E23"/><circle cx="12" cy="12" r="3" fill="#FFFFFF"/></svg>',
  'content/price': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12L12 2L22 12L12 22L2 12Z" fill="#D2B48C"/><circle cx="12" cy="12" r="4" fill="#5D4037"/><path d="M12 10V14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><path d="M10 12H14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>',
  'content/safety': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 6V12C3 17.5 7 21.5 12 22.5C17 21.5 21 17.5 21 12V6L12 2Z" fill="#5D4037"/><path d="M10 12L11.5 13.5L15 10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'content/toy': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" fill="#D2B48C"/><path d="M12 2L12 22" stroke="#5D4037" stroke-width="1"/><path d="M3 7L21 7" stroke="#5D4037" stroke-width="1"/><path d="M12 2L21 7L12 12L3 7L12 2Z" fill="#5D4037"/></svg>',
  
  // 状态图标
  'status/error': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#CD5C5C"/><path d="M8 8L16 16" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><path d="M16 8L8 16" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>',
  'status/info': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#5F9EA0"/><rect x="11" y="10" width="2" height="2" rx="1" fill="#FFFFFF"/><rect x="11" y="14" width="2" height="4" rx="1" fill="#FFFFFF"/></svg>',
  'status/loading': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round"/><path d="M12 2A10 10 0 0 1 22 12" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/></svg>',
  'status/success': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#6B8E23"/><path d="M8 12.5L10.5 15L16 9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'status/warning': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 20H22L12 2Z" fill="#CD853F"/><rect x="11" y="8" width="2" height="6" rx="1" fill="#FFFFFF"/><circle cx="12" cy="17" r="1" fill="#FFFFFF"/></svg>',
};

// 默认图标颜色
const DEFAULT_ICON_COLOR = '#5D4037';

// 图标尺寸映射
const iconSizeMap: Record<IconSize, number> = {
  16: 16,
  24: 24,
  32: 32,
};

/**
 * Icon 组件 - 统一图标加载组件
 * 支持从 assets/icons 目录加载 SVG 图标
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = DEFAULT_ICON_COLOR,
  filled = false,
  style,
  accessibilityLabel,
  testID,
}) => {
  // 获取SVG字符串
  const svgString = iconMap[name];
  
  if (!svgString) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }
  
  // 调整SVG颜色
  let finalSvgString = svgString;
  
  // 如果指定了颜色，替换SVG中的填充色
  if (color && color !== DEFAULT_ICON_COLOR) {
    const colorString = String(color);
    // 替换所有fill属性中的颜色
    finalSvgString = svgString.replace(/fill="[^"]*"/g, `fill="${colorString}"`);
    // 替换所有stroke属性中的颜色
    finalSvgString = finalSvgString.replace(/stroke="[^"]*"/g, `stroke="${colorString}"`);
  }
  
  // 如果filled为false，需要移除填充（仅保留描边）
  // 注意：这个逻辑可能需要根据图标类型调整，暂时先不实现
  
  // 调整SVG尺寸
  const sizeValue = iconSizeMap[size];
  finalSvgString = finalSvgString
    .replace(/width="[^"]*"/, `width="${sizeValue}"`)
    .replace(/height="[^"]*"/, `height="${sizeValue}"`);
  
  return (
    <SvgXml
      xml={finalSvgString}
      width={sizeValue}
      height={sizeValue}
      accessibilityLabel={accessibilityLabel || name}
      testID={testID}
      style={style}
    />
  );
};

export default Icon;