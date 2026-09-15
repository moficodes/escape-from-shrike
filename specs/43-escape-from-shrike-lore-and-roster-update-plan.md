# Escape from Shrike: Campaign Lore, Timeline, and Roster Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul `data/campaign.yml` using the `bun run agent` CLI to replace legacy campaign data with the full "Escape from Shrike" setting: 5 player characters (Flora, Fire Patch, Loki Morgulis, Maleficent, Moriarty), locations (The Shrike, Hollowtown, Both of the Iron Coffins, Longpoint, Calcified Leviathan Husk, House of Salt, Bonnie Morga's Cottage), NPCs (Bonnie Morgas, Sir Alabaster Cain, Nicodemus, Ezekiel Frond, Archon Iao, The Man in the Green Cloak), 9 timeline events spanning Year 0 to Year 515 (with all recent events on Day 11), updated active and side quests, and home branding.

**Architecture:** Use the existing agent CLI (`bun run agent` / `cli/agent.ts`) to delete deprecated entities and add all new validated entries directly into `data/campaign.yml`. Verify that static generation pages (`/players/[id]`, `/locations/[id]`, `/npcs/[id]`, `/timeline`, and `/`) build cleanly without errors.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Bun, Commander CLI (`cli/agent.ts`), YAML (`data/campaign.yml`).

---

### Task 1: Clean Legacy Campaign Entities

**Files:**
- Modify: `data/campaign.yml` via `bun run agent` CLI

- [ ] **Step 1: Delete legacy quests**
  Run:
  ```bash
  bun run agent quest delete "Deliver the Box to Hush" && bun run agent quest delete "Rescue the Missing Children of Hush"
  ```
  Expected output: Quest deletion confirmations.

- [ ] **Step 2: Delete legacy events**
  Run:
  ```bash
  bun run agent event delete "evt-journey-begins" && bun run agent event delete "evt-ambush" && bun run agent event delete "evt-rescue-hush-children" && bun run agent event delete "evt-arrival-in-hush"
  ```
  Expected output: Event deletion confirmations for each id.

- [ ] **Step 3: Delete legacy NPCs**
  Run:
  ```bash
  bun run agent npc delete "kai-mellathorn" && bun run agent npc delete "king-emeris"
  ```
  Expected output: NPC deletion confirmations.

- [ ] **Step 4: Delete legacy locations**
  Run:
  ```bash
  bun run agent location delete "solitaire" && bun run agent location delete "hush" && bun run agent location delete "sablewood-forest"
  ```
  Expected output: Location deletion confirmations.

- [ ] **Step 5: Delete legacy players**
  Run:
  ```bash
  bun run agent player delete "orna-kaan" && bun run agent player delete "fantasia" && bun run agent player delete "dracarys" && bun run agent player delete "vala-thorne" && bun run agent player delete "tyrion-lannister" && bun run agent player delete "drax-borson"
  ```
  Expected output: Player deletion confirmations.

---

### Task 2: Populate Locations

**Files:**
- Modify: `data/campaign.yml` via `bun run agent location add`

- [ ] **Step 1: Add The Shrike Spire**
  Run:
  ```bash
  bun run agent location add --id "shrike" --name "The Shrike" --region "Central Spire" --description "A colossal jagged spire severed from the rest of Hell approximately 515 years ago. High atop the spire, an immortal Nameless God remains pierced through; sustained by divine energy he cannot die, and his cascading blood nourishes the dark vitality and arcane power of the entire realm."
  ```

- [ ] **Step 2: Add Hollowtown**
  Run:
  ```bash
  bun run agent location add --id "hollowtown" --name "Hollowtown" --region "Lower Shores" --description "A fragile shoreline settlement of roughly 100 inhabitants clinging to existence at the base of the Shrike near the sea, where scavengers and newcomers eke out a living."
  ```

- [ ] **Step 3: Add Both of the Iron Coffins**
  Run:
  ```bash
  bun run agent location add --id "both-of-the-iron-coffins" --name "Both of the Iron Coffins" --region "Lower Shores" --description "A grim expanse of shore where iron coffins wash up from the black waters or protrude from the ground. Many newcomers to the Shrike who arrived through mortal death first awaken inside these iron sarcophagi."
  ```

- [ ] **Step 4: Add Longpoint**
  Run:
  ```bash
  bun run agent location add --id "longpoint" --name "Longpoint" --region "Lateral Spine" --description "A small settlement clustered around a lateral spine of the Shrike—a sharp rock protrusion extending outward from the spire. Rumor says that anyone who walks the entire length of the spine will find an exit from the Shrike, though no one has ever returned to confirm it."
  ```

- [ ] **Step 5: Add Calcified Leviathan Husk**
  Run:
  ```bash
  bun run agent location add --id "leviathan-husk" --name "Calcified Leviathan Husk" --region "Western Coast" --description "The massive petrified carcass of a leviathan resting along the western coast of the island. Over the last few months, a wandering wizard named Ezekiel Frond has taken up residence within the shelter of its hollowed ribs."
  ```

- [ ] **Step 6: Add House of Salt**
  Run:
  ```bash
  bun run agent location add --id "house-of-salt" --name "House of Salt" --region "Ocean Level" --description "The domain and seat of Archon Iao. Uniquely situated among the five devil Archons as the only house located at the lowest level near the ocean shores. Sir Alabaster Cain serves as an honorable knight under this house."
  ```

- [ ] **Step 7: Add Bonnie Morga's Cottage**
  Run:
  ```bash
  bun run agent location add --id "bonnie-morgas-cottage" --name "Bonnie Morga's Cottage" --region "Lower Shrike" --description "The secluded dwelling of Bonnie Morgas, where travelers trade secrets and resources for her favors. It is here the party drank blood and awakened to their true memories."
  ```

---

### Task 3: Populate NPCs

**Files:**
- Modify: `data/campaign.yml` via `bun run agent npc add`

- [ ] **Step 1: Add Bonnie Morgas**
  Run:
  ```bash
  bun run agent npc add --id "bonnie-morgas" --name "Bonnie Morgas" --role "Dealer of Favors & Secrets" --location "bonnie-morgas-cottage" --description "Appearing to be a human woman in her mid-forties, Bonnie resides in her cottage and dispenses favors in exchange for rare resources and intelligence. In a pro bono gesture, she provided the party with blood to drink, restoring their forgotten memories of their mortal deaths and their task from the Man in the Green Cloak. She has now tasked the party with bringing Ezekiel Frond to her cottage, claiming she wishes to take him as a student."
  ```

- [ ] **Step 2: Add Sir Alabaster Cain**
  Run:
  ```bash
  bun run agent npc add --id "sir-alabaster-cain" --name "Sir Alabaster Cain" --role "Knight of the House of Salt" --location "house-of-salt" --description "A stalwart knight aligned with the House of Salt. After the party fought alongside him to defeat a four-handed monstrosity, he promised them a rewarding favor should they seek him out at the House of Salt."
  ```

- [ ] **Step 3: Add Nicodemus**
  Run:
  ```bash
  bun run agent npc add --id "nicodemus" --name "Nicodemus" --role "Debtor & Shore dweller" --location "hollowtown" --description "An acquaintance on the lower shores who owed a favor to Bonnie Morgas and entrusted a mysterious stone to Maleficent to deliver to Bonnie to clear his debt."
  ```

- [ ] **Step 4: Add Ezekiel Frond**
  Run:
  ```bash
  bun run agent npc add --id "ezekiel-frond" --name "Ezekiel Frond" --role "Wandering Wizard" --location "leviathan-husk" --description "A traveler and wizard who has made his dwelling inside the calcified leviathan carcass on the western coast for the past few months. The party has not yet met him."
  ```

- [ ] **Step 5: Add Archon Iao**
  Run:
  ```bash
  bun run agent npc add --id "archon-iao" --name "Archon Iao" --role "Devil Archon of the House of Salt" --location "house-of-salt" --description "One of the five devil Archons governing territories across the Shrike, and the only Archon whose seat resides at the lowest level bordering the ocean."
  ```

- [ ] **Step 6: Add The Man in the Green Cloak**
  Run:
  ```bash
  bun run agent npc add --id "man-in-the-green-cloak" --name "The Man in the Green Cloak" --role "Harbinger of Redemption" --location "shrike" --description "A mysterious cloaked entity who visited each party member at the moment of their mortal death across different centuries, offering salvation from Hell in exchange for journeying to Shrike to liberate the pierced Nameless God."
  ```

---

### Task 4: Populate Player Characters (PCs)

**Files:**
- Modify: `data/campaign.yml` via `bun run agent player add` and `bun run agent player update`

- [ ] **Step 1: Add Flora**
  Run:
  ```bash
  bun run agent player add --id "flora" --name "Flora" --class "Assassin" --level 1 --ancestry "Eteris" && \
  bun run agent player update "flora" --description "An Eteris assassin burdened with lethal expertise from the mortal realm." --backstory "Two years ago (Year 513), facing mortal death and the damnation of Hell, Flora accepted a pact with the Man in the Green Cloak: salvation and redemption in exchange for entering Shrike to liberate the pierced Nameless God."
  ```

- [ ] **Step 2: Add Fire Patch**
  Run:
  ```bash
  bun run agent player add --id "fire-patch" --name "Fire Patch" --class "Ranger" --level 1 --ancestry "Fire Bolt" && \
  bun run agent player update "fire-patch" --description "A fiery ranger who has navigated the hazards of Shrike for two decades." --backstory "Twenty years ago (Year 495), at the brink of death, Fire Patch received an offer from the Man in the Green Cloak. To atone for past deeds that would have landed him in Hell, he agreed to journey to Shrike and free the bleeding Nameless God."
  ```

- [ ] **Step 3: Add Loki Morgulis**
  Run:
  ```bash
  bun run agent player add --id "loki-morgulis" --name "Loki Morgulis" --class "Wizard" --level 1 --ancestry "Elf" && \
  bun run agent player update "loki-morgulis" --description "An ancient elven wizard who has endured within the Shrike for five centuries." --backstory "Five hundred years ago (Year 15), Loki Morgulis was offered redemption by the Man in the Green Cloak at the threshold of death. Rather than burning in Hell for worldly atrocities, he entered Shrike with a singular purpose: to free the pierced Nameless God."
  ```

- [ ] **Step 4: Add Maleficent**
  Run:
  ```bash
  bun run agent player add --id "maleficent" --name "Maleficent" --class "Rogue" --level 1 --ancestry "Faun" && \
  bun run agent player update "maleficent" --description "A nimble faun rogue carrying secrets, favors, and hidden debts." --backstory "Five years ago (Year 510, fifteen years after Fire Patch), Maleficent struck the same pact with the Man in the Green Cloak. Before journeying to Bonnie Morgas, she was entrusted with a mysterious stone by Nicodemus to settle a favor on his behalf."
  ```

- [ ] **Step 5: Add Moriarty**
  Run:
  ```bash
  bun run agent player add --id "moriarty" --name "Moriarty" --class "Sorcerer" --level 1 --ancestry "Tiefling" && \
  bun run agent player update "moriarty" --description "A cunning tiefling sorcerer wielding arcane power under the shadow of the Spire." --backstory "Three years ago (Year 512), Moriarty stood at death's door and accepted the Man in the Green Cloak's offer of salvation, arriving in Shrike bound to the mission of unbinding the Nameless God."
  ```

---

### Task 5: Populate Timeline Events

**Files:**
- Modify: `data/campaign.yml` via `bun run agent event add`

- [ ] **Step 1: Event 1 - Severance of Shrike (Year 0)**
  Run:
  ```bash
  bun run agent event add --id "evt-shrike-severed" --title "The Severance of Shrike and the Pierced God" --type "general" --era "Shrike Era" --year 0 --month "Month 1" --day 1 --locationId "shrike" --description "Approximately 515 years ago, Shrike was severed from the rest of Hell. At the peak of the spire, an immortal Nameless God was pierced through; sustained by divine energy he cannot die, and his flowing blood nourishes the dark life and arcane power of the spire."
  ```

- [ ] **Step 2: Event 2 - Loki Morgulis Arrival (Year 15)**
  Run:
  ```bash
  bun run agent event add --id "evt-arrival-loki" --title "Arrival of Loki Morgulis" --type "general" --era "Shrike Era" --year 15 --month "Month 1" --day 1 --locationId "both-of-the-iron-coffins" --description "Fifteen years after Shrike's creation (~500 years ago), Loki Morgulis, an elven wizard facing damnation for mortal atrocities, accepts an offer of redemption from the Man in the Green Cloak to enter Shrike and free the Nameless God."
  ```

- [ ] **Step 3: Event 3 - Fire Patch Arrival (Year 495)**
  Run:
  ```bash
  bun run agent event add --id "evt-arrival-fire-patch" --title "Arrival of Fire Patch" --type "general" --era "Shrike Era" --year 495 --month "Month 1" --day 1 --locationId "both-of-the-iron-coffins" --description "Four hundred and eighty years after Loki (20 years ago), Fire Patch, a Fire Bolt ranger, receives the redemption offer from the Man in the Green Cloak at the moment of his death and awakens in Shrike."
  ```

- [ ] **Step 4: Event 4 - Maleficent Arrival (Year 510)**
  Run:
  ```bash
  bun run agent event add --id "evt-arrival-maleficent" --title "Arrival of Maleficent" --type "general" --era "Shrike Era" --year 510 --month "Month 1" --day 1 --locationId "both-of-the-iron-coffins" --description "Fifteen years after Fire Patch (5 years ago), Maleficent, a faun rogue, accepts the Man in the Green Cloak's offer upon death and is sent to Shrike."
  ```

- [ ] **Step 5: Event 5 - Moriarty Arrival (Year 512)**
  Run:
  ```bash
  bun run agent event add --id "evt-arrival-moriarty" --title "Arrival of Moriarty" --type "general" --era "Shrike Era" --year 512 --month "Month 1" --day 1 --locationId "both-of-the-iron-coffins" --description "Three years ago, Moriarty, a tiefling sorcerer, receives the offer of salvation from the Man in the Green Cloak and is sent to Shrike."
  ```

- [ ] **Step 6: Event 6 - Flora Arrival (Year 513)**
  Run:
  ```bash
  bun run agent event add --id "evt-arrival-flora" --title "Arrival of Flora" --type "general" --era "Shrike Era" --year 513 --month "Month 1" --day 1 --locationId "both-of-the-iron-coffins" --description "Two years ago, Flora, an Eteris assassin, is granted a chance at redemption by the Man in the Green Cloak and sent to Shrike."
  ```

- [ ] **Step 7: Event 7 - Battle with the Four-Handed Monstrosity (Year 515, Month 4, Day 11)**
  Run:
  ```bash
  bun run agent event add --id "evt-battle-four-handed-monstrosity" --title "Battle with the Four-Handed Monstrosity" --type "combat" --era "Shrike Era" --year 515 --month "Month 4" --day 11 --locationId "shrike" --description "The party intervenes in a vicious skirmish to assist Sir Alabaster Cain of the House of Salt against a four-handed monstrosity. In gratitude, Cain promises them a favor should they seek him out at the House of Salt."
  ```

- [ ] **Step 8: Event 8 - The Errand for Nicodemus (Year 515, Month 4, Day 11)**
  Run:
  ```bash
  bun run agent event add --id "evt-nicodemus-stone" --title "The Errand for Nicodemus" --type "general" --era "Shrike Era" --year 515 --month "Month 4" --day 11 --locationId "hollowtown" --description "Nicodemus entrusts a peculiar stone to Maleficent to be carried to Bonnie Morgas, repaying an outstanding favor."
  ```

- [ ] **Step 9: Event 9 - Awakening at Bonnie Morga's Cottage (Year 515, Month 4, Day 11)**
  Run:
  ```bash
  bun run agent event add --id "evt-memories-restored-bonnie" --title "Awakening at Bonnie Morga's Cottage" --type "npc_meet" --era "Shrike Era" --year 515 --month "Month 4" --day 11 --locationId "bonnie-morgas-cottage" --description "The party reaches Bonnie Morga's cottage seeking knowledge. In a pro bono gesture, Bonnie has the party drink blood. The draught restores their lost memories of their mortality and deaths, revealing they were each tasked by the Man in the Green Cloak to free the pierced Nameless God."
  ```

---

### Task 6: Populate Quests and Home Configuration

**Files:**
- Modify: `data/campaign.yml` via `bun run agent quest add` and `bun run agent home update`

- [ ] **Step 1: Add quests**
  Run:
  ```bash
  bun run agent quest add --title "Bring Ezekiel Frond to Bonnie Morgas" --status "active" --locationId "leviathan-husk" --description "Bonnie Morgas asked the party for a favor: bring Ezekiel Frond from the leviathan husk to her cottage, claiming she wishes to take him on as a student." && \
  bun run agent quest add --title "Deliver Nicodemus's Stone to Bonnie Morgas" --status "completed" --locationId "bonnie-morgas-cottage" --description "Delivered the peculiar stone from Nicodemus to Bonnie Morgas at her cottage to settle an old favor." && \
  bun run agent quest add --title "Seek the Favor of Sir Alabaster Cain" --status "pending" --locationId "house-of-salt" --description "Visit Sir Alabaster Cain at the House of Salt to collect the reward and favor promised for helping him defeat the four-handed monstrosity." && \
  bun run agent quest add --title "Free the Pierced Nameless God" --status "pending" --locationId "shrike" --description "The overarching pact made with the Man in the Green Cloak: ascend the spire of Shrike and unbind the immortal, bleeding Nameless God whose divine blood sustains the realm."
  ```

- [ ] **Step 2: Update Home Header & Navigation Brand**
  Run:
  ```bash
  bun run agent home update --title "Escape from Shrike" --description "Five condemned souls granted a second chance upon the Spire of Shrike. Bound by blood and restored memory, their immediate task is to bring Ezekiel Frond to Bonnie Morgas." --navBrand "Escape from Shrike" --lastLocationId "bonnie-morgas-cottage" --nextDestinationId "leviathan-husk"
  ```

---

### Task 7: Verification

**Files:**
- Read / Inspect: `data/campaign.yml`
- Test: CLI & Next.js production build

- [ ] **Step 1: Verify data via Agent CLI list commands**
  Run:
  ```bash
  bun run agent player list && bun run agent location list && bun run agent npc list && bun run agent event list && bun run agent quest list
  ```
  Expected: All 5 players, 7 locations, 6 NPCs, 9 events, and 4 quests listed accurately.

- [ ] **Step 2: Run test suite**
  Run:
  ```bash
  bun test
  ```
  Expected: 11 passing tests.

- [ ] **Step 3: Run production build**
  Run:
  ```bash
  bun run build
  ```
  Expected: Successful compilation and static HTML generation for all routes including `/players/[id]` (5 pages), `/locations/[id]` (7 pages), and `/npcs/[id]` (6 pages).
