# 团队会议: 视图架构讨论 — mv_product_browse vs v_product_detail
> PM 主持 | 2026-04-22
> 参与角色: PM / DA / FE / BA (UXD 可选)

---

## 议题

**问题**: Detail 页面需要同时使用 `mv_product_browse` (8D 分数) 和 `v_product_detail` (image_url, ai_description) 的字段，但这两个视图的数据来源和计算方式不同，如何合理分配字段以平衡性能和功能？

---

## 现状分析 (DA 调研)

### mv_product_browse (物化视图)
- **类型**: Materialized View (预计算, 磁盘存储)
- **行数**: 10,597
- **单行查询**: 0.123ms (Index Scan)
- **数据来源**: products + brands + age_stage_capability + 复杂 CTE 计算 8D 分数 + tag 排名
- **刷新**: 手动 REFRESH MATERIALIZED VIEW (autovacuum 管理统计)
- **优势**: 读取极快, 不需要实时计算
- **劣势**: 数据有延迟 (需手动刷新), 不含 image_url / ai_description

### v_product_detail (普通视图)
- **类型**: Regular View (实时计算)
- **单行查询**: 0.250ms (Nested Loop + Index Scan)
- **数据来源**: products + brands + product_ai_descriptions + product_safety_certificates
- **优势**: 实时数据, 含 AI 描述 + 安全证书
- **劣势**: 不含 8D 分数 / base_score / top_tag_ids / slot 分数

### 当前问题
```
mv_product_browse 有 ──────────────────────────────────────────┐
  ✅ base_score                                                │
  ✅ d_safety, d_education, ..., d_emotions (8D)              │ 缺少这些
  ✅ top_tag_ids, slot_X_Y 分数                               │ Detail 需要
  ✅ product_category, material, play_pattern                 ┘

v_product_detail 有 ───────────────────────────────────────────┐
  ✅ image_url                                                 │ 缺少这些
  ✅ ai_description                                            │ Browse 不需要
  ✅ safety_score, certifications, safety_notes                │ 但 Detail 需要
  ✅ cross_validation, user_feedback_analysis                 ┘
```

---

## 设计原则 (PM 提出)

1. **Browse 页面** → 必须用物化视图 (10K 行分页加载, 需要亚秒响应)
2. **Detail 页面** → 可以用普通视图 (单条查询, 250ms 可接受)
3. **物化视图不膨胀** — 只存 Browse 列表需要的字段, 避免 REFRESH 成本上升
4. **Detail 字段完整** — 用户打开详情页需要看到所有信息

---

## 方案对比

### 方案 A: 扩展 v_product_detail (推荐 ⭐)

**做法**: 修改 `v_product_detail` 视图定义, JOIN `mv_product_browse` 获取 8D 分数

```sql
CREATE OR REPLACE VIEW v_product_detail AS
SELECT
  p.id, p.name_display, p.image_url,
  p.age_min_yr, p.age_max_yr, p.price_tier, p.scraped_price,
  p.product_category, p.material, p.play_pattern, p.gender_preference,
  p.safety_concern,
  b.name AS brand_name,
  pad.ai_description,
  psc.ai_confidence_score AS safety_score,
  psc.certifications,
  psc.user_feedback_analysis,
  psc.cross_validation,
  psc.notes AS safety_notes,
  psc.confidence_adjustment_reason AS safety_scoring_rationale,
  psc.product_id IS NOT NULL AS has_safety_data,
  -- 从物化视图拿 8D 分数
  mv.base_score,
  mv.d_safety, mv.d_education, mv.d_sensory, mv.d_motor,
  mv.d_language, mv.d_creativity, mv.d_science, mv.d_emotions,
  mv.top_tag_ids
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN product_ai_descriptions pad ON pad.product_id = p.id
LEFT JOIN product_safety_certificates psc ON psc.product_id = p.id
LEFT JOIN mv_product_browse mv ON mv.id = p.id
WHERE p.is_active = true;
```

| 维度 | 评估 |
|------|------|
| 性能 | 预计 ~0.3-0.5ms (多一个 Index Scan on mv) |
| 改动范围 | 只改 SQL 视图, 前端代码不变 |
| 数据一致性 | Detail 页的分数与 Browse 页一致 (同一数据源) |
| 刷新延迟 | 分数跟随 mv_product_browse 刷新节奏 |
| 复杂度 | 低 |

### 方案 B: 两次查询 (FE 端合并)

**做法**: Detail 页面先查 `mv_product_browse` 拿分数, 再查 `v_product_detail` 拿其他字段

| 维度 | 评估 |
|------|------|
| 性能 | 2 次网络请求 (~250ms × 2 + 网络延迟) |
| 改动范围 | 修改 detail/[id].tsx 的 loadProduct 函数 |
| 数据一致性 | 可能出现短暂不一致 (两次刷新间隔) |
| 复杂度 | 中 (需要 FE 合并逻辑) |

### 方案 C: 扩展 mv_product_browse

**做法**: 把 image_url, ai_description, safety 信息也加入物化视图

| 维度 | 评估 |
|------|------|
| 性能 | Browse 列表加载变慢 (每行数据量增大 ~3x) |
| 刷新成本 | REFRESH 时间变长 (ai_description 是大文本) |
| 数据新鲜度 | AI 描述/安全证书更新需等 REFRESH |
| **不推荐** | 违反"物化视图不膨胀"原则 |

---

## PM 建议

**推荐方案 A** — 理由:
1. 最小改动 (纯 SQL, 前端零修改)
2. Detail 页面仍为单次查询 (网络延迟最小化)
3. 8D 分数来源唯一 (mv), 保证 Browse/Detail 数据一致
4. 不膨胀物化视图, Browse 性能不受影响

**风险**: v_product_detail 的查询时间从 0.25ms → 预计 0.3-0.5ms, 仍在可接受范围。

---

## 待团队确认

- [ ] DA: 确认 LEFT JOIN mv_product_browse 的查询计划 (EXPLAIN ANALYZE)
- [ ] FE: 确认前端代码不需要改动 (字段名对齐)
- [ ] BA: 确认数据延迟策略 (mv 刷新频率)
- [ ] PM: 最终决策签字

---

## Action Items

| # | 任务 | Owner | 优先级 |
|---|------|-------|--------|
| 1 | 执行方案 A — 修改 v_product_detail 视图 | DA | P0 |
| 2 | 验证 Detail 页面 8D 分数正常显示 | FE | P0 |
| 3 | 确定 mv_product_browse 定期刷新策略 | DA | P1 |
| 4 | 更新 v_milestone_toys 聚合视图 (Issue #2) | DA | P1 |
