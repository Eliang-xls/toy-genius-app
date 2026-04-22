# Icon 组件

统一的图标加载组件，支持从 `assets/icons` 目录加载 SVG 图标。

## 特性

- 支持 19 个预定义图标
- 支持 16px、24px、32px 三种尺寸
- 支持自定义颜色
- 基于 `react-native-svg` 渲染
- 支持无障碍访问

## 安装

确保项目已安装 `react-native-svg`：

```bash
npm install react-native-svg
# 或
yarn add react-native-svg
```

## 使用方法

### 基础用法

```tsx
import { Icon } from '@/components/Icon';

<Icon name="actions/add" />
```

### 指定尺寸

```tsx
<Icon name="content/toy" size={16} />
<Icon name="content/toy" size={24} />  // 默认
<Icon name="content/toy" size={32} />
```

### 指定颜色

```tsx
<Icon name="status/success" color="#6B8E23" />
<Icon name="status/error" color="#CD5C5C" />
<Icon name="content/ai" color="#5D4037" />
```

### 组合使用

```tsx
<Icon 
  name="achievements/gold" 
  size={32} 
  color="#FFD700"
  accessibilityLabel="金牌成就"
/>
```

## 可用图标

### 成就图标
- `achievements/bronze` - 铜牌
- `achievements/diamond` - 钻石
- `achievements/gold` - 金牌
- `achievements/silver` - 银牌

### 操作图标
- `actions/add` - 添加
- `actions/delete` - 删除
- `actions/edit` - 编辑
- `actions/save` - 保存
- `actions/share` - 分享

### 内容图标
- `content/age` - 年龄
- `content/ai` - AI
- `content/price` - 价格
- `content/safety` - 安全
- `content/toy` - 玩具

### 状态图标
- `status/error` - 错误
- `status/info` - 信息
- `status/loading` - 加载中
- `status/success` - 成功
- `status/warning` - 警告

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `name` | `IconName` | - | 图标名称，必填 |
| `size` | `IconSize` | `24` | 图标尺寸，支持 16、24、32 |
| `color` | `IconColor` | `'#5D4037'` | 图标颜色 |
| `filled` | `boolean` | `false` | 是否填充图标 |
| `style` | `StyleProp<ViewStyle>` | - | 自定义样式 |
| `accessibilityLabel` | `string` | - | 无障碍标签 |
| `testID` | `string` | - | 测试ID |

## 类型定义

### IconName
```typescript
type IconName = 
  | 'achievements/bronze'
  | 'achievements/diamond'
  | 'achievements/gold'
  | 'achievements/silver'
  | 'actions/add'
  | 'actions/delete'
  | 'actions/edit'
  | 'actions/save'
  | 'actions/share'
  | 'content/age'
  | 'content/ai'
  | 'content/price'
  | 'content/safety'
  | 'content/toy'
  | 'status/error'
  | 'status/info'
  | 'status/loading'
  | 'status/success'
  | 'status/warning';
```

### IconSize
```typescript
type IconSize = 16 | 24 | 32;
```

### IconColor
```typescript
type IconColor = ColorValue | string;
```

## 注意事项

1. 图标基于 `assets/icons` 目录中的 SVG 文件
2. 所有图标均为 24x24 基础尺寸，支持缩放
3. 默认颜色为深棕色 `#5D4037`，符合设计规范
4. 如需添加新图标，请在 `assets/icons` 目录中添加 SVG 文件，并更新 `Icon.types.ts` 和 `Icon.tsx` 中的映射表

## 设计规范

图标遵循 [icon_library_spec.md](../docs/sprints/v1.0-alpha/designs/icon_library_spec.md) 设计规范：

- **扁平化填充风格**: 无描边或1px极细描边
- **圆角**: 2-4px 统一圆角
- **颜色**: 单色填充，支持主题色
- **识别度**: 在小尺寸（16px）下保持高识别度