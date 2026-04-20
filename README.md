# Toy Genius App
> AI-Powered Toy Recommendation App for Parents

---

## Project Structure

```
Toy_Genius_App/
├── README.md
├── docs/
│   ├── reference/              # Reference materials
│   │   ├── data/               #   Tags, weights, matrices
│   │   ├── design/             #   Design specs, UI sketches
│   │   └── specs/              #   Version roadmap, API specs
│   └── sprints/
│       └── v1.0-alpha/
│           ├── plan.md                    # Sprint plan (PM entry point)
│           ├── iteration_skill.md         # PM closed-loop iteration protocol
│           ├── reports/                   # Day reports (PM output each round)
│           │   ├── day1_report.md
│           │   └── dayN_report.md ...
│           ├── meetings/                  # Team meeting records
│           │   └── 2026-04-19_*.md
│           └── designs/                   # Design discussions & specs
│               ├── display_design_v4.md
│               └── frontend_display_plan.md
└── src/                        # App source code (Expo)
    └── (to be initialized)
```

---

## PM Iteration Path (闭环迭代路径)

PM 每轮迭代读取顺序：
```
1. docs/sprints/v1.0-alpha/plan.md                  ← 总计划
2. docs/sprints/v1.0-alpha/reports/dayN.md          ← 上次报告
3. 规划 → 分配 → 执行
4. docs/sprints/v1.0-alpha/reports/dayN+1.md        ← 本轮报告 (输出)
```

---

## Quick Links

| Document | Path |
|----------|------|
| Sprint Plan | `docs/sprints/v1.0-alpha/plan.md` |
| PM Iteration Protocol | `docs/sprints/v1.0-alpha/iteration_skill.md` |
| Version Roadmap | `docs/reference/specs/v1_app_version_roadmap.md` |
| Design Spec v4 | `docs/sprints/v1.0-alpha/designs/display_design_v4.md` |

---

## Data Backend

产品数据和数据库仍在原项目：
- **Database**: Supabase Cloud (project: xiqtqckaztkugthlzwri)
- **Data Pipeline**: `/mnt/d/Docker/Toy Legion/` (Python environment)
- **Products**: 10,597
- **MV**: `mv_product_browse`, `v_product_detail`
