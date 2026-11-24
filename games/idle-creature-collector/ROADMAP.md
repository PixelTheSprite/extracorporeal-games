# ROADMAP: Idle Creature-Collector vertical slice

Source of truth: `docs/SPEC.md`. One phase is one Claude Code session on a Pro plan, about 1–3 features.
Close a phase only when its "Done when" passes in CI. Session prompt: "Read HANDOFF.md, ROADMAP.md and
the spec section for Phase N. Do Phase N only."

## Decisions made after the spec (apply to docs/SPEC.md in Phase 0)

- **Repo:** new standalone private GitHub repo. Standalone project, sharing nothing with other games.
- **Platforms:** Windows desktop and an HTML5 web build. macOS is dropped from the slice and returns after it.
- **Setting:** each region is based on one floristic region. The slice region is a **coastal town**.
  Proposed habitat mapping (ids change, mechanics stay the same):
  meadow → `dune` (dune grass), stream → `saltmarsh` (saltmarsh creek), rocks → `harbour` (harbour wall and
  rock pools), far bank → `breakwater`. Creature names stay placeholders until the theme task below.
- **Unchanged defaults:** neighbour-count clues, 32×32 creatures on 16×16 tiles, premium-style economy,
  general audience, no personal data collected.

## Status

| # | Phase | Status |
|---|-------|--------|
| 0 | Project skeleton and docs | todo |
| 1 | Tests and CI with Windows and web exports | todo |
| 2 | Data definitions and Catalog | todo |
| 3 | Core rules: Clock, RNG, GameState, economy | todo |
| 4 | Simulation: income, snares, offline time | todo |
| 5 | Grid rules and level solver | todo |
| 6 | Eight puzzle levels and Dig | todo |
| 7 | Puzzle scene | todo |
| 8 | Capture minigame scene | todo |
| 9 | Scene flow and area screen | todo |
| 10 | Camp and gear shop | todo |
| 11 | Saves, autosave and migration | todo |
| 12 | Return summary and offline flow | todo |
| 13 | Balance simulator and tuning | todo |
| 14 | Debug, edge cases and performance | todo |
| 15 | Playtest build | todo |

Phases 5–7 and phase 8 do not depend on each other. Phase 8 can run any time after phase 4.

## Phases

### 0. Project skeleton and docs
- Create the repo. Copy the spec to `docs/SPEC.md` and apply the decisions above.
- Create the Godot 4.7.x project with the spec's folder layout, the Compatibility renderer, 640×360 base
  resolution, integer scaling, nearest-neighbour filtering and untyped declarations raised to errors.
- Add empty autoloads `GameState`, `Clock`, `SaveService` and `Catalog`.
- Write `CLAUDE.md` (spec rules, typed GDScript, no gameplay logic in scenes), `PROJECT_MAP.md` and `HANDOFF.md`.
- **Done when:** the project opens with no errors and `godot --headless --quit` exits with code 0.

### 1. Tests and CI with Windows and web exports
- Add GUT and one passing test under `tests/`.
- Add export presets for Windows Desktop and Web (single-threaded, so it needs no special server headers).
- Add a GitHub Actions workflow that pins Godot 4.7.x, runs GUT headless and uploads both builds as artifacts.
- **Done when:** CI is green, and the Windows exe and the web build (served locally) both open a blank window.

### 2. Data definitions and Catalog
- Write the Def classes `CreatureDef`, `SiteDef`, `PuzzleLevelDef` (stub), `GearDef` and `PowerDef`.
- Add `.tres` files for 5 creatures, 6 sites, 3 gear items and the Dig power, using the coastal habitat ids.
- Have `Catalog` load all of `data/` at start-up and check every id reference and value range.
- **Done when:** tests cover loading, and a broken reference stops start-up with a message naming the file and field.

### 3. Core rules: Clock, RNG, GameState, economy
- Add `Clock` (the only reader of system time) and a `FakeClock` for tests.
- Add `rng.gd`, a seeded wrapper that gives the same roll sequence for the same seed.
- Make `GameState` plain dictionaries and arrays: Supplies, sites, camp counts, workers, gear levels, powers and seeds.
- Add `economy.gd` for gear costs and effects, site unlock costs and conditions, and the 3-worker limit.
- **Done when:** unit tests cover every row of the gear and site tables, and rolls repeat across runs.

### 4. Simulation: income, snares, offline time
- In `sim.gd`, add `advance_online(dt)`: Supplies from workers and snare timers counting down.
- Roll the creature from the spawn table (with lure weight) when a snare is set; catch time comes from the
  creature, star bonus and sturdy snare level.
- Add `apply_offline(elapsed)`: Supplies only, capped at 8 hours; snares do not move.
- **Done when:** tests cover income, snare resolution, star and gear modifiers, the offline cap, and that snares stay paused offline.

### 5. Grid rules and level solver
- In `grid_rules.gd`, add the grid model, rock and water tiles, neighbour counts, reveal and mark actions,
  mistakes, the 3-mistake fail and star scoring.
- Add a deduction solver that only makes forced moves (single-tile and paired constraints), with no guessing.
- Add `tools/level_solver.gd`, which runs headless, reports each level, and exits non-zero on a level that needs a guess. Add it to CI.
- **Done when:** tests pass for clue counts, scoring and the solver on known solvable and unsolvable grids.

### 6. Eight puzzle levels and Dig
- Fill in `PuzzleLevelDef`: size, burrows, rock and water tiles, starting reveals.
- Author 8 levels (5×5 to 7×7, 2–4 burrows) with difficulty rising across the sites in the spec's order.
  A helper script may propose layouts, but each level is saved as a `.tres` file.
- Add the Dig rule: reveals one safe, unrevealed tile and can be used once per level.
- **Done when:** the solver passes all 8 levels in CI, and Dig tests show exactly one safe tile revealed.

### 7. Puzzle scene
- Build the grey-box grid view, drawn from `grid_rules` state only.
- Input: click or tap to reveal; right-click, long-press or a mark-mode toggle to mark; keyboard cursor optional.
- Show stars and mistakes, restart on fail with the same layout, a Dig button when owned, and emit `puzzle_finished(stars)`.
- **Done when:** all 8 levels can be played start to finish with mouse and touch emulation, and the scene edits no state.

### 8. Capture minigame scene
- Build the timing ring: marker speed from Spirit, zone size from padded glove level, with the values in data.
- Input: mouse click, Space and touch, with one input per sweep and no double counts.
- Show the hit and miss count, then emit `capture_finished(success)` after 3 hits or 3 misses.
- **Done when:** tests show Spirit and glove change speed and zone as specified, and the scene emits one result.

### 9. Scene flow and area screen
- Add a main router scene that swaps area, puzzle, capture, camp, shop and return screens.
- Build the area screen: 6 grey-box site markers (locked, empty, set with timer, caught with silhouette)
  and purchase or unlock prompts for locked sites.
- Wire the loop: site → puzzle → snare set → timer → capture → creature added to the camp.
- **Done when:** a new game reaches its first capture in a manual run, with every state change going through core.

### 10. Camp and gear shop
- Build the camp screen: owned creatures with counts, 3 worker spots, assign and unassign, Supplies per minute shown.
- Build the shop: 3 gear items × 3 levels, cost, effect preview, buy button disabled when unaffordable.
- Show unlock notices for Dig (Burrowkit) and the breakwater sites (Reedfin).
- **Done when:** a full loop is playable from an empty site to spending Supplies, and both unlocks fire.

### 11. Saves, autosave and migration
- In `save_codec.gd`, add JSON encode and decode with a version number and one migration per version,
  plus a hand-written version-0 fixture.
- Store timestamps, remaining snare timers and seeds, never computed results.
- Add `SaveService` autosave every 30 seconds, on capture, on purchase, on quit (desktop) and on focus loss
  or tab hide (web, which has no reliable quit event).
- **Done when:** round-trip and migration tests pass, and a web save survives a page reload.

### 12. Return summary and offline flow
- On load, apply offline time once through `sim.apply_offline` using `Clock`.
- Build the return screen: time away (noting the cap), Supplies earned, and what can now be bought.
- Write an integration test: save, advance the fake clock 3 hours, load.
- **Done when:** in that test, Supplies match `sim` exactly and snare timers are unchanged.

### 13. Balance simulator and tuning
- Add `tools/balance_sim.gd`: a scripted player runs 30 minutes active plus 8 hours away and prints when each milestone lands.
- Add a CI gate: fail if the first capture takes over 2 minutes or the breakwater takes over 30 minutes.
- Tune data values only, aiming for Dig around minute 10, breakwater around minute 20, and Stonehorn out of reach in session 1.
- **Done when:** milestones land inside the targets and this phase changes no code outside `tools/`.

### 14. Debug, edge cases and performance
- Add a debug overlay behind a build flag: time skip, add Supplies, reveal the grid, FPS counter.
- Add a 30-minute scripted run with no errors or warnings in the log.
- Cover input edge cases (double taps, input during transitions), window resize, web tab hide and restore.
- **Done when:** the scripted run is clean, and Windows and web both hold 60 fps on a low-end laptop.

### 15. Playtest build
- Set up the art swap: import conventions, a sprite sheet and animation set-up, and silhouettes generated from sprites.
- Add placeholder sound cues: reveal, mistake, snare set, hit, miss, capture, purchase.
- Write build notes and a feedback form link on the title screen, and pick web hosting (private itch.io page or a zip).
- **Done when:** builds are handed to 5 testers. Unsigned Windows builds show a SmartScreen warning, so say so in the notes.

## Non-code track (you, in parallel)

| Task | Needed by | Notes |
|------|-----------|-------|
| Lock the coastal town theme: names for 5 creatures, 6 sites and the area | Phase 2 (ids), art brief | Draw creatures from the region's dune, saltmarsh and harbour plant communities |
| Art brief and artist contract (full commercial rights, including mobile later) | Start before Phase 5 | Commissioned art takes weeks; asset list is in the spec |
| Buy a commercial pixel font | Phase 15 | |
| Recruit 5 playtesters from outside the project | Before Phase 13 ends | Pass gate: 3 of 5 play past 30 minutes and would return next day |
