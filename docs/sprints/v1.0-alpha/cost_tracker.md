# V1.0-alpha Sprint — Cost Tracker
> PM 成本追踪 | 持续更新

---

## Model Rate Card — Xiaomi MiMo v2-pro

| Token Range | Input | Input (Cached) | Output |
|-------------|-------|----------------|--------|
| 0 < Token ≤ 256K | $1.00/1M | $0.20/1M | $3.00/1M |
| 256K < Token ≤ 1M | $2.00/1M | $0.40/1M | $6.00/1M |

> Source: User confirmed rates (2026-04-22)

---

## Sprint Budget

```
Sprint:        V1.0-alpha
Model:         xiaomi/mimo-v2-pro
Input Rate:    $1.00/1M tokens (≤256K range)
Output Rate:   $3.00/1M tokens (≤256K range)
Cached Input:  $0.20/1M tokens (≤256K range)
```

### Budget Estimation (预算估算)

假设每次迭代 (Day) ~5 轮对话，每轮 ~8K input + ~2K output tokens：

| 项目 | 估算 |
|------|------|
| 每轮 input tokens | ~8,000 |
| 每轮 output tokens | ~2,000 |
| 每轮 input 成本 | 8,000 × $1.00/1M = $0.008 |
| 每轮 output 成本 | 2,000 × $3.00/1M = $0.006 |
| **每轮总成本** | **~$0.014** |
| 每 Day (5 轮) | ~$0.07 |
| **V1-alpha Sprint (假设 6 Days)** | **~$0.42** |

> 以上为保守估算。复杂迭代（多工具调用、大文件读取）可能 2-3x。
> 启动会议含大量上下文，可能进入 256K-1M 区间（费率 2x）。

---

## Actual Cost Log (实际费用)

| Day | Iteration | Input Tokens | Output Tokens | Cost | Cumulative | Tasks Done | Efficiency |
|-----|-----------|-------------|--------------|------|------------|------------|------------|
| 1 | R1 | ~25,000 | ~8,000 | $0.049 | $0.049 | 2 | 0.4 |
| - | - | - | - | - | - | - | - |
| - | - | - | - | - | - | - | - |

> **Day 1 估算**: 本会话为启动会议，含大量讨论和文件生成，token 消耗高于日常迭代。
> Rate used: ≤256K range ($1.00 input, $3.00 output)

---

## Cost Health Dashboard

| Metric | Value | Status |
|--------|-------|--------|
| Budget Total | $0.42 (估) | — |
| Actual Cumulative | $0.049 | ✅ 12% |
| Budget Variance | -$0.371 | ✅ Under |
| Avg Cost/Iteration | $0.049 | ✅ |
| Avg Tasks/Iteration | 2 | ✅ |
| Efficiency (tasks/round) | 0.4 | ⚠️ 启动轮偏低，后续应 >1 |

---

## Cost Control Triggers

| Trigger | Threshold | Action |
|---------|-----------|--------|
| 单轮成本 | >$0.05 | ⚠️ 警告 — 考虑拆分任务 |
| 累计达预算 80% | >$0.34 | 🟡 暂停非 P0 |
| 累计超预算 100% | >$0.42 | 🔴 停止，需用户批准 |
| 效率 <1 任务/轮 | 连续 2 轮 | ⚠️ 重新评估任务粒度 |

---

## Notes

- 启动会议 (Kickoff) 通常消耗较高，因为包含大量讨论和文档生成
- 后续日常迭代 token 消耗应显著降低（读报告1轮+执行2-3轮+报告1轮）
- 如果小米 MiMo 费率更低，Sprint 总成本可能 < $0.10
- 建议在轻量迭代中使用 mimo-v2-flash 降低成本
