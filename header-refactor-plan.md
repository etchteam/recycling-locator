# Contextual Back Links & Header Refactoring Plan

## Overview

This plan addresses two related concerns:
1. **Contextual back navigation** - Back buttons should return users to where they came from, not hardcoded destinations
2. **Header consolidation** - Reduce duplication across layout files with 5 header variants

## Technical Constraints

- **wouter memory mode ignores state** - `navigate(path, { state })` only works in standalone/browser mode
- Solution must work identically in widget (memory) and standalone (browser) modes
- Follow existing patterns: Preact signals for state, custom elements for styling, context providers
- Add a git commit after each step in the plan

---

## Implementation Plan

### Phase 1: Navigation Context

Create a signal-based navigation provider that tracks history and provides contextual back navigation.

**Create:** `src/hooks/NavigationProvider.tsx`

```tsx
// Tracks navigation history using signals
// Provides: from (previous path), navigateBack(), navigateTo()
// Works in both widget and standalone modes
```

**Modify:** `src/index.tsx`
- Wrap app with `NavigationProvider` inside `RouterProvider`

### Phase 2: BackLink Component

**Create:** `src/components/control/BackLink/BackLink.tsx`

```tsx
interface BackLinkProps {
  fallbackPath: string;  // Used when no history exists
  label?: string;
}
```

- Uses `useNavigation()` to get contextual back destination
- Falls back to `fallbackPath` for direct URL entry or first page load
- Always renders as a Link (navigates to `from` path or fallback)

### Phase 3: Header Layout Components

Create header layout variations under `src/components/content/HeaderLayouts/` (renaming existing Header folder).

**Rename:** `src/components/content/Header/` → `src/components/content/HeaderLayouts/`

**Create header layout variants:**

| File | Description |
|------|-------------|
| `HeaderBase.tsx` | Base wrapper component with Logo + Content slots |
| `HeaderWithTitle.tsx` | Icon logo + title + subtitle |
| `HeaderWithBackButton.tsx` | Icon logo + back button + title (uses BackLink) |
| `HeaderWithInfoButton.tsx` | Full logo + info/close toggle button |
| `HeaderWithCloseButton.tsx` | Icon logo + title + close link |
| `HeaderWithMenu.tsx` | Icon logo + menu button + title, manages menu open/closed state and content switching |

**Remove:** `InfoHeader.tsx` (replaced by `HeaderWithInfoButton.tsx`)

### Phase 4: Layout Migration

Migrate layouts in order of complexity:

1. `material.layout.tsx` - Use HeaderWithBackButton
2. `place.layout.tsx` - Use HeaderWithBackButton
3. `search.layout.tsx` - Use HeaderWithCloseButton
4. `home.layout.tsx` - Use HeaderWithMenu
5. `places.layout.tsx` - Use HeaderWithMenu (+ search section)
6. `refill.layout.tsx` - Use HeaderWithMenu or HeaderWithBackButton (conditional)
7. `start.layout.tsx` - Use HeaderWithInfoButton
8. `postcode.layout.tsx` - Use HeaderWithInfoButton (+ conditional close for rescue-me-recycle)
9. `collection.page.tsx` - Use HeaderWithBackButton (has its own layout with header)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/NavigationProvider.tsx` | Navigation context and history tracking |
| `src/components/control/BackLink/BackLink.tsx` | Contextual back link |
| `src/components/content/HeaderLayouts/HeaderBase.tsx` | Base header wrapper |
| `src/components/content/HeaderLayouts/HeaderWithTitle.tsx` | Title variant |
| `src/components/content/HeaderLayouts/HeaderWithBackButton.tsx` | Back button variant |
| `src/components/content/HeaderLayouts/HeaderWithInfoButton.tsx` | Info button variant |
| `src/components/content/HeaderLayouts/HeaderWithCloseButton.tsx` | Close button variant |
| `src/components/content/HeaderLayouts/HeaderWithMenu.tsx` | Menu variant with content switching |
| `tests/end-to-end/header-layout.test.ts` | E2E tests for header layouts + back navigation |

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.tsx` | Add NavigationProvider wrapper |
| `src/pages/[postcode]/material/material.layout.tsx` | Use HeaderWithBackButton |
| `src/pages/[postcode]/places/place/place.layout.tsx` | Use HeaderWithBackButton |
| `src/pages/[postcode]/places/search/search.layout.tsx` | Use HeaderWithCloseButton |
| `src/pages/[postcode]/home/home.layout.tsx` | Use HeaderWithMenu |
| `src/pages/[postcode]/home/collection.page.tsx` | Use HeaderWithBackButton |
| `src/pages/[postcode]/places/places.layout.tsx` | Use HeaderWithMenu |
| `src/pages/refill/refill.layout.tsx` | Use HeaderWithMenu + HeaderWithBackButton |
| `src/pages/start.layout.tsx` | Use HeaderWithInfoButton |
| `src/pages/[postcode]/postcode.layout.tsx` | Use HeaderWithInfoButton |

## Files to Delete

| File | Reason |
|------|--------|
| `src/components/content/Header/InfoHeader.tsx` | Replaced by HeaderWithInfoButton |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ NavigationProvider (wraps entire app)                   │
│   - Tracks navigation history                           │
│   - Provides useNavigation() hook                       │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────┐
│ Header Layout Components (src/components/content/HeaderLayouts/)
│                         │                               │
│  HeaderBase ─────────────┬── HeaderWithTitle            │
│                          ├── HeaderWithBackButton       │
│                          ├── HeaderWithInfoButton       │
│                          ├── HeaderWithCloseButton      │
│                          └── HeaderWithMenu             │
│                                                         │
│  BackLink (src/components/control/BackLink/)            │
│    - Uses NavigationProvider for contextual navigation  │
│    - Falls back to provided path when no history        │
└─────────────────────────────────────────────────────────┘
```

---

## Verification

### E2E Tests
Create dedicated test file: `tests/end-to-end/header-layout.test.ts`

Test each header layout variation:
1. **HeaderWithInfoButton** - Info button toggles about panel
2. **HeaderWithBackButton** - Back button navigates to previous page
3. **HeaderWithCloseButton** - Close button navigates to parent
4. **HeaderWithMenu** - Menu button opens navigation, close button closes it
5. **HeaderWithTitle** - Title and subtitle display correctly

Test contextual back navigation:
1. Navigate: `/:postcode` → `/:postcode/places` → `/:postcode/material`
   - Click back → should return to `/:postcode/places`
2. Direct URL entry → should use fallback path
3. Entry from different origins → back should return to actual origin

### Existing E2E Tests
Run all existing E2E tests after migration to ensure no regressions.
