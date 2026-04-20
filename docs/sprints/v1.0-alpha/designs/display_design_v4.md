# Toy Legion V1 - 团队四次讨论：安全认证详情页设计
**Date**: 2026-04-18 | **Participants**: Backend / Frontend / UX Designer

---

## 前置信息

### UI设计框架 (从5张Mockup提取)

已确认的设计语言：
- **雷达图**: 8维度能力展示，几乎所有页面都用
- **卡牌翻转**: 正面(图+名+评分) → 背面(详细数据)
- **分数贡献**: 每个产品的 `+25`、`+15` 式贡献分展示
- **AI洞察**: 自然语言分析段落
- **年龄段滚动**: 按年龄阶段组织的路线图

### product_safety_certificates 表列清单

| 列名 | 类型 | 内容说明 | 确定用途 |
|------|------|---------|---------|
| product_id | uuid | FK | 内部 |
| product_name | text | 产品名 (冗余) | ❌ 不需要 |
| brand_name | text | 品牌名 (冗余) | ❌ 不需要 |
| ai_confidence_score | smallint | 0-100综合安全分 | ✅ 核心显示 |
| age_grade_verified | text | 年龄分级 ("4+") | ❌ products表已有 |
| certifications | jsonb | 认证列表 | ✅ 核心显示 |
| user_feedback_analysis | jsonb | 用户反馈分析 | 🔐 付费 |
| cross_validation | jsonb | 交叉验证 | 🔐 付费 |
| confidence_adjustment_reason | text | 评分调整理由 | 🔐 付费 |
| notes | text | 详细安全分析 | 🔐 付费 |
| references | jsonb | 参考来源 | ❌ 暂不需要 |
| token_count | jsonb | token消耗 | ❌ 不需要 |
| ai_model | text | AI模型名 | ❌ 不需要 |
| created_at | timestamp | 创建时间 | ❌ 不需要 |
| updated_at | timestamp | 更新时间 | ❌ 不需要 |

---

## UX团队方案：安全认证详情页设计

### 信息层级划分

```
第一层 (免费 - 一目了然)
├── 综合安全分 (0-100 大数字+颜色条)
├── 年龄分级 (来自products表, 非本表)
└── 认证标准名列表 (CPSIA, ASTM F963, EN71...)

第二层 (免费 - 稍多信息)
├── 各认证的合规状态 (certified / self_declared / tested)
└── 用户反馈概要 (安全评价数, 整体情绪)

第三层 (付费 🔐 - 深度信息)
├── 各认证的独立置信度 + 证据链接
├── 用户反馈详情 (安全提及原文, 常见问题)
├── 交叉验证 (召回历史, CPSC投诉)
├── 评分调整理由 (AI解释为什么给这个分)
└── 完整安全分析文本
```

### 详情页布局方案

```
┌─────────────────────────────────────────────────┐
│  [← 返回]              Product Detail            │
├─────────────────────────────────────────────────┤
│  [产品图片]                                       │
│  Product Name                                    │
│  Brand | $29.99 | Ages 3+                        │
├─────────────────────────────────────────────────┤
│  ┌─── Capability Profile ───────────────────┐   │
│  │  ┌─ Radar ─┐   Base Score: 72/100       │   │
│  │  │ 8D chart│   ▇▇▇▇▇▇▇▇▇▇▇▇▇ 72        │   │
│  │  │         │                             │   │
│  │  └─────────┘   Top Tags:                 │   │
│  │                [Physical Safety] [Fine   │   │
│  │                 Motor] [Creative Constr] │   │
│  └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│  📝 About This Toy                     (免费)    │
│  ┌──────────────────────────────────────────┐   │
│  │  "Elevate your collection with this      │   │
│  │   meticulously crafted..."               │   │
│  │  [Show More ▾]                           │   │
│  └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│  🛡️ Safety Profile                       (免费)  │
│  ┌──────────────────────────────────────────┐   │
│  │  ┌─────────────────────────────────┐     │   │
│  │  │   95          Safety Score      │     │   │
│  │  │  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ (绿条)    │     │   │
│  │  └─────────────────────────────────┘     │   │
│  │                                           │   │
│  │  Certifications:                          │   │
│  │  ┌──────────────┐ ┌──────────────┐       │   │
│  │  │ CPSIA  ✓     │ │ ASTM F963 ✓  │       │   │
│  │  │ certified    │ │ tested       │       │   │
│  │  └──────────────┘ └──────────────┘       │   │
│  │  ┌──────────────┐                        │   │
│  │  │ EN71    ✓    │                        │   │
│  │  │ certified    │                        │   │
│  │  └──────────────┘                        │   │
│  │                                           │   │
│  │  User Reviews: 128 analyzed               │   │
│  │  Safety Sentiment: 😊 Positive            │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  🔓 Unlock Full Safety Report         🔐 │   │
│  │  • Detailed analysis & evidence links    │   │
│  │  • CPSC complaint history                │   │
│  │  • Recall check & cross-validation       │   │
│  │  • AI confidence breakdown               │   │
│  │           [Unlock with Premium]           │   │
│  └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│  📈 Age Performance Curve                 (付费)  │
│  [15-point line chart with base reference]       │
├─────────────────────────────────────────────────┤
│  [➕ Add to Slot]                                 │
└─────────────────────────────────────────────────┘
```

### 付费解锁后展开的内容

```
┌─────────────────────────────────────────────────┐
│  🛡️ Full Safety Report                         │
│  ─────────────────────────────────────────────  │
│                                                  │
│  📋 Detailed Analysis                            │
│  "Melissa & Doug states compliance with US,     │
│   EU, and other international safety            │
│   regulations including CPSIA, and conducts     │
│   testing for heavy metals, lead, and           │
│   phthalates. The product includes plastic      │
│   child-safe scissors..."                       │
│                                                  │
│  ⚠️ Community Notes                              │
│  "A Reddit discussion from January 2025         │
│   mentioned Melissa & Doug toys testing         │
│   positive for lead using home swabs, but       │
│   the accuracy was disputed..."                 │
│                                                  │
│  🔍 Cross-Validation                             │
│  ├── Recall History: No recalls found           │
│  ├── CPSC Complaints: 0                         │
│  └── Official vs Feedback: ✓ Consistent         │
│                                                  │
│  📊 AI Confidence Breakdown                      │
│  ├── CPSIA:     80% (self_declared)             │
│  ├── ASTM F963: 80% (self_declared)             │
│  ├── EN71:      80% (self_declared)             │
│  └── FSC:       90% (certified)                 │
│                                                  │
│  💡 Scoring Rationale                            │
│  "The base score is high due to explicit        │
│   statements of compliance. A +10 adjustment    │
│   for absence of CPSC complaints. Capped at     │
│   95 because general brand-level concerns       │
│   exist..."                                     │
│                                                  │
│  🔗 Evidence Sources (4 links)                   │
│  • melissaanddoug.com/pages/safety              │
│  • melissaanddoug.com/pages/product-compliance  │
│  • [2 more sources]                             │
└─────────────────────────────────────────────────┘
```

---

## certifications JSONB 字段解析

每个认证对象结构：
```json
{
  "standard": "CPSIA",           // 认证标准名
  "scope": "chemical safety",    // 覆盖范围
  "confidence": 80,              // AI对该认证的置信度
  "compliance_status": "self_declared",  // 合规状态
  "cert_unit": null,             // 证书编号
  "evidence_url": "https://..."  // 证据链接(可能很长)
}
```

### compliance_status 含义与显示

| 状态 | 含义 | 显示方式 |
|------|------|---------|
| certified | 第三方认证通过 | ✅ Certified |
| tested | 品牌自测 | ✓ Tested |
| self_declared | 品牌声明 | ⚡ Declared |
| self_declared\|tested | 声明+自测 | ✓ Tested |

---

## Backend: v_product_detail 视图设计

```sql
CREATE OR REPLACE VIEW v_product_detail AS
SELECT
  -- 产品基础 (来自products + brands)
  p.id, p.name_display, p.image_url, p.age_min_yr, p.age_max_yr,
  p.price_tier, p.scraped_price, p.product_category, p.material,
  p.play_pattern, p.gender_preference, p.safety_concern,
  b.name AS brand_name,

  -- 物化视图预计算列
  mv.base_score, mv.d_safety, mv.d_education, mv.d_sensory, mv.d_motor,
  mv.d_language, mv.d_creativity, mv.d_science, mv.d_emotions,
  mv.top_tag_ids,
  mv.slot_0_1, mv.slot_1_2, mv.slot_2_3, mv.slot_3_4, mv.slot_4_5,
  mv.slot_5_6, mv.slot_6_7, mv.slot_7_8, mv.slot_8_9, mv.slot_9_10,
  mv.slot_10_11, mv.slot_11_12, mv.slot_12_13, mv.slot_13_14, mv.slot_14_15,

  -- AI描述 (免费, 长文本)
  pad.ai_description,

  -- === 安全认证 ===

  -- 免费层
  psc.ai_confidence_score AS safety_score,
  -- 认证名+状态列表 (免费)
  (SELECT jsonb_agg(jsonb_build_object(
    'name', cert->>'standard',
    'status', cert->>'compliance_status'
  ))
   FROM jsonb_array_elements(psc.certifications) cert
  ) AS certifications_summary,
  -- 用户反馈概要 (免费)
  (psc.user_feedback_analysis->>'total_reviews_analyzed')::int AS safety_review_count,
  psc.user_feedback_analysis->>'overall_safety_sentiment' AS safety_sentiment,

  -- 付费层 (应用层检查订阅后访问)
  psc.notes AS safety_notes,
  psc.certifications AS safety_cert_details,
  psc.user_feedback_analysis AS safety_feedback_detail,
  psc.cross_validation AS safety_cross_validation,
  psc.confidence_adjustment_reason AS safety_scoring_rationale,

  -- 布尔标记
  (psc.product_id IS NOT NULL) AS has_safety_data,
  (psc.notes IS NOT NULL) AS has_premium_safety

FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
JOIN mv_product_browse mv ON mv.id = p.id
LEFT JOIN product_ai_descriptions pad ON pad.product_id = p.id
LEFT JOIN product_safety_certificates psc ON psc.product_id = p.id
WHERE p.is_active = true;
```

---

## 确认事项

1. **免费/付费划分是否合理**？
   - 免费: 综合分 + 认证名+状态 + 用户反馈数+情绪
   - 付费: 详细分析文本 + 证据链接 + 交叉验证 + 评分理由

2. **certifications_summary 的显示格式**？
   - 方案A: 药丸按钮 (CPSIA ✓ | ASTM ✓ | EN71 ✓)
   - 方案B: 列表 (CPSIA - Certified / ASTM - Tested / EN71 - Declared)
   - 方案C: 图标网格

3. **没有安全数据的产品如何显示**？
   - 方案A: 隐藏整个 Safety Profile 区块
   - 方案B: 显示 "Safety data not available" 占位
   - 方案C: 只显示32D的d_safety基础安全分

4. **compliance_status 的中文映射**？
   - US市场是英文，但需确认状态显示文案

---

*Generated by Toy Legion Virtual Team - 2026-04-18 4th Round*
