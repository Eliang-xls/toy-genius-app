# V1 Sprint Day 2 — 补充报告 (2nd Pass)
> PM | 2026-04-22 (晚间更新)

---

## 本轮变更

### 代码路径合并
- 源代码从 `/mnt/d/Docker/ToyLegion/app/` 合并到 `/mnt/d/Docker/Toy_Genius_App/`
- 所有文件 (app/, components/, lib/, stores/, types/, config files) 已迁移
- node_modules 需要重新 `npm install`

### 设计工具变更
- **Stitch MCP**: 因 trojan 代理导致超时，放弃
- **替代方案**: ui-ux-pro-max 技能 (本地数据库，零延迟)
- 设计规范直接手写，参考 ui-ux-pro 研究数据

### 配色方案升级
旧方案 (Day 2 下午):
- Primary: #3B82F6 (Blue)
- Secondary: #F59E0B (Yellow)

**新方案 (Premium Kids):**
- Primary: #1C1917 (Warm Charcoal)
- Accent: #A16207 (Warm Gold)
- Background: #FAFAF9 (Warm White)
- 来源: ui-ux-pro "Luxury/Premium Brand" palette

### 字体搭配升级
旧方案: Inter 全家桶

**新方案:**
- Headlines: Playfair Display (Serif, 编辑感)
- Body: Inter (Sans, 清晰易读)
- 来源: ui-ux-pro "Classic Elegant" pairing

---

## Discover 页创新方案 (PM 提出)

5 个创新方向，详见 `designs/discover_innovation_plan.md`:

| # | 方案 | 核心机制 | 灵感来源 |
|---|------|---------|---------|
| A | 卡牌探索流 | 全屏滑动 + 开包动画 | 小红书 + 卡牌游戏 |
| B | 智能组合仪表盘 | 6 槽位 + 拖拽组合 | 原神角色面板 |
| C | 成长地图 | Skill Tree 路径 | 游戏地图 |
| D | 每日发现 | Tinder 式 Like/Pass | Spotify + Tinder |
| E | 沉浸式故事浏览 | Story 序列 | Instagram Stories |

**PM 建议**: 优先实现 **方案 D (每日发现)** 作为 V1 创新点 — 实现成本低、用户粘性高、差异化明显。

---

## 下一步任务分配

### UXD (紧急)
- [ ] 评估 5 个 Discover 创新方案
- [ ] 选定 1-2 个方案做详细交互设计
- [ ] 输出: 交互流程图 + 动效规格

### BA (紧急)
- [ ] 小红书 Feed 排版模式研究 (R-01)
- [ ] 卡牌游戏收集机制对标 (R-03)

### FE (待 UXD 方案确定后)
- [ ] Reanimated + Gesture Handler 环境搭建
- [ ] 更新所有组件使用新配色方案
- [ ] npm install (新路径)

### PM
- [ ] 收集 BA/UXD 研究产出
- [ ] 确定 V1 Discover 页最终方案
- [ ] 更新 sprint plan

---

## 项目结构 (更新后)

```
/mnt/d/Docker/Toy_Genius_App/
├── App.tsx
├── app/
│   ├── index.tsx
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── browse.tsx
│   │   ├── milestones.tsx
│   │   ├── profile.tsx
│   │   └── slot.tsx
│   └── detail/[id].tsx
├── components/
│   └── ProductCard.tsx
├── lib/
│   └── api.ts
├── stores/
├── types/
├── docs/
│   └── sprints/v1.0-alpha/
│       ├── plan.md
│       ├── designs/
│       │   ├── HOME_001_spec.md
│       │   ├── DETAIL_001_spec.md
│       │   └── discover_innovation_plan.md
│       └── reports/
│           ├── day1_report.md
│           └── day2_report.md
├── package.json
├── tailwind.config.js (已更新 Premium 配色)
├── app.json
├── tsconfig.json
├── babel.config.js
├── global.css
└── index.ts
```
