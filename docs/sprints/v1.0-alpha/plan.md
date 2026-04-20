# Toy Legion V1.0-alpha — Sprint 计划 (迭代版)
> PM 发布 | 2026-04-22

---

## Sprint 概览

| 项目 | 值 |
|------|-----|
| 版本 | V1.0-alpha |
| 代号 | Foundation |
| 目标 | App Store 上架 — Browse + Detail + Milestones (3 核心屏) |
| 团队 | BA / FE / DA / UXD |
| 迭代模式 | PM 闭环迭代 (见下方迭代协议) |

---

## 一、迭代协议 (Iteration Protocol)

### 上下文预算规则

Hermes 会话上下文有限。每次迭代（PM 读报告→分配→执行→输出报告）必须控制在安全范围内。

| 指标 | 值 |
|------|-----|
| 会话总可用轮次 | ~20 轮 |
| 安全线 (50%) | ~10 轮 |
| 单次 PM 迭代预算 | **5-7 轮** (含工具调用) |
| 超限动作 | 立即停止，输出报告，新会话继续 |

### 单轮迭代预算分配

| 阶段 | 轮次 | 动作 |
|------|------|------|
| 读取 | 1 轮 | 读上次报告 + 总计划 |
| 规划 | 1 轮 | 识别问题 + 分配任务 |
| 执行 | 2-3 轮 | 团队执行 (BA/DA/FE/UXD 并行) |
| 汇总 | 1 轮 | 输出本轮 Day Report |

### PM 闭环迭代流程

```
  ┌──────────────┐
  │ 1. 读上次报告 │ ← V1_DayN_Report.md
  │ 2. 读总计划   │ ← 本文件
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │ 3. 识别状态   │
  │  - 已完成 ✅  │
  │  - 未完成 ❌  │
  │  - 阻塞 🔴   │
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │ 4. 分配任务   │ ← 按角色 (BA/FE/DA/UXD)
  │    P0 优先    │ ← 每轮 2-3 个 P0
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │ 5. 团队执行   │ ← 并行调用工具
  │    (2-3 轮)   │
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │ 6. 输出报告   │ ← V1_Day(N+1)_Report.md
  │ 7. 更新总计划 │
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │ 8. 检查预算   │
  │  ≤5 轮 → 继续│
  │  >5 轮 → 停止│
  └──────────────┘
```

---

## 二、V1 功能范围 (Revised)

V1 聚焦 3 个核心屏幕，验证产品核心价值。

| Screen | 功能 | 数据源 | 优先级 |
|--------|------|--------|--------|
| HOME_001 | 产品浏览 + 年龄段筛选 + 排序 | mv_product_browse | P0 |
| DETAIL_001 | 产品详情 + AI 评分 + 安全认证 + 购买链接 | v_product_detail | P0 |
| MILESTONE_001 | 发育里程碑 + 关联玩具 | v_milestone_toys | P1 |

### V1 排除项 (→ V2)
- 用户认证 (Auth)
- 儿童档案 (Children)
- 插槽规划 (Slot Plans)
- 保存/收藏 (Saved Items)
- 社区功能 (Community)

---

## 三、版本路线图

| 版本 | 核心目标 | 周期 |
|------|---------|------|
| **V1.0-alpha** | 3 屏浏览 + 数据验证 | 2-3 周 |
| V1.0-beta | + Auth + Children + Slot Plans | +3-4 周 |
| V1.0-rc | + 全功能 + App Store 提交 | +2-3 周 |
| V1.0 | App Store 上架 | +1 周 buffer |
| V2.0 | + 多孩子 + 订阅制 + 社区 | TBD |

---

## 四、WBS — 按迭代轮次

### 迭代 Round 1 (Day 1-2): 基础设施
**目标**: Expo 项目可运行 + Stitch 3 屏幕设计完成

| ID | 任务 | Owner | 状态 |
|----|------|-------|------|
| R1-01 | Expo 项目初始化 + NativeWind | FE | ✅ |
| R1-02 | 设计系统 Token 注入 | FE | ✅ |
| R1-03 | Stitch → 手动设计规范 + RN 组件 | FE | ✅ (Stitch MCP 不可用, 手动替代) |
| R1-04 | MV 数据验证 (50+ 产品) | DA | ✅ (10,597 products verified) |
| R1-05 | v_product_detail 视图确认 | DA | ✅ |

### 迭代 Round 2 (Day 3-4): 屏幕集成
**目标**: Stitch → React Native 组件 + 数据联通

| ID | 任务 | Owner | 状态 |
|----|------|-------|------|
| R2-01 | Stitch 组件提取 → RN | FE | 🔲 (等待 UXD Discover 方案) |
| R2-02 | Expo Router 导航 | FE | ✅ (4 tab 验证通过) |
| R2-03 | API 集成 (mv + detail) | FE | 🔴 阻塞 (.env 缺失) |
| R2-04 | v_milestone_toys 视图优化 | DA | ✅ (117K 行, 质量良好) |
| R2-05 | 配色迁移 Premium 配色 | FE | ✅ (4 文件更新) |
| R2-06 | npm 依赖安装 + polyfill | FE | ✅ (877 包, 0 漏洞) |

### 迭代 Round 3 (Day 5-6): 打磨 + 验收
**目标**: 可演示的 V1 alpha

| ID | 任务 | Owner | 状态 |
|----|------|-------|------|
| R3-01 | UI 打磨 + 错误处理 | FE | ✅ (ErrorBoundary + Skeleton 组件) |
| R3-02 | Dogfood QA 测试 | PM+UXD | 🔲 |
| R3-03 | Playfair Display 字体集成 | FE | ✅ (expo-font + splash screen) |
| R3-04 | Discover 页面 (方案D 每日发现) | FE | ✅ (Tinder 式 Like/Pass) |
| R3-05 | NativeWind 类型声明修复 | FE | ✅ (nativewind-env.d.ts) |
| R3-06 | APK/TestFlight 构建 | FE | 🔲 |
| R3-07 | V1 alpha 发布决策 | PM | 🔲 |

---

## 五、角色职责

| 角色 | 核心职责 | 响应模式 |
|------|---------|---------|
| **PM** | 计划/追踪/风险/成本/迭代管理 | 每轮迭代主导 |
| **BE (BA)** | Supabase 配置/RLS/函数 | 按需响应 |
| **FE** | 全部 App 页面/组件/集成 | 迭代主力 |
| **DA** | 数据/质量/视图/管道 | 按需响应 |
| **UXD** | 设计审核/体验验收 | 按需响应 |

## Quick Links

| Document | Path |
|----------|------|
| Sprint Plan (本文件) | `plan.md` |
| PM Iteration Protocol | `iteration_skill.md` |
| Cost Tracker | `cost_tracker.md` |
| Version Roadmap | `../../reference/specs/V1_App_Version_Roadmap.md` |
| Design Spec v4 | `designs/display_design_v4.md` |
| Frontend Display Plan | `designs/frontend_display_plan.md` |

---

## 六、风险登记

| ID | 风险 | 级别 | 缓解措施 |
|----|------|------|---------|
| R-01 | Stitch MCP 不稳定 | 中 | 重试 + 手动设计备选 |
| R-02 | MV 数据质量不足 | 中 | DA 预检查 + 补数据 |
| R-03 | 上下文耗尽导致迭代断裂 | 高 | 严格 5 轮预算 + 报告先行 |
| R-04 | Expo + NativeWind 兼容性 | 低 | Day 1 已验证通过 |

---

## 七、Decisions Log

| 日期 | 决策 | By |
|------|------|----|
| 4/20 | MVP = 单体多模块 Expo + NativeWind | 全员 |
| 4/20 | BE = 单库单 Schema, MV refresh async | 全员 |
| 4/20 | DA = mv_product_browse + v_product_detail | 全员 |
| 4/22 | V1 聚焦 3 屏 (Browse/Detail/Milestone) | PM+UXD |
| 4/22 | Stitch 旧项目弃用，新建 "Toy Legion V1" | PM |
| 4/22 | 迭代协议: 5 轮预算上限 | PM |

---

## 八、迭代报告索引

| Report | Date | File |
|--------|------|------|
| Day 1 | 4/22 | `reports/day1_report.md` |
| Day 2 | 4/22 | `reports/day2_report.md` |
| Day 3 | TBD | `reports/day3_report.md` |

---

## 九、PM 迭代路径

```
每轮开始:
  读 → plan.md (本文件, 总计划)
  读 → reports/dayN.md (上次报告)
  
执行:
  规划 → 分配 → 团队并行执行
  
每轮结束:
  写 → reports/dayN+1.md (本轮报告)
  更新 → plan.md (任务状态)
```

详细流程见 iteration_skill.md

---

## 附录: PM 技能检查

PM 角色需具备以下能力闭环：

| 能力 | 状态 | 说明 |
|------|------|------|
| 读取上次报告 | ✅ | 流程已定义 (Step 1) |
| 识别任务状态 | ✅ | Done/Pending/Blocked 分类 |
| 分配任务 | ✅ | 按角色 + P0 优先 |
| 并行执行 | ✅ | BA/DA/FE/UXD 同时启动 |
| 输出报告 | ✅ | Day Report 模板已定义 |
| 安排下轮工作 | ✅ | 报告含 Next Round 计划 |
| 上下文预算控制 | ✅ | 5 轮上限 + 超限停止 |
| 闭环迭代 | ✅ | 报告→规划→执行→报告 循环 |
| 成本追踪 | ✅ | 每轮报告含 Token/费用, cost_tracker.md 独立跟踪 |
| 预算控制 | ✅ | 单轮/累计/偏差率三级控制 + 自动触发规则 |

> 详细流程见 V1_PM_Iteration_Skill.md
