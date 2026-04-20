# DETAIL_001 Design Specification — Product Detail Screen
> PM/UXD | 2026-04-22
> Stitch fallback: manual RN component spec

---

## Screen Purpose
Product deep dive — decision support. User sees full details, AI scores, safety certs, growth impact.

## Layout Structure

```
┌──────────────────────────────────┐
│ [← Back]              [Share ♡]  │  ← Top Bar (56px)
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │        [Product Image]       │ │  ← Hero Image (280px)
│ │         (full width)         │ │     carousel if multiple
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│ Product Name (headline-md)       │  ← Header Section
│ Brand • Category tags            │
│ $24.99              ⭐ 87.3/100  │
├──────────────────────────────────┤
│ ┌─ AI Score Radar ────────────┐ │
│ │    [Radar Chart SVG]        │ │  ← Score Section
│ │ Safety│Edu│Sensory│Motor    │ │     8 dimensions
│ │ Lang│Creativity│Sci│Emotion │ │
│ └─────────────────────────────┘ │
├──────────────────────────────────┤
│ ┌─ Safety Certifications ─────┐ │
│ │ [✓] ASTM F963               │ │  ← Cert badges
│ │ [✓] CPSIA                   │ │     green check / red warning
│ │ [!] Small parts warning     │ │
│ └─────────────────────────────┘ │
├──────────────────────────────────┤
│ ┌─ Growth Impact (TOP 3) ────┐ │
│ │ 🎯 Fine Motor Skills       │ │  ← Milestone cards
│ │    Matched: 12 toys         │ │
│ │ 🧠 Problem Solving         │ │
│ │    Matched: 8 toys          │ │
│ │ 🗣️ Language Development     │ │
│ │    Matched: 5 toys          │ │
│ └─────────────────────────────┘ │
├──────────────────────────────────┤
│ [🛒 Buy on Amazon]              │  ← CTA (sticky bottom)
│ Price: $24.99 • Free shipping   │
├──────────────────────────────────┤
│ [🏠 Home] [📊 Milestone] [👤 Me]│  ← Bottom Tab Bar
└──────────────────────────────────┘
```

## Component Breakdown

### 1. TopBar (Detail)
- **Left**: Back arrow (router.back())
- **Right**: Share button + Favorite heart (local state, V2: persist)

### 2. HeroImage
- **Height**: 280px, full width
- **Image**: expo-image with placeholder
- **Dots**: page indicator if multiple images

### 3. HeaderSection
- **Name**: headline-md, text-primary
- **Brand**: body-md, text-secondary
- **Categories**: horizontal pill tags
- **Price**: headline-sm, text-primary
- **Score**: badge, rounded-full, bg-primary/10

### 4. ScoreRadarChart
- **Component**: react-native-svg custom radar
- **8 axes**: d_safety, d_education, d_sensory, d_motor, d_language, d_creativity, d_science, d_emotions
- **Fill**: primary color with 30% opacity
- **Stroke**: primary color
- **Labels**: around the perimeter

### 5. CertificationsSection
- **Layout**: vertical list
- **Passed**: ✓ green, body-md
- **Warning**: ⚠ yellow, body-md
- **Source**: `safety_concern` array from MV

### 6. MilestoneImpact
- **Cards**: top 3 milestones from v_milestone_toys
- **Each**: icon + name + matched toys count

### 7. BuyCTA
- **Sticky bottom** (absolute position)
- **Button**: bg-primary, rounded-button, full width
- **Text**: "Buy on Amazon" — links to product source

## Data Contract (API)

### Get Product Detail
```
GET /rest/v1/v_product_detail?id=eq.{product_id}
```

### Response Fields:
| Field | Usage |
|-------|-------|
| All mv_product_browse fields | Product info |
| certifications_summary | Cert badges (if exists) |
| raw JSONB certs/feedback | Detailed cert data |
| safety_concern | Warning badges |

### Get Milestone Impact
```
GET /rest/v1/v_milestone_toys?product_id=eq.{product_id}&order=match_score.desc&limit=3
```

---

## Implementation Notes
1. Use `ScrollView` (not FlatList) — single product, needs scroll
2. Radar chart: custom SVG with react-native-svg
3. Sticky CTA: `position: absolute, bottom: 0`
4. Share: `expo-sharing` or `react-native Share`
5. Favorite: AsyncStorage (local, V2 → Supabase)
