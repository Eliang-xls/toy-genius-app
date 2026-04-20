# V1 Frontend Display Plan (Revised)
> Revised by PM + UXD | 2026-04-22
> Revision reason: Stitch project "Toy Genius" may not align with current improved framework. FE must create a new Stitch project from latest specs.

## Guiding Principle
**"Three screens → functional V1 → iterate"**
Each screen directly validates a user value proposition.

---

## Phase 1: Design Tool (Stitch) — 3 Core Screens

### Screen 1: Home / Browse Feed (HOME_001)
- **UXD spec**: [V1_Display_Design_Discussion_v4.md §HOME_001]
- Purpose: First impression + product discovery
- Shows: 5-tier system (Small/Deep/Value/Medium/Big), age-stage filter, quality badges
- Call to action: Tap card → detail

### Screen 2: Product Detail (DETAIL_001)
- **UXD spec**: [V1_Display_Design_Discussion_v4.md §DETAIL_001]
- Purpose: Product deep dive + decision support
- Shows: AI score radar chart, price-range visualization, growth impact (TOP 3 milestones), quality certs badges, safety warnings
- Call to action: Source link / Save / Share

### Screen 3: Growth Milestones (MILESTONE_001)
- **UXD spec**: [V1_Display_Design_Discussion_v4.md §MILESTONE_001]
- Purpose: Unique differentiator — show why toy matters
- Shows: Milestone card list, development domains, matched toys count, community upvote
- Call to action: Browse related toys / Save milestone

### Stitch Design Tokens (for new project)
```
Color palette:
  Primary: #3B82F6 (Blue)
  Secondary: #F59E0B (Warm Yellow — child-friendly accent)
  Surface: #FFFFFF / #F9FAFB
  Text: #111827 / #6B7280

Typography:
  Headlines: Inter Bold (24/20/18)
  Body: Inter Regular (16/14)
  Labels: Inter Medium (12)

Corner radius: 12px (cards), 8px (buttons), 4px (inputs)

Spacing scale: 4, 8, 12, 16, 20, 24, 32

Design system: Light mode default, dark mode optional (Phase 2)
```

### Deliverables
| Item | Owner | Due |
|------|-------|-----|
| New Stitch project (3 screens) | FE | W1 Day 2 (Apr 23) |
| Design tokens applied | FE | W1 Day 2 (Apr 23) |
| Screen reviews + approval | PM + UXD | W1 Day 3 (Apr 24) |

---

## Phase 2: React Native Code Integration — 3 Screens → Running App

### User Stories
| ID | Story | Priority |
|----|-------|----------|
| US-001 | Browse products with age-stage filter | P0 |
| US-002 | View product detail with AI score | P0 |
| US-003 | Browse growth milestones | P1 |
| US-004 | Deep link to product source (Amazon) | P0 |
| US-005 | Save/favorite product (local storage) | P1 |

### Dependencies
- `mv_product_browse` materialized view (BA: already exists)
- `v_product_detail` view (DA: created in Apr 19 meeting)
- `v_milestone_toys` view (DA: created in Apr 19 meeting)

### Deliverables
| Item | Owner | Due |
|------|-------|-----|
| Expo project init + NativeWind | FE | W1 Day 2 (Apr 23) |
| Screen components from Stitch | FE | W1 Day 3-4 (Apr 24-25) |
| API integration + navigation | FE | W1 Day 4-5 (Apr 25-26) |
| Milestone view optimization | DA | W1 Day 3 (Apr 24) |

---

## Phase 3: Polish + V1 Ship — End of W1

### V1 Scope (Minimal Shippable)
- 3 screens functional
- Product browsing with age-stage filter
- Product detail with scores + source links
- Growth milestones display
- Local favorites (no auth)
- 5 test children profiles (demo data)

### V1 Excluded (→ V2)
- User auth (Supabase)
- Children profiles (user-generated)
- Slot plans + saved items
- Browsing history + recommendation engine
- Deep search + price alerts
- Notifications
- Community features (milestone upvote)

### Milestone checklist
- [ ] Stitch: 3 screens designed + approved
- [ ] Expo: Project builds on iOS + Android
- [ ] API: `mv_product_browse` + `v_product_detail` connected
- [ ] UI: All 3 screens functional with real data
- [ ] QA: `dogfood` passes (20-30 min walkthrough)
- [ ] Ship: TestFlight / APK shareable build

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stitch design doesn't match RN output | Low (pixel-perfect) | FE reviews Stitch code export quality |
| MV data too sparse for demo | Medium | DA populates 50+ products with good metadata |
| Navigation complexity | Medium | Use Expo Router (file-based, zero config) |
| Time overrun (5 days tight) | High | PM enforces scope discipline — P0 only |

---

## Notes
- **Stitch project**: CREATE NEW — do NOT reuse "Toy Genius" (ID: 4044680601076201931). Old project may not reflect current improved framework specs.
- Design tokens above are starting defaults. UXD can refine in review.
- FE should export Stitch screens as React components (Stitch supports this natively).
