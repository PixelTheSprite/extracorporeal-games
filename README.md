# Game Portfolio

A collection of interactive games and educational tools exploring media literacy, game design, and systems thinking.

## Games Included

- **The Arena** - Bad-faith rhetoric identification trainer
- **The Stacks** - Research literacy and source evaluation game
- **Fighting Game** - Browser-based fighting game with Nintendo parody characters
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

This site is deployed on GitHub Pages at: `https://YOUR_USERNAME.github.io/game-portfolio`

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
