# Toy Genius 图标库 V0.5
> **日期**: 2026-04-22 | **版本**: 0.5 | **作者**: UX Design Team
> **状态**: 已完成 | **风格**: 扁平化填充设计

---

## 概述
本图标库包含29个SVG图标，分为四大类，使用V2.0颜色Token和扁平化填充设计风格。

## 设计规范
- **风格**: 扁平化填充设计 (无描边或1px极细描边)
- **圆角**: 2-4px 统一圆角
- **颜色**: 使用V2.0颜色Token
  - 主色: #5D4037 (深棕)
  - 强调色: #6B8E23 (橄榄绿)
  - 辅助色: #D2B48C (灰褐)
- **尺寸**: 标准24x24px，可缩放

## 图标分类

### 1. 状态图标 (5个)
用于反馈和状态显示

| 图标 | 文件名 | 描述 | 颜色 |
|------|--------|------|------|
| 成功 | `status/success.svg` | 成功状态，带对勾的圆形 | #6B8E23 (橄榄绿) |
| 警告 | `status/warning.svg` | 警告状态，三角形感叹号 | #CD853F (秘鲁棕) |
| 错误 | `status/error.svg` | 错误状态，带X的圆形 | #CD5C5C (印度红) |
| 信息 | `status/info.svg` | 信息提示，带"i"的圆形 | #5F9EA0 (军服蓝) |
| 加载 | `status/loading.svg` | 加载中，旋转圆环 | #5D4037 (深棕) |

### 2. 内容图标 (5个)
用于内容分类和属性

| 图标 | 文件名 | 描述 | 颜色 |
|------|--------|------|------|
| 玩具 | `content/toy.svg` | 玩具分类，几何盒子 | #D2B48C (灰褐) + #5D4037 |
| 年龄 | `content/age.svg` | 年龄适用，人物轮廓 | #5D4037 (深棕) |
| AI | `content/ai.svg` | AI评分，星形 | #6B8E23 (橄榄绿) |
| 安全 | `content/safety.svg` | 安全维度，盾牌 | #5D4037 (深棕) |
| 价格 | `content/price.svg` | 价格标签，菱形 | #D2B48C (灰褐) + #5D4037 |

### 3. 操作图标 (5个)
用于按钮和用户操作

| 图标 | 文件名 | 描述 | 颜色 |
|------|--------|------|------|
| 添加 | `actions/add.svg` | 添加功能，圆形加号 | #5D4037 (深棕) |
| 删除 | `actions/delete.svg` | 删除功能，圆形减号 | #CD5C5C (印度红) |
| 编辑 | `actions/edit.svg` | 编辑功能，铅笔形状 | #5D4037 (深棕) |
| 分享 | `actions/share.svg` | 分享功能，箭头从盒子 | #5D4037 + #6B8E23 |
| 保存 | `actions/save.svg` | 保存功能，书签形状 | #5D4037 (深棕) |

### 4. 成就图标 (4个)
用于成就和奖励系统

| 图标 | 文件名 | 描述 | 颜色 |
|------|--------|------|------|
| Bronze | `achievements/bronze.svg` | 铜牌成就，数字1 | #CD7F32 (青铜) |
| Silver | `achievements/silver.svg` | 银牌成就，数字2 | #C0C0C0 (银) |
| Gold | `achievements/gold.svg` | 金牌成就，数字3 | #FFD700 (金) |
| Diamond | `achievements/diamond.svg` | 钻石成就，菱形 | #B9E0FF (浅钢蓝) |

## 使用示例

### HTML/CSS
```html
<!-- 直接使用SVG -->
<img src="icons/status/success.svg" width="24" height="24" alt="成功">

<!-- 或者内联SVG -->
<svg width="24" height="24" viewBox="0 0 24 24">
  <!-- SVG代码 -->
</svg>
```

### React Native
```javascript
import SuccessIcon from './icons/status/success.svg';

<SuccessIcon width={24} height={24} />
```

### 颜色自定义
```css
/* 通过CSS变量自定义颜色 */
.icon {
  --icon-color: #5D4037;
  fill: var(--icon-color);
}
```

## 尺寸建议
- **16px**: 紧凑界面，内联文本
- **24px**: 标准导航栏、按钮 (默认)
- **32px**: 功能图标、卡片
- **48px**: 首页特色、Hero区域

## 触控区域
- 最小触控区域: 44x44px
- 推荐触控区域: 48x48px
- 图标居中于触控区域

## 可访问性
- 提供 `aria-label` 描述
- 确保足够的对比度
- 支持键盘导航

---

## 文件结构
```
icons/
├── status/          # 状态图标
│   ├── success.svg
│   ├── warning.svg
│   ├── error.svg
│   ├── info.svg
│   └── loading.svg
├── content/         # 内容图标
│   ├── toy.svg
│   ├── age.svg
│   ├── ai.svg
│   ├── safety.svg
│   └── price.svg
├── actions/         # 操作图标
│   ├── add.svg
│   ├── delete.svg
│   ├── edit.svg
│   ├── share.svg
│   └── save.svg
└── achievements/    # 成就图标
    ├── bronze.svg
    ├── silver.svg
    ├── gold.svg
    └── diamond.svg
```

## 版本历史
- V0.5 (2026-04-22): 新增状态、内容、操作、成就图标，使用扁平化填充风格
- V0.1 (2026-04-22): 初始图标库，包含10个核心导航图标

**总计**: 29个图标 (V0.1的10个 + V0.5的19个新图标)