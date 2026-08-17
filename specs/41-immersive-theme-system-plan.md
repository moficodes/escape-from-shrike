# Spec 41: Immersive Theme System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform visual theme presets from basic font-and-color swaps into deep visual overhauls adjusting geometries, borders, shadows, hover micro-interactions, and custom dividers.

**Architecture:**
1. Extend `lib/themes.ts` with structural design tokens for all 13 presets.
2. Create polymorphic `<ThemeCard>` and `<ThemeDivider>` primitives under `app/components/theme-elements.tsx`.
3. Integrate these components across homepage list dividers, character cards, and timeline sections.
4. Apply global hover styles in `app/globals.css`.

**Tech Stack:** React 19, TypeScript, Next.js, Tailwind CSS v4.

---

## File Structure & Dependencies

We will modify or create the following files:
- **Modify**: `lib/themes.ts` — Add structural tokens to all 13 presets
- **Create**: `app/components/theme-elements.tsx` — Dynamic Card and Divider primitives
- **Modify**: `app/globals.css` — Hook up global hover classes
- **Modify**: `app/page.tsx` — Integrate custom dividers and theme-card elements

---

## Implementation Tasks

### Task 1: Extend Presets with Structural Tokens (`lib/themes.ts`)

**Files:**
- Modify: `lib/themes.ts`

- [ ] **Step 1: Add structural properties to all 13 theme presets**
Define customized `radiusContainer`, `borderContainer`, `shadowContainer`, `clipPathContainer`, `transitionSpeed`, `hoverTransform`, and `hoverShadow` values matching each of the 13 genres.

For example, inside `gothic-horror`:
```typescript
radiusContainer: '4px',
borderContainer: '1px solid var(--outline-variant)',
shadowContainer: '0 10px 40px rgba(0,0,0,0.4)',
transitionSpeed: '0.4s ease',
hoverTransform: 'translateY(-4px)',
hoverShadow: '0 20px 50px rgba(74,14,23,0.15)',
```

Inside `cyberpunk`:
```typescript
radiusContainer: '0px',
borderContainer: '1px solid var(--primary)',
shadowContainer: '0 0 10px rgba(57,255,20,0.1)',
clipPathContainer: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15% 100%, 0 calc(100% - 15px))',
transitionSpeed: '0.1s ease',
hoverTransform: 'none',
hoverShadow: '0 0 20px var(--on-surface)',
```

- [ ] **Step 2: Update `getThemeStyles` to inject properties**
Export these new structural values inside the generated CSS custom variables on `:root` and `.dark`:
```typescript
const formatVariables = (colors: ThemeColorSet) => {
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  --${cssKey}: ${value};`;
    })
    .join('\n');
};
```

---

### Task 2: Implement Theme Primitives (`app/components/theme-elements.tsx`)

**Files:**
- Create: `app/components/theme-elements.tsx`

- [ ] **Step 1: Write polymorphic `<ThemeCard>` component**
Support dynamic inline styling reading the CSS custom properties so that cards automatically animate, clip, and border-bend according to the current theme.

- [ ] **Step 2: Write `<ThemeDivider>` component**
Support custom vector icons:
```tsx
export function ThemeDivider({ preset }: { preset: string }) {
  if (preset === 'fantasy-parchment' || preset === 'fey') {
    return (
      <div className="flex items-center justify-center gap-4 text-primary my-12 opacity-60">
        <div className="h-[1px] w-24 bg-current opacity-30"></div>
        <span className="text-2xl">❦</span>
        <div className="h-[1px] w-24 bg-current opacity-30"></div>
      </div>
    );
  }
  // Other preset conditions...
}
```

---

### Task 3: Integrate and Polish Components (`app/page.tsx` & `app/globals.css`)

**Files:**
- Modify: `app/globals.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Hook up global classes in `app/globals.css`**
Create a transition helper class `.theme-card-interactive` for hover interactions that reads variable offsets seamlessly.

- [ ] **Step 2: Integrate dividers on the Homepage**
Inject `<ThemeDivider>` elements on the homepage instead of large raw gaps.

- [ ] **Step 3: Run full builds and verify**
Run: `bun run build`
Expected: PASS
