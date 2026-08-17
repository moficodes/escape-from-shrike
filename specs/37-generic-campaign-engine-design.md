# Spec: Generic Campaign Engine Design

This document details the design for turning the Sablewood Chronicles website into a generic, parameter-driven campaign template repository that can easily be cloned, customized, and run for any fantasy, sci-fi, or custom tabletop RPG campaign.

## 1. Overview & Goal

The goal is to transition this repository into a "Smart Boilerplate Template" (Approach 1). Users will fork or clone the repository and run a single scaffolding command to set up their own distinct tabletop RPG campaigns.

To achieve this, we will transition hard-coded elements (theme, game stats, and calendar system) to be completely configuration-driven.

---

## 2. Dynamic Configuration (`campaign.yml`)

The engine will support a top-level `settings` block inside `data/campaign.yml` defining the system, appearance, backgrounds, and custom calendar rules.

### YAML Structure
```yaml
settings:
  gameSystem: dnd5e  # daggerheart, dnd5e, pathfinder2e, generic
  themePreset: gothic-horror  # fantasy-parchment, gothic-horror, heroic, gritty, whimsical, cyberpunk, space-scifi, custom
  backgrounds:
    global: "/images/horror-mist.jpg"
    home: "/images/castle-gates.jpg"
    players: "/images/crypt.jpg"
    npcs: "/images/npcs-bg.jpg"
    locations: "/images/world-map.jpg"
    timeline: "/images/scroll-bg.jpg"
  calendar:
    type: custom  # gregorian, custom
    eras:
      - name: "Age of Strife"
        abbreviation: "AS"
        startYear: 0
    months:
      - name: "Shadow-Moon"
        days: 28
      - name: "Blood-Moon"
        days: 30
    daysOfWeek: ["Gloomday", "Weepday", "Blightday", "Duskday", "Nocturne"]
  customTheme:  # Optional: Overrides themePreset hex codes
    light:
      surface: "#fff8f0"
      primary: "#8d34b4"
      on-surface: "#3e3101"
    dark:
      surface: "#2c2317"
      primary: "#d59df4"
      on-surface: "#f5eedd"
```

---

## 3. Theme Presets & Dynamically Loaded Styles

Rather than hard-coding CSS values in Tailwind, theme colors will map directly to CSS variables inside `app/globals.css`. If a preset is selected, its defaults are loaded, and can be overriden by the `customTheme` YAML attributes.

### Presets Palette Map

1. **Fantasy Parchment (Default)**
   - Surface: `#fff8f0` (Parchment), Primary: `#8d34b4` (Magic Purple), On-Surface: `#3e3101` (Ink Brown)
   - Font: *Plus Jakarta Sans* / *Cinzel* (Editorial)
2. **Gothic Horror**
   - Surface: `#121212` (Charcoal Black), Primary: `#8b0000` (Blood Red), On-Surface: `#d4c5b9` (Ashen Gray)
   - Font: *Cinzel* / *Playfair Display*
3. **Heroic / Epic Fantasy**
   - Surface: `#fffdf5` (Bright Parchment), Primary: `#0a2342` (Royal Blue), On-Surface: `#ffd700` (Gold)
   - Font: *Spectral* / *Cinzel*
4. **Gritty / Dark Fantasy**
   - Surface: `#2d2d2d` (Rusted Iron), Primary: `#c05621` (Amber Ochre), On-Surface: `#eaeaea` (Soot Gray)
   - Font: *Share Tech Mono* / *PT Serif*
5. **Whimsical / High Magic**
   - Surface: `#faf5ff` (Pastel Lavender), Primary: `#2d6a4f` (Emerald Green), On-Surface: `#2d174d` (Night Plum)
   - Font: *Plus Jakarta Sans* (Highly Rounded Corners)
6. **Cyberpunk**
   - Surface: `#05050a` (Deep Space Dark), Primary: `#bc34fa` (Neon Magenta), On-Surface: `#3bfb90` (Neon Green)
   - Font: *Share Tech Mono*
7. **Space Sci-Fi**
   - Surface: `#0d1117` (Deep Blue Void), Primary: `#00d2ff` (Vibrant Cyan), On-Surface: `#e6edf3` (Starlight White)
   - Font: *Orbitron*

### Background Injection
- In `app/layout.tsx`, page backgrounds are injected dynamically as full-bleed fixed layouts overlayed with the theme's matching `surface` backdrop blur/opacity.

---

## 4. Shared Meta-Schema System (`lib/systems/`)

Game system variables will live in `lib/systems/` to dynamically adjust site pages, TUI forms, and Admin inputs:

```
lib/systems/
├── index.ts              # System registry
├── daggerheart.ts        # Daggerheart stats, labels & questions
├── dnd5e.ts              # D&D 5e stats, labels & questions
├── pathfinder2e.ts       # Pathfinder 2e stats, labels & questions
└── generic.ts            # Agnostic Key-Value stats
```

Each module exports structural definitions indicating:
- Field labels (e.g., "Ancestry" vs. "Race")
- Character stats abbreviations and base ranges
- Form builders for the Admin app's `AutoForm` and TUI fields

---

## 5. Setup & Scaffolding Wizard CLI (`bun run setup`)

A clean initialization setup script (`cli/init-campaign.ts`) will walk new creators through:
1. **Interactive Form:** Prompt for campaign metadata, selected rules system, style preset, and custom calendars.
2. **Setup Execution:**
   - Write settings directly to a newly formed `data/campaign.yml`.
   - Clear placeholder player and NPC files.
   - Initialise a fresh git commit ready for GitHub Pages deployment.
