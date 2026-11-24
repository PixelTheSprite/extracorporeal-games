# PLUNDERHEX.IO — Code Documentation

## Overview
PLUNDERHEX.IO is a real-time Age of Sail arcade game. You captain a pixel ship on an isometric hex sea, fight Crown forts and frigates with broadsides, and paint and hold territory. It combines the hex grid and supply-radius territory rules from Iron Hex with the live, sail-over-it territory painting from nautil.io, and adds a Valheim-style wind model so that steering is a skill. The page around the game is a late-90s GeoCities pirate fan site.

## File Structure
One self-contained `plunderhex.html`:
1. **HTML**: marquee ticker, masthead, a three-column layout of Win98-style windows (navigation and save controls, the game window, chart/stats/log/guestbook), and a footer web ring.
2. **CSS**: one `<style>` block, mobile-first with `min-width` breakpoints at 481px and 1025px.
3. **JS**: one `<script>` block, organized into labelled sections (constants, hex map, supply and territory, wind, ships, AI, forts and buoys, projectiles, game flow, rendering, minimap and sidebar, sound, persistence, input, boot).

The only external resource is Google Fonts (Press Start 2P, VT323); everything else falls back gracefully.

## Data Model
**Persisted (`appState`)**, saved as JSON:
```json
{
  "guestbook": [{ "name": "Calico Jack", "score": 12345, "win": true, "territory": 56, "date": "2026-10-05" }],
  "visits": 7,
  "settings": { "sound": true, "music": true }
}
```
**Runtime (`game` plus world arrays)**: `game` holds state (`title`, `play`, `paused`, `over`), score, lives, camera and timers. The world lives in `hexes`, `forts`, `ships`, `balls`, `buoys`, `parts` (particles), `streaks` (wind lines) and the `wind` object. Runtime state is rebuilt each voyage and is not saved.

## Key Components

### Hex map (`genMap`, `hexAt`, `hexDist`)
A 38 × 30 pointy-top hex grid in offset rows, addressed with axial `q, r`. Islands are made from random blob seeds plus smoothed per-hex noise; landlocked lakes are filled so every water hex is reachable. Fort sites are coastal land hexes at least 6 hexes apart: the leftmost is your home (Tortuga), the five furthest east belong to the Crown, and the rest start neutral. `hexAt(x, y)` converts world coordinates to a hex using cube rounding.

### Isometric rendering (`render`, `drawWater`, `drawLand`, `drawFort`, `drawShip`)
The game draws to a 480 × 270 canvas scaled up with `image-rendering: pixelated`. World y is squashed by `ISO = 0.55` and height (`z`) is subtracted from screen y, so land hexes are extruded prisms and masts stand upright. Land, forts, ships and buoys are depth-sorted by world y each frame. Ships are drawn from local hull coordinates projected through the ship's heading; sails rotate with the wind and billow in proportion to sail efficiency.

### Wind (`sailEff`, `updateWind`)
`sailEff(heading)` returns sail power from 0.03 (pointing within about 35° of the wind source, "in irons") up to 1.0 on a beam reach, easing to 0.8 when running dead downwind. The wind slowly drifts to a new direction and strength every 25–45 seconds. Sail settings: back oars, furled, oars (slow but works in any direction), half sail, full sail. Raised sails also add a little leeway drift downwind. The HUD compass ring is colored by `sailEff` for every heading, so you can see where the fast headings are.

### Territory (`paintTerritory`, `territoryTick`, `recomputeSupply`)
Every hex has a control value from −1 (Crown) to +1 (pirates); beyond ±0.5 it counts as owned. Ships paint the hex they are on and its neighbors in real time. Active forts lock in the hexes right around them. Every half second, owned hexes spread to neighbors that sit inside that side's supply range (4 hexes from a fort, 3 from a buoy), and anything outside supply fades back to neutral. This means painting far from your supply is temporary.

### Forts and capture (`updateFort`, `damageFort`, `captureFort`)
Crown and pirate forts fire leading shots at enemy ships in range; neutral forts stay quiet. A fort at 0 HP is silenced: it stops firing and stops supplying. Keep a ship within 72 units with no enemy ship nearby for 4 seconds to raise your flag. Silenced forts start repairing 12 seconds after their last hit and re-arm at 35% HP. Sailing near your own fort repairs both your ship and the fort.

### Supply buoys (`dropBuoy`, `damageBuoy`)
Press F to drop a buoy astern (6-second cooldown, max 4; a fifth pulls up the oldest). Buoys are mobile supply points, the sea version of Iron Hex flags. Crown ships and forts will shoot them.

### Crown AI (`aiThink`, `aiUpdate`, `waterPath`)
Each frigate picks a goal: hunt the player if within 260 units; otherwise capture a silenced fort, siege a pirate fort or buoy, siege a neutral fort, or repaint pirate water. It routes with a breadth-first search over water hexes, tacks at about 66° off the wind when the goal is upwind, orbits targets to bring a broadside to bear, and backs off or is nudged free if wedged against land. Reinforcements launch from active Crown forts, scaling with forts held and elapsed time.

### Win and loss
Win by holding 55% of all hexes or taking every Crown fort. Lose if the Crown reaches 55% or all three of your ships are sunk. These are constants (`WIN_PCT`, `game.lives`) at the top of the script.

### Sound (`sfx`, `music`)
WebAudio synthesizes cannon booms, splashes, hits and jingles from a noise buffer and oscillators. The "MIDI" is a square-wave and triangle-bass rendition of the traditional shanty *What Shall We Do with the Drunken Sailor*, scheduled with a lookahead timer. Audio starts on the first click, as browsers require.

### Sidebar (`drawMinimap`, `updateSidebar`, `log`)
Every 250 ms the Ship's Chart redraws a hex-per-pixel-block minimap with territory, forts, ships, buoys and the camera rectangle, and the stats table refreshes. The Captain's Log is an IRC-style event feed.

## Data Persistence
`saveToFile()` always writes to `localStorage` first, then tries `window.showSaveFilePicker` to write `captains-log.json` to disk, reusing the same file handle afterward. `loadFromFile()` uses `window.showOpenFilePicker` and falls back to `localStorage` if the API is unavailable or blocked (it is blocked inside sandboxed iframes, including the published claude.ai page). Loaded data is validated and clamped before use. **New** needs a second click within 3 seconds to clear the guestbook. Signing the guestbook and toggling sound also save to `localStorage` automatically.

## Styling System
CSS custom properties define the page palette (navy night `--page`, gold, blood red), the Win98 chrome greys, and four font stacks: Press Start 2P (pixel headings and the canvas HUD), VT323 (marquee and terminal log), Times New Roman (body, for period accuracy) and Tahoma (window chrome). The background is an inline SVG tile of pixel skulls and stars. Windows use 2px outset and inset borders, and a gradient title bar.

## How to Run Locally
1. Save `plunderhex.html` anywhere on your computer.
2. Open it in Chrome or Edge (Firefox lacks the File System Access API, so saves go to the browser only).
3. Click the game or press Enter to set sail. Use Load and Save to keep your guestbook in a `.json` file.

## Known Limitations / Future Ideas
- Only one player faction; a second AI faction (e.g. a rival pirate or a Spanish fleet) would make the map three-way.
- Ships have no hull classes; a ship roster (sloop, brig, frigate, man-o'-war) would map well onto the Iron Hex unit editor's 0–10 stats.
- Fort damage is a single HP pool; per-wall damage and chain shot that targets sails would deepen combat.
- Tuning constants (wind speeds, supply radii, reload times, spawn rates) are at the top of the script and not yet exposed in a settings screen.
- No multiplayer; nautil.io-style online play would need a server.
