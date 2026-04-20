# PM Sprint Iteration Loop — Skill
> For Project Manager role in Toy Legion team meetings
> Created: 2026-04-22

---

## Purpose
PM 执行闭环迭代：**读报告 → 解决问题 → 分配任务 → 团队执行 → 输出报告 → 下一轮**

---

## Context Budget Rule (迭代上下文预算)
Hermes 会话上下文有限，PM 迭代必须控制在安全范围内。

| 指标 | 值 |
|------|-----|
| 会话总可用轮次 | ~20-25 轮 |
| 安全线 (50%) | ~10-12 轮 |
| 单次迭代预算 | **5-7 轮** (含工具调用) |
| 超限警告 | >8 轮时停止，输出报告，新会话继续 |

### 单轮迭代预算分配
| 阶段 | 轮次 | 动作 |
|------|------|------|
| 读取 | 1 轮 | 读上次报告 + 总计划 |
| 规划 | 1 轮 | 识别问题 + 分配任务 |
| 执行 | 2-3 轮 | 团队成员执行（并行） |
| 汇总 | 1 轮 | 输出本轮报告 |

---

## Closed-Loop Iteration Process

### Step 0: Cost Check (成本检查)
```
1. 估算当前上下文使用率 (已有轮次 / 总可用轮次)
2. 判断状态:
   🟢 <50% → 正常执行
   🟡 50-70% → 缩短本轮，减少工具调用
   🔴 >70% → 立即输出报告，提示新会话
3. 如果 >70% → 跳过 Step 2-3，直接进入 Step 4 (只输出报告)
```

### Step 1: Read Previous Round (1 轮)
```
1. 读取上次 Day Report（V1_DayN_Report.md）
2. 读取总计划（V1_Sprint_Execution_Plan.md）
3. 识别：
   - ✅ 上轮完成的任务
   - ❌ 未完成/阻塞的任务
   - 🔴 新出现的风险
```

### Step 2: Plan This Round (1 轮)
```
1. 从总计划取出当前阶段的任务
2. 结合上次报告的未完成项
3. 按角色分配今日任务：
   - BA: 配置/RLS/API
   - FE: UI/组件/集成
   - DA: 数据/质量/管道
   - UXD: 设计稿/审核
4. 确认无阻塞 → 进入执行
5. 有阻塞 → 先解决阻塞（改总计划或求助用户决策）
```

### Step 3: Execute (2-3 轮)
```
原则：
- 并行调用：同时启动 BA/DA/FE/UXD 任务
- 单任务上限：3 个工具调用
- 超过 3 调用未完成 → 标记 pending，不阻塞本轮
- 文件操作集中执行（批量 read_file / write_file）
```

### Step 4: Write Report (1 轮)
```
输出 V1_DayN_Report.md，包含：
1. 本轮完成事项表格（任务/负责人/状态/备注）
2. 未完成事项 + 原因
3. 下轮计划（Day N+1）
4. 风险更新
5. 决策需求（如有）
```

### Step 5: Check Budget
```
如果本轮已用 >5 轮：
  → 输出报告，提示用户开启新会话继续
如果 <=5 轮：
  → 询问用户是否继续下一轮
```

---

## Report Template

```markdown
# V1 Sprint Day N Report
> Project Manager | YYYY-MM-DD

## Executive Summary
[一句话总结本轮进展]

## Completed
| Task | Owner | Status | Notes |
|------|-------|--------|-------|

## Pending / Blocked
| Task | Owner | Reason | Resolution |
|------|-------|--------|------------|

## Next Round (Day N+1)
| Task | Owner | Priority |
|------|-------|----------|

## Risk Update
| Risk | Level | Change |
|------|-------|--------|

## Decisions Needed
| Decision | Owner | Deadline |

## Context Status
本轮工具调用: N/7 [是否需要新会话]
```

---

## Rules
1. **永远先读再写** — 不读上次报告就不分配任务
2. **P0 优先** — 每轮只推 2-3 个 P0 任务，不贪多
3. **并行执行** — BA/DA/FE/UXD 任务尽量同时启动
4. **不过夜阻塞** — 阻塞问题本轮解决或标记决策需求
5. **报告必出** — 无论完成多少，每轮必须输出报告
6. **上下文守门** — >5 轮时主动停止，不等 AI 卡死
7. **成本记录** — 每轮报告必须包含 Token 消耗和费用

---

## Cost Tracking (成本追踪)

### 费率表 (Rate Card) — Xiaomi MiMo v2-pro

| Token Range | Input | Input (Cached) | Output |
|-------------|-------|----------------|--------|
| 0 < Token ≤ 256K | $1.00/1M | $0.20/1M | $3.00/1M |
| 256K < Token ≤ 1M | $2.00/1M | $0.40/1M | $6.00/1M |

### 单次迭代成本计算

```
本轮成本 = (input_tokens × input_rate) + (output_tokens × output_rate)
```

### 成本指标

| 指标 | 定义 | 用途 |
|------|------|------|
| **轮次成本** | 单次迭代的 token 费用 | 控制单轮开销 |
| **累计成本** | Sprint 内所有迭代成本总和 | 预算跟踪 |
| **单位交付成本** | 累计成本 / 已完成任务数 | 效率评估 |
| **预算偏差率** | (实际 - 预算) / 预算 × 100% | 预算健康度 |
| **上下文效率** | 完成任务数 / 消耗轮次 | 投入产出比 |

### 成本控制规则

| 规则 | 触发条件 | 动作 |
|------|----------|------|
| 单轮成本上限 | >$2.00/轮 | 警告，考虑降级模型 |
| 累计预算红线 | 达预算 80% | PM 暂停非 P0 任务 |
| 预算超支 | >预算 100% | 停止，需用户批准继续 |
| 效率低下 | 上下文效率 <1 任务/轮 | 重新评估任务拆分 |

### Sprint 预算模板

```
Sprint: [sprint-name]
Model: xiaomi/mimo-v2-pro
Input Rate:    $1.00/1M tokens (≤256K range)
Output Rate:   $3.00/1M tokens (≤256K range)
Cached Input:  $0.20/1M tokens (≤256K range)
[256K-1M range: 2x above rates]

Budget Total:  $X.XX
Actual Cumul:  $X.XX
Variance:      ±X%
```

> See `cost_tracker.md` for full budget details and historical log.

### Report 模板更新 (Cost Section)

每个 Day Report 必须包含：
```markdown
## Cost (本轮成本)
| 指标 | 值 |
|------|-----|
| Input Tokens | ~X,XXX |
| Output Tokens | ~X,XXX |
| 本轮费用 | $X.XX |
| 累计费用 | $X.XX / $XX.XX (预算) |
| 上下文效率 | N 任务 / M 轮 |
| 预算偏差率 | ±X% |
| 状态 | ✅ 正常 / ⚠️ 接近红线 / 🔴 超支 |
```

---

## Activation
在会话开始时，PM 声明：
```
PM Sprint Iteration: Day N 开始
读取上轮报告: [文件名]
总计划阶段: [当前阶段]
本轮预算: 5-7 轮
成本累计: $X.XX / $X.XX (预算)
```

---

## Lessons Learned (实战经验)

### 1. 项目目录分离原则
- **数据管道 + Python 环境** → 独立目录 (如 `Toy Legion/`)
- **前端 App 项目** → 干净目录 (如 `Toy_Genius_App/`)
- 仅搬运 Sprint 必需的文件，不全量迁移
- PM 迭代路径必须在同一目录内，避免跨目录读取

### 2. Stitch 项目生命周期
- 框架变更时 **必须新建** Stitch 项目，不修改旧项目
- 旧项目归档备查
- 新项目名建议: `{Product} {Version}` (如 "Toy Legion V1")
- Design System 应用可能因 MCP 超时失败 → 标记 Day+1 重试

### 3. 成本追踪必须内嵌
- 启动会议 token 消耗约 2-3x 日常迭代 (大量讨论+文档生成)
- 日常迭代每轮 ~$0.014 (MiMo v2-pro, ≤256K range)
- Report 不含 Cost 段落 = 不完整

### 4. 上下文耗尽风险
- 实际测试: 启动会议 ~15+ 轮即触发 context compaction
- 50% 安全线 (10 轮) 略高 → 实际建议 **7-8 轮为硬上限**
- 遇到 compaction 时: 接受压缩，基于 summary 继续，不重复工作
