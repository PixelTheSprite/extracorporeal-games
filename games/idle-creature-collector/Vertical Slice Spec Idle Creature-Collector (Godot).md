# Vertical Slice Spec: Idle Creature-Collector (Godot)

Nov 23, 2026 · @M

This spec turns the game section of the stack plan into a first playable slice that Claude Code can build phase by phase. Items marked **\[DEFAULT\]** are my proposals where the brief is silent; the gaps section lists what must be settled first.

## Goal and scope

The slice must prove one thing: the loop of setting snares, capturing creatures and spending them on progress holds a new player for 30 minutes, and makes them want to come back after time away.

**Pass gate.** At least 3 of 5 playtesters keep playing past 30 minutes without prompting, and at least 3 say they would reopen it the next day to collect their snares.

| In the slice | Out of the slice |
| --- | --- |
| 1 area with 6 snare sites | Additional areas, world map |
| 1 puzzle type, 8 handcrafted levels | Procedural puzzles, puzzle editor |
| 1 capture minigame | Further minigames |
| 5 creatures, 1 rarity tier each | Breeding, evolution, battles |
| Idle income from assigned creatures, offline progress up to 8 hours | Prestige or reset systems |
| 3 gear items, 1 puzzle power unlocked by a creature | Gear crafting, gear sets |
| Local save with versioning | Cloud save, accounts, Steam integration |
| Windows and macOS desktop builds | Mobile builds, store pages, purchases, analytics |
| Commissioned pixel art (grey-box placeholders until delivered), placeholder sound | Final art direction, music |

The slice is a test build, not a demo. Nothing in it needs Steamworks, store accounts or a backend.

## Core loop

&#91;embedded content: core loop · 6 steps, 1 runs while away\]

The top row is the active loop the brief describes. The bottom row is the idle layer: creatures earn Supplies that buy gear, which makes the next snare faster and the next capture easier. Snares pause while the game is closed; only workers keep earning.

## Systems

Six systems make up the slice. Every number here is a starting value that lives in a data file, so tuning never touches code.

### Snare sites

- The area has 6 snare sites. Each has a habitat (meadow, stream, rocks) and a spawn table of creatures with weights.
- A site is empty, set, or holding a catch. Setting a snare means solving that site's puzzle.
- A set snare resolves after a catch time drawn from the creature it catches: 45 seconds for common, up to 6 minutes for the rarest in the slice. The timer runs only while the game is open and pauses on quit. **\[DEFAULT\]**
- The creature is chosen when the snare is set, from the spawn table, using a seeded random generator. The player sees only a silhouette until capture.

### Snare puzzle **\[logic grid, confirmed\]**

- A grid from 5×5 to 7×7 hides 2 to 4 burrows; the creature is in one of them. Each level starts with some tiles already revealed.
- A revealed tile shows how many of its 8 neighbours hold a burrow. Rock and water tiles never hold one and start revealed.
- The player reveals safe tiles and marks burrows. Marking every burrow correctly sets the snare.
- Revealing a burrow startles the creature and costs a star. Three mistakes fail the level, which restarts with the same layout.
- Stars: 3 with no mistakes, 2 with one, 1 with two. Each star shortens the catch time by 10%.
- 8 handcrafted levels stored as data. Every level must be solvable by deduction from its starting clues, with no guessing; the level solver enforces this.
- Puzzle power: Dig, unlocked by Burrowkit, safely reveals one tile per level.

### Capture minigame **\[timing ring, confirmed\]**

- A marker sweeps around a ring. The player taps when it is inside the highlighted zone.
- 3 hits before 3 misses captures the creature. Otherwise it escapes and the site resets to empty.
- Marker speed comes from the creature's Spirit stat. Zone size comes from the player's gear.
- Must work with mouse, keyboard (space) and touch from day one, so mobile needs no redesign.

### Creatures and the camp

- Each creature has: habitat, rarity, Spirit (capture difficulty), Work (Supplies per minute) and an optional unlock.
- Captured creatures go to the camp. The player assigns up to 3 to work at once. Duplicates add to a count, not separate entities.
- Unlocks are the progress hooks from the brief: one creature unlocks Dig (a puzzle power), one unlocks the far bank (2 new snare sites).

### Idle income and offline progress

- Only workers run while the game is closed. Assigned creatures earn Supplies per minute, online and offline.
- Snare timers run only while the game is open. On quit, each snare stores its remaining time and resumes on load.
- On load, elapsed time is applied once, to Supplies only, capped at 8 hours. **\[DEFAULT cap\]**
- A return screen shows Supplies earned while away and what they can now buy. This is the moment the gate measures.
- Clock tampering is ignored in the slice; it is a single-player local save.

### Gear

- 3 items bought with Supplies: a sturdier snare (shorter catch time), a lure (more weight on rare creatures), a padded glove (wider minigame zone).
- Each has 3 levels with rising cost. Gear levels are the main Supplies sink.

### Saves

- JSON file in Godot's user data folder, with a version number and a migration function per version.
- Autosave every 30 seconds, on every capture and purchase, and on quit.
- Stores timestamps, remaining snare timers and seeds, not computed results, so loading always recomputes the same outcome.

## Slice content

All names below are placeholders for an original setting; the theme is an open gap. Numbers are first-pass values for the balance simulator to test.

### Creatures

| Creature | Habitat | Rarity | Catch time | Spirit (1–5) | Work (Supplies/min) | Unlocks |
| --- | --- | --- | --- | --- | --- | --- |
| Puffwing | Meadow | Common | 45 s | 1 | 2 | none |
| Glowcap | Rocks | Common | 60 s | 2 | 3 | none |
| Burrowkit | Meadow, rocks | Uncommon | 2 min | 2 | 4 | Dig power |
| Reedfin | Stream | Uncommon | 3 min | 3 | 5 | Far bank sites |
| Stonehorn | Far bank rocks | Rare | 6 min | 5 | 10 | none (collection goal) |

### Snare sites

| Site | Habitat | Available from | Puzzle levels |
| --- | --- | --- | --- |
| Meadow edge | Meadow | Start | 1, 2 |
| Old stump | Meadow | Start | 3 |
| Rock shelf | Rocks | 40 Supplies | 4 |
| Shallows | Stream | 80 Supplies | 5 |
| Far bank east | Far bank rocks | Owning Reedfin | 6, 7 |
| Far bank west | Far bank rocks | Owning Reedfin and Dig power | 8 |

### Gear

| Item | Effect per level | Cost by level (Supplies) |
| --- | --- | --- |
| Sturdy snare | Catch time −10% | 50 / 150 / 400 |
| Sweet lure | Rare weight ×1.25 | 75 / 200 / 500 |
| Padded glove | Minigame zone +12% | 60 / 180 / 450 |

### Intended pacing

First capture inside 2 minutes. Dig power around minute 10. Far bank around minute 20. Stonehorn is meant to be out of reach in one 30-minute session, so it becomes the reason to come back: Supplies earned offline buy the gear that brings it within reach.

### Art asset list for the artist

| Asset | Count | Size | Notes |
| --- | --- | --- | --- |
| Creature sprites | 5 | 32×32 | Idle loop (4 frames), struggle loop (4 frames), captured pose |
| Creature silhouettes | 5 | 32×32 | Shown before capture; can be generated from the sprites |
| Logic grid tiles | 1 set | 16×16 | Hidden, revealed, digits 0–8, burrow, mark, rock, water |
| Area map | 1 | 640×360 | 6 snare-site markers in 3 states: empty, set, caught |
| Camp scene | 1 | 640×360 | 3 worker spots |
| Gear icons | 9 | 24×24 | 3 items × 3 levels |
| Timing ring and UI kit | 1 set | various | Ring, zone, buttons, panels, Supplies icon |
| Pixel font | 1 | n/a | Licensed for commercial use; can be bought rather than drawn |

## Technical architecture

Game rules live in plain GDScript classes with no scene dependencies; scenes only display state and send player input. That split is what makes the rules testable headless and the content swappable.

### Pinned tools

| Tool | Version or setting |
| --- | --- |
| Godot | 4.7.x stable, standard build (not .NET), pinned in the README and CI |
| Language | Typed GDScript; untyped declarations raised to errors in project settings |
| Renderer | Compatibility |
| Base resolution | 640×360, integer scaling, nearest-neighbour filtering |
| Tests | GUT, run headless |
| CI | GitHub Actions: tests, level solver, balance simulator, then Windows and macOS exports |

### Project layout

```
res://
  core/        rules only, no Node or scene code
    sim.gd           applies elapsed time: income, snare resolution
    rng.gd           seeded random wrapper
    economy.gd       costs, gear effects, unlock checks
    grid_rules.gd    clue counts, deduction solver, star scoring
    save_codec.gd    JSON encode, decode, version migrations
  data/        Resource classes and .tres content
    defs/        CreatureDef, SiteDef, PuzzleLevelDef, GearDef, PowerDef
    creatures/  sites/  levels/  gear/
  game/        autoloads: GameState, Clock, SaveService, Catalog
  scenes/      area, puzzle, capture, camp, shop, return_summary
  ui/          shared widgets and theme
  tools/       level_solver.gd, balance_sim.gd (headless)
  tests/       GUT tests mirroring core/
```

### Rules the code must follow

- **Time is injected.** `Clock` is the only place that reads the system time. Tests and the simulator pass a fake clock.
- **Randomness is seeded.** Every roll goes through `rng.gd` with a seed stored in the save, so a given save always produces the same outcome.
- **Content is data.** Adding a creature, site, level or gear item is a new `.tres` file. `Catalog` loads everything from `data/` at start-up and validates references.
- **State is plain data.** `GameState` holds dictionaries and arrays that serialise directly to JSON; no node references inside it.
- **Scenes talk through signals.** A minigame scene receives a creature id and emits `capture_finished(success)`; it never edits state itself.

### Tooling scripts

- **Level solver:** checks each puzzle level can be solved by deduction alone from its starting clues, with no guessing, and fails CI otherwise.
- **Balance simulator:** plays a scripted player through 30 minutes active plus an 8-hour absence and prints when each milestone lands. CI fails if first capture exceeds 2 minutes or Far bank exceeds 30 minutes.

## Build phases for Claude Code

Nine phases, one per Claude Code session, each closed only when its tests pass in CI. Rules come before screens, so most of the game is testable before anything is drawn.

| Phase | Builds | Done when |
| --- | --- | --- |
| 0. Skeleton | Godot project, folder layout, GUT, CI workflow, empty autoloads, README with pinned versions | CI runs green on an empty test and exports a blank Windows and macOS build |
| 1. Data and rules core | Def resource classes, `Catalog` with validation, `rng.gd`, `Clock`, `sim.gd`, `economy.gd`, all slice content as `.tres` | Unit tests cover income, snare resolution, offline cap, unlock checks; a broken reference in data fails start-up with a clear message |
| 2. Snare puzzle | `grid_rules.gd`, puzzle scene, 8 levels, level solver | Every level solvable without guessing in CI; mistakes cost stars as specified; Dig reveals exactly one safe tile |
| 3. Capture minigame | Timing-ring scene with mouse, keyboard and touch input | Spirit and glove level change difficulty as specified; scene emits one result and edits no state |
| 4. Area and camp | Area screen with 6 sites and states, camp with worker assignment, gear shop | A full loop is playable from empty site to spent Supplies |
| 5. Saves and return | `save_codec.gd`, autosave, return summary screen | Save, quit, advance the fake clock 3 hours, load: Supplies match the simulator exactly and snare timers are unchanged; a version-0 save migrates |
| 6. Balance pass | Balance simulator in CI, tuning of data values only | Milestones land inside the pacing targets; no code changed in this phase |
| 7. Debug and optimisation | Profiling, input edge cases, window resizing, a debug overlay with time skip | No errors in a 30-minute scripted run; steady 60 fps on a low-end laptop |
| 8. Playtest build | Commissioned art swapped in for grey boxes, sound cues, build notes, short feedback form link | Signed builds handed to 5 testers |

Phases 2 and 3 do not depend on each other and can run in either order.

## Gaps to close before any code

Four gaps are settled and folded into the spec above. Of those still open, the art commission is the most urgent: it needs a theme and a brief before an artist can start, and commissioned art takes weeks.

### Settled

| Decision | Answer | What changed in the spec |
| --- | --- | --- |
| Snare puzzle style | Logic grid | Burrow-deduction rules, a no-guessing level solver, Dig reveals a safe tile |
| Capture minigame | Timing ring | No change |
| Idle layer | Workers only | Snare timers pause on quit; offline time adds Supplies only |
| Art source | Commissioned artist | Grey boxes until delivery; asset list added under Slice content |

### Still open

| Gap | Blocks | Why it matters | Default if unanswered |
| --- | --- | --- | --- |
| Setting, creature theme and working title | Art brief | The artist cannot start without it | Original woodland setting, placeholder names as in this spec |
| Artist, budget, deadline and rights | Phase 8 | Contract must grant full commercial rights, including for mobile stores later | None: needs you |
| Creature sprite size | Art brief, Phase 3 layout | 32×32 reads better on phones than 16×16 | 32×32 creatures on 16×16 tiles |
| Logic grid clue style | Phase 2 | Neighbour counts (Minesweeper-like) or row and column counts (Picross-like) | Neighbour counts, as specified above |
| Relation to Spliced! and Fossil Revival | None now | Whether creatures, lore or code are shared affects later reuse | Standalone project |
| Business model | Economy after the slice | Free-to-play needs timers and a currency built for purchases | Premium-style economy, no purchase hooks in the slice |
| Target age of players | Store setup, AB 1043 age signal | Under-13 players bring extra store and privacy rules | General audience, no personal data collected |
| Development machine and repo | Phase 0 | macOS is needed for Mac builds and later iOS | Godot 4.7 installed locally, new private GitHub repo |
| macOS signing for testers | Phase 8 | Unsigned Mac builds show a security warning | Windows-first test builds |
| Who the 5 playtesters are | Phase 8 | The pass gate needs players outside the project | You recruit them before Phase 6 ends |

## Claude Code handoff

Export this doc as Markdown into the new repo as `docs/SPEC.md`, then start Phase 0 with the prompt below. Claude Code creates the other working files itself.

| File | Purpose | Written by |
| --- | --- | --- |
| `docs/SPEC.md` | This spec, the source of truth for rules and content | You, from this doc |
| `CLAUDE.md` | Conventions: typed GDScript, core has no scene code, time and randomness injected, content as data, tests before closing a phase | Claude Code in Phase 0 |
| `ROADMAP.md` | The nine phases with status, kept under 150 lines | Claude Code in Phase 0 |
| `PROJECT_MAP.md` | One line per file: what it does, which phase made it | Claude Code, updated each phase |
| `HANDOFF.md` | What the last session finished, what is next, known issues | Claude Code at the end of each phase |

Kickoff prompt for Phase 0:

```
Read docs/SPEC.md. We are building the vertical slice in the phases listed under
"Build phases for Claude Code". Do Phase 0 only.

1. Create CLAUDE.md with the rules from "Technical architecture > Rules the code
   must follow", plus: typed GDScript everywhere, no gameplay logic in scenes.
2. Create ROADMAP.md (phases 0-8, status column) and PROJECT_MAP.md.
3. Set up the Godot 4.7 project with the folder layout in the spec, the
   Compatibility renderer, 640x360 base resolution with integer scaling.
4. Add GUT and one passing test. Add a GitHub Actions workflow that runs tests
   headless and exports Windows and macOS builds.
5. Stop when CI is green. Write HANDOFF.md and list anything in the spec that
   was ambiguous or that you had to assume.
```

Each later phase starts with: "Read HANDOFF.md, ROADMAP.md and the spec section for Phase N. Do Phase N only."
