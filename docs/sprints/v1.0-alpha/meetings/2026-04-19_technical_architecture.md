# Toy Legion V1 — 团队会议报告
## Supabase 架构设计 & 前端数据方案

**日期**: 2026-04-18  
**参与角色**: Backend Architect / Frontend Engineer / Data Analyst / UX Designer  
**项目**: Toy Legion — AI-Powered Toy Recommendation App  
**数据库**: Supabase Cloud (xiqtqckaztkugthlzwri, ap-northeast-1, PostgreSQL 17)

---

## 一、项目现状总览

### 1.1 数据资产

| 数据类型 | 数量 | 状态 |
|---------|------|------|
| 产品 (products) | 10,597 | ✅ 已入库 |
| 品牌 (brands) | 892 | ✅ 已入库 |
| 32D评分 (age_stage_capability) | 10,597 | ✅ 15个年龄段预计算 |
| AI描述 (product_ai_descriptions) | 10,597 | ✅ 100%覆盖 |
| 安全认证 (product_safety_certificates) | 1,526 | ⏳ 14.4%覆盖，待补充 |
| 场景标签 (scene_tags_config) | 100 | 📦 前端打包JSON |
| 发育里程碑 (growth_milestones) | 113 | ✅ 已入库 |

### 1.2 已创建的数据库对象

**表 (13张)**:

| 表名 | 类型 | 用途 |
|------|------|------|
| products | 产品数据 | 核心产品信息 |
| brands | 品牌数据 | 品牌元信息 |
| age_stage_capability | 评分数据 | 32D预计算分数×15年龄段 |
| product_ai_descriptions | AI生成 | 产品长文本描述 |
| product_safety_certificates | AI生成 | 安全认证信息 |
| data_age_stage_weights | 配置 | V3权重矩阵 |
| roadmaps | 缓存 | AI生成的路线图 |
| ingestion_logs | 管道 | 数据抓取日志 |
| user_profiles | 用户 | 消费者档案+订阅 |
| children | 用户 | 儿童档案 |
| slot_plans | 用户 | 插槽规划 |
| saved_items | 用户 | 通用收藏 |
| growth_milestones | 配置 | 113个发育里程碑 |
| user_milestones | 用户 | 用户解锁记录 |

**视图 (2个)**:

| 视图 | 类型 | 查询速度 | 用途 |
|------|------|---------|------|
| mv_product_browse | 物化视图 | <1ms | 浏览页+插槽页 |
| v_product_detail | 普通视图 | ~15ms | 产品详情页 |

**函数 (2个)**:
- `refresh_mv_browse()` — 每月数据抓取后刷新物化视图
- `calc_age_penalty(age_min, midpoint)` — 年龄惩罚计算，物化视图预计算slot分数时调用

---

## 二、核心架构决策

### 2.1 分数体系

#### 浏览页分数 (与年龄无关)

```
base_score = AVG(confidence[i]) × 100   (i = scored_tags中所有标签)
8D_score[j] = SUM(confidence[i in group j]) × 100 / 32   (j = 8个大类)
```

- 基于AI原始置信度，不含年龄权重
- 用户先看到产品的"固有属性"
- 不显示真实数字，用定性标签 (Strong/Good/Emerging)

#### 插槽页分数 (与年龄相关，含惩罚预计算)

```
slot_score = SUM(stage_X_Y) × calc_age_penalty(age_min, midpoint)
```

- `calc_age_penalty` 是一个SQL函数，在物化视图中直接调用
- 年龄惩罚已预计算进 slot_0_1 ~ slot_14_15 列
- 前端直接取值显示，无需实时计算 penalty
- 例: age_min=2 的产品在 stage 9-10 时，惩罚系数=0.3，slot_9_10 = weighted_sum × 0.3

#### 组合分数

```
combo_score = avg(slot_scores) × composite_index / 100

composite_index = balance × 0.4 + diversity × 0.25 + price × 0.2 + safety × 0.15
```

- balance 含 TBF (场景标签偏置)，前端实时计算
- safety 优先用 `safety_certs.ai_confidence_score`，无数据回退32D
- 全部客户端完成，无需API调用

#### 付费分数曲线

```
实线: slot_score (15个点, 已含惩罚, 预计算在MV中)
虚线: base_score (恒定参照线)
```

- slot_0_1 ~ slot_14_15 已经是最终分数(含权重+惩罚)，前端直接画图
- 不再需要前端乘 age_penalty

### 2.2 物化视图 vs 普通视图

| 维度 | mv_product_browse (物化) | v_product_detail (普通) |
| 查询速度 | <1ms | ~15ms |
| 数据新鲜度 | 月度刷新 | 实时 |
| 存储 | ~15MB | 无 |
| 用途 | 浏览+插槽+曲线 | 详情页 |

**原则**: 高频、性能敏感用物化视图；低频、数据实时性用普通视图。

### 2.3 图片策略

```
前端拼接URL: {SUPABASE_URL}/storage/v1/object/public/product-images/{product_id}/300.png
品牌Logo:    {SUPABASE_URL}/storage/v1/object/public/brand-logos/{brand_id}/logo.png
```

- 存储桶已有多尺寸图片 (300/600/1000/original)
- 视图不存储图片URL，前端用product_id拼接
- 不消耗 Supabase image transform 额度
- fallback: 原始 `products.image_url` (JSONB数组)

### 2.4 里程碑存储

- 放数据库，不放客户端
- 理由：未来扩展包需动态新增，通过 `pack_id` 区分
- 客户端 `GET /rest/v1/growth_milestones` 拉取配置
- 评估逻辑在客户端完成（拿到condition JSON后本地计算）

---

## 三、前端页面数据架构

### 3.1 页面流

```
Browse → Detail → Scene Select → Slot Plan → Achievements
```

### 3.2 各页面数据源

| 页面 | API | 数据 | 延迟 |
|------|-----|------|------|
| Browse (浏览) | GET /rest/v1/mv_product_browse | 20条产品+分数+标签 | <1ms |
| Detail (详情) | GET /rest/v1/mv_product_browse?id=X | 预计算分 | <1ms |
|  | GET /rest/v1/v_product_detail?id=X | AI描述+安全 | ~15ms |
| Scene Select | 前端本地JSON | 100个场景标签 | 0ms |
| Slot Plan | GET /rest/v1/slot_plans?user_id=X | 用户规划 | ~10ms |
|  | GET /rest/v1/mv_product_browse?select=slot_X_Y&id=in.(...) | 预计算分数(含惩罚) | <1ms |
|  | 客户端计算 | combo_score (TBF+组合质量) | <1ms |
| Roadmap | GET /rest/v1/roadmaps | 生成结果 | ~10ms |
| Profile | GET /rest/v1/user_profiles?id=X | 用户信息 | ~5ms |
| Children | GET /rest/v1/children?user_id=X | 儿童列表 | ~5ms |
| Milestones | GET /rest/v1/growth_milestones | 里程碑配置 | ~5ms |
| User Milestones | GET /rest/v1/user_milestones?user_id=X | 已解锁 | ~5ms |
| Saved | GET /rest/v1/saved_items?user_id=X | 收藏列表 | ~5ms |
| Premium Check | user_profiles.subscription_tier | free/premium | 已在Profile中 |

### 3.3 产品卡片显示方案

| 场景 | 显示内容 | 不显示 |
|------|---------|--------|
| 浏览卡片 | 图片+名称+品牌+base_score+Top2 8D+Top3标签 | 年龄惩罚、slot分数 |
| 插槽-槽位中 | 图片+名称截断+slot_score(动态) | base_score、8D、标签 |
| 插槽-点击弹窗 | 图片+8D雷达图+各年龄段分数列表 | AI描述、安全 |
| 插槽-翻转背面 | Top6标签+年龄+价格+品类 | 分数、图片 |

### 3.4 详情页布局

```
1. Capability Profile (雷达图/base_score/top_tags)
2. Age Performance Curve (付费, 15-point line chart)
3. About This Toy (AI描述)
4. Safety Profile (安全认证, 分免费/付费)
5. [Add to Slot]
```

---

## 四、安全认证显示方案

### 4.1 数据来源

`product_safety_certificates` 表，AI互联网搜索分析生成。

### 4.2 不需要的列

`token_count`, `age_grade_verified`(products表已有), `ai_model`, `product_name`, `brand_name`(冗余), `references`, `cert_unit`(98.5%为空), `created_at`, `updated_at`

### 4.3 免费/付费划分

**免费层**:
- `ai_confidence_score` (0-100综合分)
- `certifications[].standard` + `certifications[].compliance_status`
- `user_feedback_analysis.total_reviews_analyzed` + `overall_safety_sentiment`

**付费层** 🔐:
- `notes` (完整安全分析文本)
- `certifications[].confidence` + `certifications[].evidence_url`
- `user_feedback_analysis` (详细反馈)
- `cross_validation` (召回历史、CPSC投诉)
- `confidence_adjustment_reason` (AI评分理由)

### 4.4 视图实现

`v_product_detail` 直接暴露原始JSONB字段，前端自行解析：
```typescript
// 免费层
const certNames = data.certifications?.map(c => ({
  name: c.standard,      // "CPSIA"
  status: c.compliance_status  // "certified"
}));

// 付费层 (检查订阅后)
if (isPremium) {
  const notes = data.safety_notes;
  const details = data.safety_cert_details;
}
```

---

## 五、数据库安全

### 5.1 RLS策略

| 表 | 策略 |
|----|------|
| user_profiles | 用户仅读写自己 |
| children | 用户仅操作自己的儿童 |
| slot_plans | 用户仅操作自己的规划 |
| saved_items | 用户仅操作自己的收藏 |
| user_milestones | 用户仅读写自己的解锁记录 |
| growth_milestones | 所有人可读 |
| products等产品表 | 所有人可读 |

### 5.2 订阅控制

- `user_profiles.subscription_tier` = 'free' | 'premium'
- `subscription_expires_at` 控制到期
- 前端读取字段判断，不依赖后端鉴权

### 5.3 Auth集成

- `create_user_profile()` 函数已创建
- 注册时自动创建 `user_profiles` (需Dashboard配置trigger)

---

## 六、数据管道

### 6.1 月度流程

```
本地Python → 数据抓取 → 上传products/age_stage_capability
         → n8n批量 → AI描述 + 安全认证
         → SQL → REFRESH MATERIALIZED VIEW mv_product_browse
```

### 6.2 刷新命令

```sql
SELECT refresh_mv_browse();  -- 无锁刷新(CONCURRENTLY)
```

---

## 七、待办事项

| 优先级 | 事项 | 状态 |
|--------|------|------|
| P0 | Dashboard配置 auth.users trigger | 待操作 |
| P0 | 前端框架选型 (React Native recommended) | 待决策 |
| P0 | 安全认证数据补充 (14.4%→目标50%+) | 按需补充 |
| P1 | growth_milestones.description 从Excel导入 | 待补充 |
| P1 | 前端图片fallback逻辑实现 | 待开发 |
| P1 | RLS安全策略加固 (现有产品表也需RLS) | 待执行 |
| P2 | 扩展包里程碑设计 (新scene_tags系列) | V2规划 |

---

## 八、附件

本次讨论过程中生成的文档：

| 文档 | 内容 |
|------|------|
| docs/V1_Supabase_Assessment.md | 初始评估报告 |
| docs/V1_Display_Design_Discussion.md | 第一轮显示方案讨论 |
| docs/V1_Display_Design_Discussion_v2.md | 用户视角修正讨论 |
| docs/V1_Display_Design_Discussion_v3.md | 页面设计与数据架构讨论 |
| docs/V1_Display_Design_Discussion_v4.md | 安全认证详情页设计 |
| docs/V1_User_Tables_Discussion.md | 用户侧表架构讨论 |
| sql/update_weights_from_json.sql | 权重同步脚本 |

---

*Toy Legion Virtual Team — 2026-04-18*
*Backend Architect | Frontend Engineer | Data Analyst | UX Designer*
