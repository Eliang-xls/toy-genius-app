# Discover 页面创新设计方案 (PM + UXD)
> PM Directive | 2026-04-22
> 目标：超越普通购物 App，打造独特体验

---

## 一、产品定位重新审视

Toy Legion 不是购物 App，是 **玩具组合推荐工具 + 卡牌游戏机制**。

核心差异化：
- 普通 App: 浏览 → 加购 → 结账
- Toy Legion: 探索 → 收集 → 组合 → 成长

---

## 二、竞品参考研究 (Research Tasks)

### BA 任务：市场研究
| # | 研究方向 | 参考对象 | 产出 |
|---|---------|---------|------|
| R-01 | 社交发现 Feed | 小红书 (图文混排瀑布流) | Feed 排版模式报告 |
| R-02 | 沉浸式浏览 | TikTok/Reels (全屏滑动) | 垂直滑动交互方案 |
| R-03 | 收藏+组合机制 | 卡牌游戏 (炉石/原神角色) | 卡牌收集系统设计 |
| R-04 | 个性化推荐流 | Spotify Discover Weekly | AI 推荐卡片流方案 |

### UXD 任务：设计创新
| # | 设计方向 | 参考风格 | 产出 |
|---|---------|---------|------|
| U-01 | 卡片化产品展示 | 3D Product Preview + Card Game | 卡片交互动效 spec |
| U-02 | 收集图鉴界面 | Pokédex / Genshin | 收集进度+解锁动画 |
| U-03 | 组合推荐可视化 | Skill Tree / Mind Map | 玩具组合连线图 |
| U-04 | 微交互设计 | Claymorphism + Micro-interactions | 动效规格文档 |

---

## 三、Discover 页创新方案 (5 个方向)

### 方案 A: "卡牌探索流" (Card Quest Flow)
**灵感**: 小红书双列瀑布流 + 卡牌开包
- 每次加载 5 张卡片，全屏展示
- 向上滑动 = 下一张 (TikTok 式)
- 长按 = "开包"动画，显示 8D 分数
- 双击 = 收藏到卡组
- 左滑 = 跳过
- 底部进度条 = 本次探索进度

### 方案 B: "智能组合仪表盘" (Smart Combo Dashboard)
**灵感**: 原神角色面板 + 雷达图
- 首页 = 当前卡组概览 (6 个槽位)
- 空槽位 = 推荐匹配玩具
- 拖拽到槽位 = 自动计算组合分数
- 实时显示：覆盖的发育维度、年龄适配度
- "一键优化" = AI 重新排列最佳组合

### 方案 C: "成长地图" (Growth Map)
**灵感**: Skill Tree + 游戏地图
- 横向可滚动的发育里程碑地图
- 每个里程碑 = 一个关卡节点
- 节点颜色 = 已解锁/进行中/未解锁
- 点击节点 = 展开相关玩具推荐
- 路径连线 = 展示发育关联

### 方案 D: "每日发现" (Daily Discover)
**灵感**: Spotify Discover Weekly + Tinder
- 每天推送 10 个精选玩具
- 卡片形式，左滑 Pass / 右滑 Like
- 底部 "为什么推荐这个?" 解释按钮
- 收藏的玩具自动进入卡组槽位
- 每周生成 "你的本周玩具卡组报告"

### 方案 E: "沉浸式故事浏览" (Immersive Story Browse)
**灵感**: Instagram Stories + 产品详情
- 每个产品 = 一个 Story 卡片序列
- 第 1 页: 产品大图 + 名称
- 第 2 页: 8D 雷达图动画
- 第 3 页: 安全认证徽章
- 第 4 页: 关联发育里程碑
- 第 5 页: "加入卡组" CTA
- 底部圆点进度指示器

---

## 四、设计规范 (基于 ui-ux-pro 研究)

### 配色方案 — Premium Kids
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #1C1917 (Warm Charcoal) | 主要文字/图标 |
| Accent | #A16207 (Warm Gold) | 强调/评分/CTA |
| Background | #FAFAF9 (Warm White) | 主背景 |
| Card | #FFFFFF | 卡片 |
| Muted | #E8ECF0 | 次要背景 |
| Muted Text | #64748B | 辅助文字 |
| Success | #059669 | 安全认证 |
| Warning | #D97706 | 警告 |

### 字体搭配 — Classic Elegant
| Role | Font | Weight |
|------|------|--------|
| Headlines | Playfair Display | 600-700 |
| Body | Inter | 400-500 |

### 动效原则
- 页面过渡: 400ms ease-out
- 卡片手势: Reanimated worklet (UI thread)
- 收藏动画: 弹性缩放 + 粒子
- 加载: Skeleton placeholder

---

## 五、任务分配

### PM (产品经理)
- [ ] 评估 5 个方案，选择 1-2 个优先实现
- [ ] 定义 MVP 交互流程 (最小可玩版本)
- [ ] 编写用户故事

### BA (商业分析)
- [ ] R-01: 小红书 Feed 排版研究
- [ ] R-02: TikTok 滑动交互研究
- [ ] R-03: 卡牌游戏收集机制对标
- [ ] R-04: 个性化推荐模式研究

### UXD (用户体验设计)
- [ ] U-01: 卡片交互动效设计
- [ ] U-02: 收集图鉴 UI 设计
- [ ] U-03: 组合推荐可视化设计
- [ ] U-04: 微交互规格文档

### FE (前端开发)
- [ ] 搭建 Reanimated + Gesture Handler 基础设施
- [ ] 实现卡片滑动手势原型
- [ ] 更新 tailwind.config.js (新配色)
