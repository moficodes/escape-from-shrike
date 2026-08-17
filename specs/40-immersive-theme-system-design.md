# Spec 40: Immersive Theme System Design

This document details the architectural design for transforming the visual theme presets from basic font-and-color Swaps into **deep visual mutations** that dynamically adjust geometries, borders, shadows, hover micro-interactions, and custom content dividers.

---

## 1. Overview & Objective

The goal is to elevate the template's look and feel to an immersive, bespoke "digital scrapbook" tailored to each campaign's genre. 

Instead of flat SaaS boxes, each theme preset will specify **structural design tokens** (borders, shadows, corner clip-paths, and layout densities) and **state tokens** (hover offsets, bounce transitions). These tokens are injected globally as CSS Custom Properties, and standard components (such as cards, buttons, and dividers) automatically adapt to them.

---

## 2. Expanded Design Tokens Registry

We will expand our `themePresets` registry in `lib/themes.ts` to include these structural styling properties:

```typescript
export interface ThemeColorSet {
  // Existing Colors...
  surface: string;
  primary: string;
  onSurface: string;

  // NEW: Structural Tokens
  radiusContainer?: string;     // e.g., '4rem 1.5rem 4rem 1.5rem' or '0px'
  borderContainer?: string;     // e.g., '1px solid rgba(...)' or '4px solid #b87333'
  shadowContainer?: string;     // e.g., '0 20px 50px rgba(...)' or 'none'
  clipPathContainer?: string;   // e.g., 'polygon(...)' or 'none'
  transitionSpeed?: string;     // e.g., '0.3s cubic-bezier(...)' or '0.1s ease'
  
  // NEW: Hover Micro-Interaction Tokens
  hoverTransform?: string;      // e.g., 'translateY(-6px)' or 'scale(1.02)'
  hoverShadow?: string;         // e.g., '0 30px 60px rgba(...)' or '0 0 25px ...'
  hoverBorderColor?: string;    // e.g., '#ff3333' or '#39ff14'
}
```

---

## 3. Custom Component Primitives

We will introduce two new reusable primitives to our component kit:

### A. `<ThemeCard>`
A dynamic wrapper used for all character, NPC, and location cards across the public site:
```tsx
import React from 'react';

interface ThemeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ThemeCard({ children, className = "", style, ...props }: ThemeCardProps) {
  return (
    <div
      className={`transition-all relative group ${className}`}
      style={{
        borderRadius: 'var(--radius-container, 1rem)',
        border: 'var(--border-container, none)',
        boxShadow: 'var(--shadow-container, none)',
        clipPath: 'var(--clip-path-container, none)',
        transitionDuration: 'var(--transition-speed, 200ms)',
        backgroundColor: 'var(--surface-container-low)',
        ...style
      }}
      // Interactive overrides mapped dynamically via standard CSS variables in layout
      {...props}
    >
      <div className="hover-state-wrapper group-hover:scale-active transition-all">
        {children}
      </div>
    </div>
  );
}
```

### B. `<ThemeDivider>` (Polymorphic Separator)
A separator that reads the current campaign settings and renders highly thematic vector breaks:
- **`fantasy-parchment` / `fey`**: Renders an SVG flourishing vine or floral vine ornament (`❦`).
- **`cyberpunk` / `space-scifi`**: Renders a digital console readout block detailing diagnostic metadata in monospace brackets.
- **`horror` / `gritty`**: Renders a repeating hazard-striped warning banner.
- **`steampunk`**: Renders a brass pipe with center indicator dial.
- **Others**: Renders a subtle background shift (whitespace) satisfying "no standard 1px lines" criteria.

---

## 4. Integration into CSS (`app/globals.css`)

In `app/globals.css`, we will wire up hover behaviors and structural rules using these newly defined custom properties:

```css
/* Card Lift Hover Animation Engine */
.theme-hover-effect {
  transition: transform var(--transition-speed, 200ms), box-shadow var(--transition-speed, 200ms), border-color var(--transition-speed, 200ms);
}

.theme-hover-effect:hover {
  transform: var(--hover-transform, none);
  box-shadow: var(--hover-shadow, none);
  border-color: var(--hover-border-color, inherit);
}
```
