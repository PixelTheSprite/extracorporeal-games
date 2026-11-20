# Game Portfolio

A collection of interactive games and educational tools exploring media literacy, game design, and systems thinking.

## Games Included

- **The Arena** - Bad-faith rhetoric identification trainer
- **The Stacks** - Research literacy and source evaluation game
- **Legally Distinct Mix-Em-Up** - Browser-based platform fighter with an original cast plus public-domain characters
- [Add others...]

## Running Locally

Each game runs entirely in the browser with no server required.

### Option 1: Direct File Opening

Simply open `index.html` in your browser.

### Option 2: Local Server (Recommended)

Prevents CORS issues with some assets:

```bash
# Python 3
python -m http.server 8000

# Or Node.js with http-server
npx http-server
```

Then visit `http://localhost:8000`

## Deployment

This site is deployed on GitHub Pages at: `[https://YOUR_USERNAME.github.io/game-portfolio](https://pixelthesprite.github.io/extracorporeal-games/)`

### How It Works

- Push changes to the `main` or `master` branch
- GitHub Pages automatically rebuilds and deploys
- Changes typically appear within 1-2 minutes

## Project Structure

game-portfolio/
├── index.html # Portfolio homepage
├── games/ # Individual game folders
│ ├── the-arena/
│ ├── the-stacks/
│ ├── fighting-game/
│ └── ...
├── assets/ # Shared images, fonts, audio
└── docs/ # Additional documentation

## Styling

The hub matches the main site (pixelthesprite.github.io): a Windows 95/98 desktop look.

| File | What it is |
|---|---|
| `index.css` | Hub styles. The top half mirrors the main site's `assets/css/style.css` (colors, fonts, windows, buttons, header, taskbar); keep them in sync |
| `desktop.js` | Spinning globe logo and taskbar clock, copied from the main site's `assets/js/desktop.js` |
| `portfolio-toolbar.css` | Layout for the "Back to Portfolio" bar at the top of every game (fixed 56px bar, 44px button). Each game links it, then sets `--pt-*` colour and font variables in a `<style id="portfolio-toolbar-theme">` block so the bar matches that game. New games: copy the link, theme block, two script tags and toolbar markup from any existing game. |
| `portfolio-toolbar.js` | Adds the "Version" menu to that bar (every game has one, even with a single version) |
| `game-versions.js` | The list of versions for each game (see below) |
| `achievement-system.js` | Also draws the "Achievement Unlocked!" popup, styled as a small Win95 window |

The games themselves keep their own look.

## Adding a version

Each game can keep older iterations so visitors can compare them. Every game has a **Version** menu on the right of its "Back to Portfolio" bar, listing what `game-versions.js` has for it (a game with one version shows just "v1 (current)"). Floralis and Wacky Pets have two versions; the fighting game has four.

1. Save the older HTML file **in the same folder** as the current one, e.g. `games/the-flood/the-flood-v1.html`. Keeping it in the same folder means its `../../` links (hub, toolbar, achievements) keep working.
2. Make sure the file has the toolbar link, a `portfolio-toolbar-theme` block, the two script tags (`game-versions.js`, `portfolio-toolbar.js`) and the toolbar markup. Copy them from the current version, and adjust the theme colours if that version looked different.
3. Add a line for it in `game-versions.js`, newest first:

   ```js
   'the-flood': [
     { file: 'the-flood.html',    label: 'v2', note: 'What changed in v2', current: true },
     { file: 'the-flood-v1.html', label: 'v1', note: 'First prototype' },
   ],
   ```

   The key is the game's folder name. `current: true` goes on the version the hub's Play button opens.

Cryptozone's "Highlight Dark Patterns" button lives inside the bar, between Back and the Version menu.

If the text on the bar (the "Version" caption and "Older version" tag) is hard to read against a game's bar colour, set `--pt-bar-color` in that game's theme block.

The fighting game's current version (`html5_scuffle.html`) is a build output: it was copied from `v4/mix_em_up_project.zip`, where it is built from `src/`. If you rebuild it, copy the new file over `html5_scuffle.html` and keep the toolbar theme (including `--pt-bar-color`) in `src/a_head.html`.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages (free hosting)

## Browser Support

All games are designed to work in modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Local Storage

Games store progress and settings in browser localStorage. This data:

- Is saved locally on your device
- Is NOT sent to any server
- Persists across sessions
- Can be cleared by clearing browser cache

## License

[Add your license here - MIT, GPL, Creative Commons, etc.]

## Contact

[Add your contact info or links]
