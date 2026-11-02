# Akla (أكلة) — UI design handoff

Daily meal-recommendation app for Egyptian home cooks. Arabic-first, full RTL, mobile (390×844).
Implement in **Next.js + TypeScript** with RTL (`<html lang="ar" dir="rtl">`).

## What's in here
- `akla.css` — **source of truth** for design tokens (CSS variables on `:root`) and all reusable component classes. Port these to your styling system (Tailwind theme / CSS modules) 1:1.
- `screens/*.dc.html` — one file per screen. Each is HTML markup + a small logic class:
  - `{{value}}` = data binding, `<sc-for list=… as=…>` = loop, `<sc-if value=…>` = conditional, `onClick="{{handler}}"` = event.
  - The `<script type="text/x-dc">` at the bottom holds the screen's mock data and state logic (`renderVals()` ≈ React render data). Treat it as a spec for behavior; rewrite as React components.
  - `./support.js` is the design-tool runtime — **not needed** in the real app (it's not included).
  - `<a href="X.dc.html">` = navigation to route X.
- `canvas.json` — screen list and grouping.
- `assets/logo-mark.png`, `assets/logo-original.jpg` — app logo.

## Design tokens (from akla.css)
| Token | Value | Use |
|---|---|---|
| --c-primary | #C2461B | primary buttons, active states |
| --c-primary-press | #A23A16 | pressed, text on tint |
| --c-primary-tint | #FCEBE2 | selected chip bg |
| --c-green | #4A7524 | success, checked, veg |
| --c-green-tint | #E7F0DA | |
| --c-saffron | #E9A23B | decoration only, never text |
| --c-bg | #FBF7F2 | screen background |
| --c-surface / -2 | #FFFFFF / #F4ECE2 | cards / muted surfaces |
| --c-border / -strong | #E9DED1 / #D6C6B4 | |
| --c-text / -2 / -3 | #3A2418 / #5E4638 / #7D6252 | |
| --c-ink | #2A1A11 | toasts |
| --c-danger | #B3261E | |

Font: **Cairo** (400–800). Type scale: display 32/48·800, h1 26/40·800, h2 22/34·700, h3 18/28·700, body 16/28·500, small 14/22·600, caption 13/20·600.
Radius: 12 / 16 / 20 / 28 / pill. Spacing: 8pt grid. Min tap target 48px. Western digits (0–9) everywhere.

## Components (class names in akla.css)
`btn` + `btn-primary | btn-secondary | btn-tonal | btn-ghost | btn-sm | btn-block`, `icon-btn`, `chip` (+`is-on`), `tag` (+`green|tomato`), `pick` / `pick-grid` (selectable image tile), `card`, `ph` (photo placeholder), `dish-row`, `mini` (small dish card), `seg` (segmented tabs), `input`, `search`, `cb` (checkbox), `switch`, `radio`, `stepper`, `progress`, `segbar`, `dots`, `tabbar`, `appbar`, `sheet` + `scrim` + `grabber`, `toast`, `banner`, `empty` + `illu`, `sk` (skeleton), `list-card` / `list-item`, `check-row`, `sticky-cta`.

## Screens → suggested routes
| File | Route |
|---|---|
| Main (splash) | `/` |
| Onboarding-1..3 | `/onboarding` (carousel) |
| Login | `/login` |
| Prefs-1-Proteins … Prefs-5-Household, Prefs-Summary | `/setup/[step]`, `/setup/summary` |
| Home | `/home` (tab) |
| Dish-Ingredients, Dish-Steps | `/dish/[id]` with tabs |
| Cooking-Mode (+ Cooking-Sheet = ingredients sheet open) | `/dish/[id]/cook` |
| Weekly-Plan | `/week` (tab) |
| Shopping-List | `/shopping` (tab) |
| Explore | `/explore` (tab) |
| Favorites | `/favorites` (tab) |
| Profile | `/profile` |
| State-* | loading / empty / offline / no-match / toast + push notification states |
| Design-System | reference page |

Bottom tabs (right → left in RTL): الرئيسية، استكشفي، الأسبوع، المشتريات، المفضلة. Profile opens from the avatar on Home.

## Behavior to implement
- Preferences: multi-select tiles, "اختاري الكل / شيلي الكل" per group, skip allowed, progress 1–5.
- Home: today's dish hero, "غيّر الأكلة" picks another dish, favorite toggle, alternatives carousel.
- Dish: servings stepper rescales quantities (rounding: grams to 50, cups/spoons to ¼, counts to ½, kilo < 1 → grams); ingredient checkboxes; "add missing to shopping list".
- Cooking mode: one step per screen, prev/next, per-step countdown timer, keep screen awake (Wake Lock API), ingredients bottom sheet.
- Weekly plan: swap per day, mark as cooked, progress.
- Shopping list: grouped by category, add item, clear checked, share to WhatsApp (`https://wa.me/?text=`).

## RTL rules
Use logical CSS (`margin-inline-*`, `inset-inline-*`, `text-align: start`). Back arrow points right, "next" chevrons point left; play/media icons and clocks are NOT mirrored. Wrap phone numbers and timers in `dir="ltr"`. Progress bars fill from the right.

Food images are placeholders (`ph ph-1..6`) — replace with real photos.
