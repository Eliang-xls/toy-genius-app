# HOME_001 Design Specification — Browse Screen
> PM/UXD | 2026-04-22
> Stitch fallback: manual RN component spec

---

## Screen Purpose
Product discovery — first impression. User browses toys filtered by age-stage, sorted by AI score.

## Layout Structure

```
┌──────────────────────────────────┐
│ [Logo]  Toy Legion     [🔍 Filter]│  ← Top Bar (56px)
├──────────────────────────────────┤
│ [All][0-1][1-3][3-5][5-8][8+]   │  ← Age Stage Filter Pills (44px)
├──────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐       │
│ │  [Image]  │ │  [Image]  │       │
│ │  Name     │ │  Name     │       │  ← Product Grid (2-col)
│ │  ⭐ 87.3  │ │  ⭐ 72.1  │       │     Cards: 170x220
│ │  $19.99   │ │  $34.99   │       │
│ │  [AgeBadge]│ │ [AgeBadge]│       │
│ └──────────┘ └──────────┘       │
│ ┌──────────┐ ┌──────────┐       │
│ │  ...      │ │  ...      │       │
│ └──────────┘ └──────────┘       │
│                                  │
│          [Load More]             │
├──────────────────────────────────┤
│ [🏠 Home] [📊 Milestone] [👤 Me]│  ← Bottom Tab Bar
└──────────────────────────────────┘
```

## Component Breakdown

### 1. TopBar
- **Height**: 56px
- **BG**: white, shadow elevation 2
- **Left**: App logo/icon (24x24)
- **Center**: "Toy Legion" headline-sm, text-primary
- **Right**: Filter icon button (funnel icon)

### 2. AgeStageFilter
- **Height**: 44px, horizontal scroll
- **Pills**: rounded-full, px-4 py-2, gap-2
- **Active**: bg-primary, text-white
- **Inactive**: bg-surface-dark, text-secondary
- **Stages**: All | 0-1yr | 1-3yr | 3-5yr | 5-8yr | 8+yr
- **Colors**: match age-stage token colors in active state

### 3. ProductGrid
- **Layout**: 2-column FlatList, gap=12px, padding=16px
- **Columns**: 2 (flexWrap or numColumns=2)
- **Card**: borderRadius=card(12px), bg-white, shadow elevation 1
- **Card structure**:
  - **Image**: 170x140, top rounded, bg-gray-100 placeholder
  - **Name**: body-md, text-primary, numberOfLines=2, px-2 pt-2
  - **Score Row**: flex-row, justify-between, px-2
    - Score badge: ⭐ {base_score}, label font, bg-primary/10, rounded-full
    - Price: ${scraped_price}, body-md, text-secondary
  - **Age Badge**: label font, rounded-full, px-2 py-0.5, mt-1 mb-2 mx-2
    - Color: age-stage token color

### 4. LoadMoreButton
- **Style**: bg-surface-alt, rounded-button, px-6 py-3
- **Text**: "Load More", body-md, text-secondary
- **Behavior**: fetch next page (20 items)

### 5. BottomTabBar (Expo Router handles this)
- **Height**: 64px (safe area aware)
- **Icons**: Home, Milestone, Profile
- **Active**: primary color
- **Inactive**: text-muted

## Data Contract (API)

### List Products (mv_product_browse)
```
GET /rest/v1/mv_product_browse?select=*&age_min_yr=lte.{max_age}&age_max_yr=gte.{min_age}&order=base_score.desc&limit=20&offset={offset}
```

### Response Fields (used in HOME_001):
| Field | Usage |
|-------|-------|
| id | Navigation key |
| name_display | Card title |
| scraped_price | Price display |
| base_score | AI score badge |
| product_category | Tags (future) |
| age_min_yr, age_max_yr | Age badge |
| brand_name | (future: brand filter) |
| slot_X_Y | (V2: age-stage scores) |

## Interaction States

| State | Visual |
|-------|--------|
| Default | Card as described |
| Loading | Skeleton placeholder (3x2 grid) |
| Empty | "No toys found for this age" + illustration |
| Error | "Something went wrong" + Retry button |
| Tap | Navigate to DETAIL_001 with product id |

## Design Tokens Applied
All colors, fonts, spacing, and radii from `tailwind.config.js`.

---

## Implementation Notes for FE
1. Use `FlatList` with `numColumns={2}` for grid
2. `react-native-skeleton-placeholder` for loading state
3. `expo-image` for optimized image loading (CDN URLs from products)
4. Age filter = `useState` → re-query Supabase on change
5. Pagination: `offset += 20`, append to existing list
6. Navigation: `router.push('/detail/${id}')`
