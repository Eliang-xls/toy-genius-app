# Dogfood QA Report — Toy Genius App V1.0-alpha
> QA Engineer: PM (AI) | Date: 2026-04-22
> Scope: Code-level review + Data schema validation

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Issues | 8 |
| Critical | 2 |
| High | 2 |
| Medium | 3 |
| Low | 1 |
| Screens Reviewed | 7 |
| Data Sources Validated | 3 |

**Overall Assessment**: App 有 2 个严重问题会导致崩溃/功能失效，需要立即修复。其余为体验优化项。

---

## Issue #1: Detail Screen 8D 评分为 0 [CRITICAL] ✅ FIXED

**Category**: Functional | **Severity**: Critical
**Location**: `app/detail/[id].tsx` + `lib/api.ts`
**Status**: FIXED — 2026-04-22

**Resolution**: 
- DA: 修改 `v_product_detail` 视图, LEFT JOIN `mv_product_browse` 获取 8D 分数
- FE: 更新 `Product` 接口, 新增 image_url, ai_description, safety 等字段
- 验证: 10,597/10,597 行数据 100% 覆盖, 查询性能 0.374ms (预估 0.3-0.5ms)
- 执行计划: 全部 Index Scan, mv 查找仅 0.010ms

**Description**:
Detail 页面从 `v_product_detail` 视图获取数据，但该视图**不包含**以下字段:
- `base_score` — 评分会显示 "NaN/100"
- `d_safety`, `d_education`, `d_sensory`, `d_motor`, `d_language`, `d_creativity`, `d_science`, `d_emotions` — 8D 分数条全部为 0

**Root Cause**:
- `mv_product_browse` 包含 8D 分数但**不含** `image_url`
- `v_product_detail` 包含 `image_url` 但**不含** 8D 分数

**Steps to Reproduce**:
1. 在 Browse 页点击任意产品卡片
2. 观察 Detail 页面的 "AI Score Breakdown" 区域 — 所有分数显示 0.0
3. 观察顶部评分徽章 — 显示 "⭐ NaN/100"

**Fix Options**:
- Option A: 修改 `v_product_detail` 视图, JOIN `mv_product_browse` 获取 8D 分数
- Option B: Detail 页面先查 `mv_product_browse` 获取分数, 再查 `v_product_detail` 获取 image_url + ai_description
- **推荐 Option A** (数据层修复, 更干净)

---

## Issue #2: Milestones 页面加载 117K 行数据 [CRITICAL]

**Category**: Functional / Performance | **Severity**: Critical
**Location**: `app/(tabs)/milestones.tsx`

**Description**:
Milestones 页面从 `v_milestone_toys` 查询**全部 117,635 行**到客户端进行聚合:
```typescript
const { data } = await supabase
  .from('v_milestone_toys')
  .select('milestone_id, milestone_name, tier, description, free_reachable, product_id')
  .order('tier', { ascending: true });
// 然后在 JS 中循环聚合 toy_count
```

**Impact**:
- 每次打开 Milestones tab 都下载 ~117K 行 (几 MB 数据)
- 在慢网络下会超时或 OOM
- 前端 Map 聚合循环处理 117K 行会阻塞 UI 线程

**Fix Options**:
- Option A: 在 Supabase 中创建 `v_milestone_summary` 视图 (SQL 端预聚合)
- Option B: 使用 Supabase RPC 函数返回聚合结果
- **推荐 Option A**

---

## Issue #3: Discover 页面无错误反馈 [HIGH]

**Category**: UX | **Severity**: High
**Location**: `app/(tabs)/discover.tsx`

**Description**:
`loadDailyPicks()` 的 catch 块只 `console.error` 但不设置错误状态:
```typescript
} catch (err) {
  console.error('Load daily picks error:', err);
  // 缺少: setError(...)
}
```

**Impact**: 如果 Supabase 请求失败，用户看到空白页 (loading 结束但无产品, 也无错误提示)

**Fix**: 添加 error state + 错误 UI, 类似 browse.tsx 的处理方式

---

## Issue #4: Discover 页面无手势滑动支持 [HIGH]

**Category**: UX | **Severity**: High
**Location**: `app/(tabs)/discover.tsx`

**Description**:
"每日发现" 的核心交互是左右滑动 (Tinder 式)，但当前只实现了**按钮点击**。卡片动画使用 `Animated.Value`，但没有 `PanResponder` 或 `GestureHandler` 来捕获手势。

**Impact**: 用户无法通过手指滑动卡片, 只能点击 Like/Pass 按钮, 体验打折

**Fix**: 添加 `react-native-gesture-handler` 的 `PanGestureHandler` 或 `GestureDetector` 实现真正的滑动手势

---

## Issue #5: API 层未导出 supabase client [MEDIUM]

**Category**: Functional | **Severity**: Medium
**Location**: `lib/api.ts`

**Description**:
`discover.tsx` 导入 `import { supabase } from '../../lib/api'`，但 `api.ts` 中 `supabase` 是**未导出的内部变量** (第 8 行: `export const supabase = ...`)

实际上 supabase IS exported — 这行没问题。但 milestones.tsx 直接导入 supabase 而不是使用封装的 API 函数，这导致数据获取逻辑分散。

**Fix**: 为 Milestones 创建封装的 `fetchMilestones()` 函数，与 Browse/Detail 保持一致

---

## Issue #6: Detail Screen 无 Safe Area 处理 [MEDIUM]

**Category**: Visual | **Severity**: Medium
**Location**: `app/detail/[id].tsx`

**Description**:
Detail 页面使用 `Pressable` + `router.back()` 作为返回按钮，但没有用 `SafeAreaView` 包裹。在有刘海/Dynamic Island 的设备上，顶部导航栏会被遮挡。

**Fix**: 用 `react-native-safe-area-context` 的 `SafeAreaView` 替换顶部 `View`, 或添加 paddingTop

---

## Issue #7: Product 缺少 image_url 支持 [MEDIUM]

**Category**: Visual | **Severity**: Medium
**Location**: `components/ProductCard.tsx` + `app/detail/[id].tsx`

**Description**:
`v_product_detail` 视图有 `image_url` 字段，但 ProductCard 和 Detail 页面都使用 🧸 emoji 作为占位图。Product 接口中也缺少 `image_url` 字段定义。

**Impact**: 所有产品显示相同的 teddy bear 图标，无法区分

**Fix**:
1. 在 `Product` 接口添加 `image_url: string | null`
2. ProductCard 和 Detail 使用 `<Image source={{ uri: product.image_url }} />`
3. 添加 fallback 占位图

---

## Issue #8: Profile/Slot 仅为占位页面 [LOW]

**Category**: Content | **Severity**: Low
**Location**: `app/(tabs)/profile.tsx`, `app/(tabs)/slot.tsx`

**Description**: 两个页面只显示标题文字，无任何功能。V1 范围不包含这些页面。

**Fix**: 可以在页面中添加 "Coming in V2" 的提示文案，管理用户预期。

---

## Summary Table

| # | Issue | Severity | Category | Fix Effort |
|---|-------|----------|----------|------------|
| 1 | Detail 8D 分数为 0 / NaN | Critical | Functional | DA (修改视图) |
| 2 | Milestones 加载 117K 行 | Critical | Performance | DA (创建聚合视图) |
| 3 | Discover 无错误反馈 | High | UX | FE (10 min) |
| 4 | Discover 无手势滑动 | High | UX | FE (1-2 hr) |
| 5 | API 层封装不一致 | Medium | Functional | FE (15 min) |
| 6 | Detail 无 Safe Area | Medium | Visual | FE (5 min) |
| 7 | 缺少真实产品图片 | Medium | Visual | FE (30 min) |
| 8 | Profile/Slot 占位页 | Low | Content | FE (5 min) |

---

## Recommended Fix Order

1. **DA 先修复 Issue #1** — 修改 v_product_detail 视图, 使其包含 8D 分数
2. **DA 修复 Issue #2** — 创建 v_milestone_summary 聚合视图
3. **FE 修复 Issue #3 + #6** — Discover 错误处理 + Detail Safe Area (快速)
4. **FE 修复 Issue #5 + #8** — API 封装 + 占位页文案 (快速)
5. **FE 修复 Issue #4** — 手势滑动 (较大工作量, 可放到下一轮迭代)
6. **FE 修复 Issue #7** — 产品图片 (需要图片 URL, 可迭代)

---

## Testing Notes

- **已测试**: 全部 7 个屏幕的代码审查 + 3 个数据源的 schema 验证
- **未测试**: 真机运行时表现 (需要模拟器/真机)
- **阻塞项**: 无
