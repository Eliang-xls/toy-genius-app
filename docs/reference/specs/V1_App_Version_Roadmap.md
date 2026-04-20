# Toy Legion — App 版本路线图 & V1 页面功能规格

**日期**: 2026-04-19
**参与角色**: Backend Architect / Frontend Engineer / Data Analyst / UX Designer
**项目**: Toy Legion — AI-Powered Toy Recommendation App
**目标**: 确定版本迭代路线图 + V1 详细页面结构/功能/用户操作逻辑

---

## 第一部分: App 版本路线图

### 版本规划总览

| 版本 | 代号 | 核心目标 | 目标用户 | 预计周期 |
|------|------|---------|---------|---------|
| V1.0 | Foundation | 核心浏览+评分+单孩子插槽规划 | 欧美家长（0-6岁） | 8-10周 |
| V1.5 | Social Proof | 安全认证增强 + 基础社区 | 扩展到0-10岁 | 4-6周 |
| V2.0 | Intelligence | AI报告+多孩子+付费体系 | 全年龄段家长 | 6-8周 |
| V2.5 | Expansion | 扩展包+成就系统+收藏增强 | 深度用户 | 4-6周 |
| V3.0 | Ecosystem | 二手市场+B端+UGC | 全市场 | 持续迭代 |

---

### V1.0 Foundation (MVP)
**核心价值**: "发现好玩具，科学规划玩耍"

#### 功能清单 (Free Only)
| 模块 | 功能 | 数据源 | 优先级 |
|------|------|--------|--------|
| **Browse** | 产品浏览 + 基础筛选 + 排序 | mv_product_browse | P0 |
| **Detail** | 产品详情 (8D雷达图 + AI描述 + 基础安全) | v_product_detail | P0 |
| **Slot** | 单孩子 4-插槽规划 (单年龄段) | mv_product_browse + slot_plans | P0 |
| **Profile** | 基础用户档案 + 单孩子档案 | user_profiles + children | P0 |
| **Auth** | 注册/登录 (Supabase Auth) | Supabase Auth | P0 |

#### V1 不包含
- 付费内容 (Age Performance Curve, Premium Safety, AI报告)
- 多孩子管理
- 社区/UGC
- 洗牌算法
- 成就系统
- 推送通知

#### V1 技术栈决策
| 层级 | 选型 | 理由 |
|------|------|------|
| 框架 | React Native (Expo) | 跨平台, 单人开发效率高 |
| 导航 | React Navigation 6 | Tab + Stack 标准方案 |
| 状态管理 | Zustand | 轻量, 适合原型 |
| 数据层 | Supabase JS Client | 直接 REST API, 不需后端 |
| 图片 | Supabase Storage URL拼接 | 已有多尺寸图片 |
| 认证 | Supabase Auth | 内置, RLS集成 |
| UI库 | NativeWind (Tailwind for RN) | 快速原型 |

---

### V1.5 Social Proof
**核心价值**: "更多安全证据 + 社区信任"

| 功能 | 说明 |
|------|------|
| 安全认证数据补充 | 14.4% → 50%+ 覆盖 |
| 产品评价展示 | 从 retailers 汇总评分 |
| 基础收藏 | saved_items 表启用 |
| 浏览页筛选增强 | 品类/价格/年龄多维筛选 |
| 深度链接 | 产品详情页分享链接 |

---

### V2.0 Intelligence (首个付费版本)
**核心价值**: "AI 科学育儿顾问"

| 功能 | 层级 |
|------|------|
| 多孩子管理 (最多3个) | Pro |
| 跨年龄段插槽规划 | Pro |
| Age Performance Curve (15点曲线图) | Pro |
| Premium Safety 详情 | Pro |
| 智能洗牌 (3次/天 Free, 无限 Pro) | Free/Pro |
| AI 组合推荐报告 | Premium |
| 发育里程碑匹配 | Free (基础) / Premium (深度) |
| 订阅管理 | Free/Pro/Premium |

#### V2.0 订阅定价
| 层级 | 月费 | 年费 |
|------|------|------|
| Free | $0 | - |
| Pro | $6.99/mo | $59.99/yr |
| Premium | $12.99/mo | $99.99/yr |

---

### V2.5 Expansion
**核心价值**: "成长记录 + 扩展玩法"

| 功能 | 说明 |
|------|------|
| 扩展包 DLC | 新 scene_tags 系列 (如 STEM Pack, Outdoor Pack) |
| 成就系统 | milestone 解锁 + 徽章展示 |
| 玩具轮换提醒 | Rotation Manager |
| 我的玩具库 | 拍照/扫码录入已有玩具 |
| 家庭资产流转 (预备) | 数据结构预留 |

---

### V3.0 Ecosystem
**核心价值**: "玩具全生命周期管理平台"

| 功能 | 说明 |
|------|------|
| 二手交易撮合 | 基于已录入玩具的流转市场 |
| B端数据洞察 | 脱敏数据报告 (品牌方) |
| UGC 评价系统 | 社区评测 + 安全反馈 |
| 品牌认证合作 | App 推荐标识 |
| 多语言支持 | 西语/法语等 |

---

## 第二部分: V1 详细页面功能规格

### V1 页面结构 & 导航架构

```
App
├── Auth Stack
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── OnboardingScreen (首次进入: 创建孩子档案)
│
├── Main Tab Navigator (底部4 Tab)
│   ├── Browse Tab
│   │   └── BrowseScreen → DetailScreen → AddToSlotScreen
│   │
│   ├── Slot Tab
│   │   └── SlotPlanScreen → DetailScreen
│   │
│   ├── Milestones Tab
│   │   └── MilestonesScreen
│   │
│   └── Profile Tab
│       ├── ProfileScreen
│       ├── ChildProfileScreen
│       └── SettingsScreen
│
└── Modal/Overlay
    └── SlotQuickAddModal (从Browse长按触发)
```

---

### Page 1: BrowseScreen (浏览页)

#### 功能描述
用户浏览全部产品库, 通过筛选和排序发现感兴趣的玩具。

#### 数据源
```
GET /rest/v1/mv_product_browse
  ?select=*
  &order=base_score.desc
  &limit=20
  &offset={page * 20}
```

#### 页面结构
```
┌─────────────────────────────────────┐
│  [Header]                           │
│  Toy Legion                    [⚙] │
│  ─────────────────────────────────  │
│  [Search Bar]                       │
│  🔍 Search toys...                  │
│  ─────────────────────────────────  │
│  [Filter Chips] (水平滚动)           │
│  [All] [Age] [Category] [Price]    │
│  ─────────────────────────────────  │
│  [Sort Dropdown]         [Grid|List]│
│  ─────────────────────────────────  │
│                                     │
│  [Product Card Grid / List]         │
│  ┌─────────┐  ┌─────────┐          │
│  │ [img]   │  │ [img]   │          │
│  │ Name    │  │ Name    │          │
│  │ Brand $ │  │ Brand $ │          │
│  │ ▇▇▇ 72  │  │ ▇▇▇ 68  │          │
│  │ [Ed][Cr]│  │ [Mo][Se]│          │
│  │ T1 T2 T3│  │ T1 T2   │          │
│  └─────────┘  └─────────┘          │
│                                     │
│  [Load More / Infinite Scroll]      │
│                                     │
├─────────────────────────────────────┤
│ [🏠Home] [🎯Slots] [🏆Milestones] [👤Profile] │
└─────────────────────────────────────┘
```

#### 卡片内容 (Product Card)
| 字段 | 来源列 | 显示方式 |
|------|--------|---------|
| 产品图片 | product_id → 拼接URL | {SUPABASE}/storage/.../product-images/{id}/300.png |
| 产品名 | name_display | 单行截断 |
| 品牌名 | brand_name | 灰色小字 |
| 价格 | scraped_price | "$29.99" |
| 基础分 | base_score | 条形图 + 数字 (如 ▇▇▇ 72) |
| Top 8D维度 | d_education, d_creativity... | 取最高2-3个, 彩色小条 |
| Top 标签 | top_tag_ids → scene_tags_config | 最多3个, chip样式 |

#### 用户操作逻辑
| 操作 | 交互 | 结果 |
|------|------|------|
| 下拉刷新 | Pull-to-Refresh | 重新加载首页数据 |
| 滚动到底 | Infinite Scroll | 加载下一页 (offset+=20) |
| 点击搜索栏 | Focus → 输入 | 过滤 name_display (前端本地过滤或后端ILIKE) |
| 点击筛选Chip | 展开筛选面板 | Age Range / Category / Price Tier 选择 |
| 点击排序 | Dropdown | base_score / price / age_min 切换 |
| 点击卡片 | Navigate | → DetailScreen(product_id) |
| 长按卡片 | 触发快捷操作 | → SlotQuickAddModal (V2功能, V1预留) |

#### 筛选逻辑
```
筛选条件:
- Age: 年龄段选择 (0-1, 1-2, ..., 14-15)
  → age_min_yr <= selected_age AND age_max_yr >= selected_age
- Category: product_category IN [...]
- Price: scraped_price BETWEEN [min, max]

排序选项:
- Popularity (base_score DESC) — 默认
- Price Low→High (scraped_price ASC)
- Price High→Low (scraped_price DESC)
- Age (age_min_yr ASC)
```

---

### Page 2: DetailScreen (产品详情页)

#### 功能描述
展示单个产品的完整信息, 包括评分、AI描述、安全认证。

#### 数据源
```
# 并行请求
1. GET /rest/v1/mv_product_browse?id=eq.{product_id}  (预计算分数, <1ms)
2. GET /rest/v1/v_product_detail?id=eq.{product_id}   (AI描述+安全, ~15ms)
```

#### 页面结构
```
┌─────────────────────────────────────┐
│  [← Back]                           │
│  ┌─────────────────────────────────┐ │
│  │      [产品大图 - 600px]         │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│  Product Name Here                   │
│  Brand Name | $29.99 | Ages 3-6     │
│  ─────────────────────────────────  │
│  ▶ Section 1: Capability Profile    │
│  ┌──────────────┐ ┌──────────────┐  │
│  │  8D Radar    │ │ Base: 72/100 │  │
│  │  [雷达图]     │ │ Strong:      │  │
│  │              │ │ 🟢 Education │  │
│  │              │ │ 🟢 Creativity│  │
│  │              │ │ Good:        │  │
│  │              │ │ 🟡 Sensory   │  │
│  └──────────────┘ └──────────────┘  │
│  ─────────────────────────────────  │
│  ▶ Section 2: About This Toy        │
│  "Elevate your Hot Wheels..."       │
│  [Read More ▼]                       │
│  ─────────────────────────────────  │
│  ▶ Section 3: Safety Profile        │
│  ┌──────────────────────────────┐   │
│  │ Overall: ⬛⬛⬛⬛⬜ 95/100   │   │
│  │ Age Grade: 3+                │   │
│  │ Certs: CPSIA ✓ ASTM F963 ✓  │   │
│  │                               │   │
│  │ 🔒 Detailed Safety Analysis  │   │
│  │ [Upgrade to Pro to unlock]   │   │
│  └──────────────────────────────┘   │
│  ─────────────────────────────────  │
│  [➕ Add to Slot] (底部固定按钮)     │
│                                     │
├─────────────────────────────────────┤
│ [🏠Home] [🎯Slots] [🏆Milestones] [👤Profile] │
└─────────────────────────────────────┘
```

#### 各区块详细说明

**Section 1: Capability Profile**
| 元素 | 数据 | 交互 |
|------|------|------|
| 8D雷达图 | d_safety ~ d_emotions (8维) | 静态展示 |
| Base Score | base_score | 数字 + 环形进度条 |
| Strong 标签 | 8D中 ≥ 7.0 的维度 | 绿色高亮 |
| Good 标签 | 8D中 5.0-6.9 的维度 | 黄色 |
| Emerging 标签 | 8D中 < 5.0 的维度 | 灰色 |

**Section 2: About This Toy**
| 元素 | 数据 | 交互 |
|------|------|------|
| AI描述文本 | ai_description | 默认显示前3行, 展开全文 |

**Section 3: Safety Profile**
| 元素 | 数据 | 免费/付费 |
|------|------|----------|
| 综合安全分 | ai_confidence_score → 进度条 | Free |
| 年龄分级 | age_grade_verified | Free |
| 认证列表 | certification_names (JSONB数组) | Free |
| 详细安全分析 | safety_notes | Premium 🔒 |
| 证据链接 | safety_cert_details[].evidence_url | Premium 🔒 |

**Section 4: Add to Slot**
- 点击 → 弹出 Slot 选择器
- 显示当前已创建的 Slot 列表
- 如果没有 Slot → 引导创建

#### 用户操作逻辑
| 操作 | 交互 | 结果 |
|------|------|------|
| 左上返回 | Navigate Back | → BrowseScreen |
| 滚动 | Vertical Scroll | 浏览所有区块 |
| 点击 Read More | 展开/收起 | ai_description 完整显示 |
| 点击 Premium 内容 | Check subscription | V1: 显示"Coming in V2"提示 |
| 点击 Add to Slot | Modal | → SlotPickerModal |

---

### Page 3: SlotPlanScreen (插槽规划页)

#### 功能描述
用户为孩子创建和管理"玩具插槽", 可视化规划玩具组合。

#### 数据源
```
# 并行请求
1. GET /rest/v1/children?user_id=eq.{user_id}  (孩子列表)
2. GET /rest/v1/slot_plans?child_id=eq.{child_id}  (已有规划)
3. GET /rest/v1/mv_product_browse?id=in.({product_ids})  (已选产品)
```

#### 页面结构
```
┌─────────────────────────────────────┐
│  [Header] Slot Plan                 │
│  ─────────────────────────────────  │
│  [Child Selector: 👶 Emma, 3yo ▼]  │
│  ─────────────────────────────────  │
│  [Age Row: 3-4 yrs]                 │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│  │ [img] │ │ [img] │ │       │ │       │
│  │ Name  │ │ Name  │ │       │ │       │
│  │ 72    │ │ 65    │ │ Empty │ │ Empty │
│  │ ▇▇▇▇  │ │ ▇▇▇   │ │  [+]  │ │  [+]  │
│  └───────┘ └───────┘ └───────┘ └───────┘
│  ─────────────────────────────────  │
│  [Combo Score Summary]              │
│  ┌──────────────────────────────┐   │
│  │ Balance: ████░░ 68%          │   │
│  │ Diversity: ███░░░ 54%        │   │
│  │ Price Fit: █████░ 82%        │   │
│  │ Safety: ██████ 95%           │   │
│  │ ─────────────────────────    │   │
│  │ Overall: █████░ 72/100       │   │
│  └──────────────────────────────┘   │
│  ─────────────────────────────────  │
│  [8D Coverage Radar (组合)]          │
│  ┌──────────────────────────────┐   │
│  │        [组合雷达图]            │   │
│  │     Shows combined 8D        │   │
│  │     from all 4 slots         │   │
│  └──────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [🏠Home] [🎯Slots] [🏆Milestones] [👤Profile] │
└─────────────────────────────────────┘
```

#### 插槽卡片 (Slot Card) — 槽位中
```
┌───────────────┐
│  [产品图片]     │
│  Product Na... │  ← 名称截断15字符
│  72            │  ← slot_score (动态)
│  ▇▇▇▇▇▇ 65    │  ← 简化条形图
└───────────────┘
```

#### 用户操作逻辑
| 操作 | 交互 | 结果 |
|------|------|------|
| 切换孩子 | Dropdown | 重新加载对应孩子的 slot_plans |
| 点击空槽 [+] | Navigate | → BrowseScreen (带 Add-to-Slot 模式标记) |
| 点击已有卡牌 | Modal | → SlotCardDetailModal |
| 长按已有卡牌 | 拖拽 | 槽位间互换 (V2: 跨年龄行拖拽) |
| 点击卡牌背面翻转 | Flip Animation | 显示 Top6标签+年龄+价格 |

#### SlotCardDetailModal (点击卡牌弹窗)
```
┌─────────────────────────────────────┐
│  [产品图片]          [✕ 关闭]        │
│  Product Name                        │
│  Brand | $29.99 | Ages 3-6          │
│  ──────────────────────────────────  │
│         ┌─ Radar Chart ─┐           │
│         │    8D radar   │           │
│         └───────────────┘           │
│  ──────────────────────────────────  │
│  Score by Age:                       │
│  0-1: 54.8  5-6: 43.4  14-15: 32.9  │
│  ──────────────────────────────────  │
│  [View Full Detail] [Remove from Slot]│
└─────────────────────────────────────┘
```

#### Combo Score 计算 (前端实时)
```typescript
// 插槽内产品的组合分
function calcComboScore(slotProducts: Product[], childAge: number) {
  // 1. 各产品 slot_score (含 age_penalty)
  const slotScores = slotProducts.map(p => {
    const slotKey = `slot_${ageFloor}_${ageCeil}`;
    const raw = p[slotKey]; // 物化视图预计算
    const penalty = calcAgePenalty(childAge, p.age_min_yr);
    return raw * penalty;
  });

  // 2. 平均分
  const avgSlotScore = slotScores.reduce((a, b) => a + b, 0) / slotScores.length;

  // 3. 平衡度 (8D覆盖方差的倒数)
  const coverage = calc8DCoverage(slotProducts);
  const balance = 1 - (variance(coverage) / maxVariance);

  // 4. 多样性 (品类不重复度)
  const diversity = uniqueCategories / totalSlots;

  // 5. 价格适配 (越接近理想价格区间越高)
  const priceFit = calcPriceFit(slotProducts, idealPriceRange);

  // 6. 安全 (优先用 safety_certs, 回退32D)
  const safety = avgSafetyScore(slotProducts);

  // 组合公式
  return avgSlotScore * (balance * 0.4 + diversity * 0.25 + priceFit * 0.2 + safety * 0.15) / 100;
}
```

---

### Page 4: MilestonesScreen (里程碑页)

#### 功能描述
展示发育里程碑, 帮助家长了解孩子当前发展阶段的重点能力。

#### 数据源
```
GET /rest/v1/growth_milestones?order=age_min_months.asc
GET /rest/v1/user_milestones?user_id=eq.{user_id}
```

#### 页面结构
```
┌─────────────────────────────────────┐
│  [Header] Milestones                │
│  ─────────────────────────────────  │
│  [Child: 👶 Emma, 3yo ▼]           │
│  ─────────────────────────────────  │
│  [Timeline Vertical]                │
│  │                                   │
│  ●── 0-6 months (4 milestones)      │
│  │   ✓ Head control                  │
│  │   ✓ Reaching                      │
│  │   ...                             │
│  │                                   │
│  ●── 6-12 months (5 milestones)     │
│  │   ✓ Sitting independently        │
│  │   ✓ First words                   │
│  │   ...                             │
│  │                                   │
│  ◉── 36-48 months (CURRENT)         │  ← 当前阶段高亮
│  │   □ Can count to 10               │
│  │   ✓ Pedals tricycle               │
│  │   □ Catches ball                  │
│  │   [View Matching Toys →]          │  ← 关联推荐
│  │                                   │
│  ○── 48-60 months (locked)          │
│  │   ...                             │
│                                     │
├─────────────────────────────────────┤
│ [🏠Home] [🎯Slots] [🏆Milestones] [👤Profile] │
└─────────────────────────────────────┘
```

#### 用户操作逻辑
| 操作 | 交互 | 结果 |
|------|------|------|
| 切换孩子 | Dropdown | 过滤对应年龄段的里程碑 |
| 点击里程碑 | 展开 | 显示描述 + 推荐玩具 |
| "View Matching Toys" | Navigate | → BrowseScreen (带场景标签筛选) |

---

### Page 5: ProfileScreen (个人主页)

#### 功能描述
管理用户信息、孩子档案、设置。

#### 页面结构
```
┌─────────────────────────────────────┐
│  [Header] Profile                   │
│  ─────────────────────────────────  │
│  [Avatar]  User Name                │
│            user@email.com           │
│  ─────────────────────────────────  │
│  ▶ My Children                     │
│  ┌──────────────────────────────┐   │
│  │ 👶 Emma | 3y 2m | Edit      │   │
│  │ 👶 Noah | 5y 8m | Edit      │   │
│  │ [+ Add Child]                │   │
│  └──────────────────────────────┘   │
│  ─────────────────────────────────  │
│  ▶ Settings                        │
│  │ Notifications: [ON/OFF]        │   │
│  │ Units: [Imperial / Metric]     │   │
│  │ Language: [English]            │   │
│  │ ──────────────────────────     │   │
│  │ Subscription: Free             │   │
│  │ [Upgrade to Pro] (V2)          │   │
│  │ ──────────────────────────     │   │
│  │ Privacy Policy                 │   │
│  │ Terms of Service               │   │
│  │ ──────────────────────────     │   │
│  │ [Log Out]                      │   │
│  └──────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [🏠Home] [🎯Slots] [🏆Milestones] [👤Profile] │
└─────────────────────────────────────┘
```

#### 用户操作逻辑
| 操作 | 交互 | 结果 |
|------|------|------|
| 点击 Edit Child | Navigate | → ChildProfileScreen |
| 点击 Add Child | Modal | 创建新孩子档案 (V1限1个, V2可多) |
| 点击 Log Out | 确认弹窗 | 清除本地token, → LoginScreen |

---

### Page 6: OnboardingScreen (首次引导)

#### 功能描述
新用户注册后的首次引导流程。

#### 流程
```
Step 1: Welcome
  "Welcome to Toy Legion!"
  "Smart toy recommendations backed by science"
  [Get Started]

Step 2: Child Info
  "Tell us about your little one"
  Name: [________]
  Birthday: [Date Picker]
  Gender: [Optional]
  [Continue]

Step 3: Interests (可选)
  "What does your child enjoy?"
  [Building] [Art] [Music] [Outdoor] [Pretend Play] [Puzzles]
  [Skip for now] [Continue]

Step 4: Done
  "All set! Let's find some amazing toys."
  [Start Browsing]
```

---

## 第三部分: 数据操作逻辑汇总

### 用户认证流程
```
Register → Supabase Auth.signUp()
  → 自动触发 create_user_profile() 函数
  → 创建 user_profiles 记录
  → Navigate → OnboardingScreen

Login → Supabase Auth.signIn()
  → 检查 children 表是否有记录
  → 无: → OnboardingScreen
  → 有: → Main Tab Navigator
```

### 数据缓存策略
| 数据 | 缓存位置 | 更新频率 |
|------|---------|---------|
| mv_product_browse | 前端内存 | 进入Browse页时 (或拉刷新) |
| v_product_detail | 无缓存 | 每次进入详情页实时获取 |
| scene_tags_config | 本地JSON打包 | App更新时 |
| growth_milestones | 本地缓存 | 首次启动 + 每周检查 |
| user_profiles | 前端内存 | 登录时获取 |
| children | 前端内存 | 登录时获取, CRUD后更新 |
| slot_plans | 前端内存 | 进入Slot页时, CRUD后更新 |

### 图片加载策略
```
优先级:
1. Supabase Storage URL (300px) — 浏览卡片
2. Supabase Storage URL (600px) — 详情页
3. products.image_url (原始URL数组) — Fallback
4. 本地占位图 — 最终兜底
```

---

## 第四部分: V1 待确认事项

### 需要决策的开放问题

| # | 问题 | 选项 | 建议 |
|---|------|------|------|
| 1 | 浏览页搜索: 前端过滤 vs 后端搜索? | A.前端本地(快, 仅当前页) B.后端ILIKE(全库, 慢) | A, V1够用 |
| 2 | 筛选面板: 底部Sheet vs 独立页? | A.Bottom Sheet B.独立筛选页 | A, 标准模式 |
| 3 | Slot卡片翻转: 手势 vs 按钮? | A.左右滑动翻转 B.点击翻转图标 | B, 更直观 |
| 4 | Browse卡片: Grid还是List? | A.仅Grid B.仅List C.可切换 | C, 用户偏好 |
| 5 | 8D雷达图: 客户端绘制 vs 图片? | A.React-Native-SVG绘制 B.后端生成图片 | A, 灵活可控 |
| 6 | V1是否需要离线模式? | A.是 B.否 | B, V2再做 |

---

*Toy Legion Virtual Team — 2026-04-19*
*Backend Architect | Frontend Engineer | Data Analyst | UX Designer*
