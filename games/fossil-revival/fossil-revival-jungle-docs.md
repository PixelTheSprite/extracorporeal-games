# Fossil Revival: Jungle Expedition — Code Documentation

## Overview
A single-file browser game. You travel an island of 12 outposts, explore each one top-down, descend into side-scrolling dig sites to find power-ups and fossil beds, brush bones out of the ground in a grid minigame, revive complete species, and train them in turn-based battles. Every graphic is drawn from code in a chunky pixel-art style under an adventure-jungle theme (thatch, bamboo, tiki totems, sunset skies). No emoji or image files are used.

## File Structure
One `.html` file: `<style>` (CSS variables, wood/bamboo UI kit, responsive rules) → HTML shell (header banner, Load/Save/New toolbar, tab rail, five `<section>` panels) → one `<script>` made of these modules, in order:

| Module | Purpose |
|---|---|
| `sprites.js` section | Palette, string-art icons (8×8), rect-built creatures (24×16) and enemies (16×16), humanoid templates with palette "looks", procedural tile textures, `outline`/`bevel`/`boneTint`/`silhouette` helpers |
| `core.js` section | Data (creatures, 12 locations, road graph, difficulties, inventory), `appState`, persistence, tab switching, header banner |
| `Ex` | Excavation grid minigame |
| `Mapv` / `Town` / `Dig` / `World` | Overworld, outpost explorer, metroidvania dig site, and the shell that owns the canvas, loop, fades, HUD and input |
| `Rev` / `Train` / `Guide` | Revival chamber, training + battles, field guide |

All world views render to one 320×192 canvas and are scaled by whole-number factors with `image-rendering: pixelated`, so pixels stay crisp.

## Data Model (`appState`)
```json
{
  "v": 1,
  "fossils":  { "triceratops": ["skull","frill"] },
  "revived":  { "triceratops": true },
  "stats":    { "triceratops": { "hp":88,"atk":71,"def":94,"spd":44,"spc":31,"stm":83,"level":3,"exp":40,"next":169 } },
  "inv":      { "s12":0,"s22":0,"s31":0,"sx":0,"clicks":0,"sonar":0 },
  "abil":     { "jump": false, "pick": false },
  "maxHp": 3,
  "visited":  { "landing": true },
  "at": "landing",
  "dig":      { "<outpostId>": { "taken": { "<itemId>": true }, "broken": { "x,y": true } } },
  "chests":   { "<outpostId>": true, "<outpostId>_gift": true }
}
```
Dig-site layouts are not stored: they are regenerated from a seed built from the outpost id, and only `taken` and `broken` are saved.

## Key Components

### Overworld (`Mapv`)
The island is generated once from metaballs around each outpost, with sand beaches, a river, scattered trees and plank bridges where roads cross water. Clicking an outpost runs a BFS over the road graph and walks the avatar hop by hop, auto-entering on arrival. Hover shows an info panel; HTML labels sit over the canvas.

### Outpost explorer (`Town`)
A 30×22 tile village per outpost, seeded by id and styled by biome (beach, jungle, savanna, ruins, swamp, cave, volcano). Pixel movement with AABB collision, y-sorted drawing, wandering NPCs with a typewriter dialogue box, readable signs, one chest per outpost, and a gift from the trader. The cave at the north end asks before descending; the south gap returns to the map.

### Dig site (`Dig`)
A 3×3 grid of chambers (24×13 tiles) joined by open passages, ladders, and two pickaxe-sealed walls. Fixed-step physics (1/120 s) with coyote time, jump buffering, variable jump height, one-way platforms, drop-through (Down + Jump), ladders, spikes and stompable beetles.
- **Pickaxe (X)** breaks cracked walls and gates a whole chamber.
- **Spring Boots** add a double jump; some ledges are four tiles above the platform below them, so they need it.
- **Fossil beds** open the Excavation minigame for that site's species at a depth-scaled difficulty and are then marked used.
- **Items:** spades and drills, +5 swings, sonar drums, and heart containers (max 8).
Layout is checked so every item is reachable with both abilities, and ledges and the sealed chamber are placed so ladders cannot bypass the gating.

### Excavation (`Ex`)
Grid sizes 8–14 and swing limits by difficulty. Bones from several species share one plot. Cold/near/warm/hot soil tinting hints at distance, hidden crates give consumables, and spades (1×2, 2×2, 3×1, cross), sonar and +5 swings come from your satchel. Finds are saved immediately.

### Revival, Training, Field Guide
Revival shows silhouette / bone-tint / full-colour sprites by progress and plays a short awakening ritual. Training offers six regimens plus a turn-based arena (moves scale with stats; enemies scale with level). The Field Guide shows species, parts, stats, outposts, gear and beds dug.

## Data Persistence
- **Save / Load** use `showSaveFilePicker` / `showOpenFilePicker` to write and read a `.json` file.
- If those are unavailable, blocked (for example in an embedded page) or cancelled, the game uses `localStorage` under `fossil_revival_jungle_expedition_v1`.
- Progress also autosaves to `localStorage` shortly after every change and is restored on load.
- **New** needs two presses (it shows "Sure?"), because `window.confirm` is blocked in sandboxed pages.

## Styling System
CSS variables define the palette (ink, wood, bamboo, leaf, cream, gold, teal). Panels use stacked inset box-shadows for a carved-wood border, and bars use repeating gradients for pixel segments. Fonts are Press Start 2P (headings) and VT323 (body) from Google Fonts, with monospace fallbacks. Mobile-first with breakpoints at 481 px and 1025 px; touch targets are at least 44 px and an on-screen D-pad plus A/B buttons appear on touch devices.

## How to Run Locally
1. Save the `.html` file anywhere.
2. Open it in Chrome or Edge (Firefox lacks the File System Access API and uses browser storage instead).
3. Use Save / Load for a `.json` file; otherwise progress stays in this browser.

## Controls
Arrows or WASD move and climb. Space jumps (and talks or interacts). X swings the pickaxe. Down + Jump drops through a platform. R returns to the dig-site entrance rope. Esc leaves a dig site or outpost.

## Known Limitations / Future Ideas
- Layout and double-jump reach were verified with scripted tests, but the platforming has not had extended human playtesting.
- At a few outposts one ledge item sits close enough to a ladder to be reachable before the boots are found.
- Dig-site layouts share one template per outpost; more room shapes and enemy types would add variety.
- No sound yet; a small WebAudio chiptune layer would suit the theme.
- Fonts need network access on first load; offline they fall back to monospace.
