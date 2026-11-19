# Floralis — A Mendelian Garden (Art Nouveau iteration)

Single-file browser game: gather wildflowers, cross pairs of them using Punnett-square genetics, and earn 21 laurels (achievements).

## What changed in this iteration
- **Art Nouveau UI.** Arched, double-ruled panels with gold whiplash corner flourishes. Mucha-style halo header. Arched "niche" flower cards. Sunburst seedling reveal. Medallion achievement icons. Federo, Cormorant Garamond and EB Garamond type.
- **Pixel-art flowers.** 16×24 sprites drawn on a canvas, cached as data URLs and scaled with `image-rendering: pixelated`.
  - **Bloom form**: set by the expressed petal allele's locus. P/p is a rose, Q/q an iris, R/r a tulip, W/w a poppy.
  - **Leaf habit**: set by the expressed stem allele's locus. S/s has paired leaves, T/t blade leaves, U/u alternate leaflets.
  - Colours come from the expressed alleles, as before. Outlines, shading and highlights are derived automatically.
- Flower names now use a noun that fits the species (e.g. "Velvet Damask", "Twilight Iris").
- The Herbarium (allele reference) has a new Flower Forms gallery.
- Accessibility: flower cards can be focused with the keyboard and selected with Enter or Space, the delete button is always visible on touch screens, buttons are 44px tall, and reduced-motion preferences are respected.

## Iteration 3: navigation and the flower bed
- **Menu**: the ☰ button opens a slide-out menu with the pages (Garden, Laurels, Herbarium) and the Load, Save and New Garden actions. Esc or clicking the backdrop closes it.
- **Pages**: switched by URL hash (`#garden`, `#laurels`, `#herbarium`), so the browser Back button works. Achievement toasts still appear on every page.
- **Header icons**: the `?` button opens How to Play and the `i` button opens the Herbarium, each in a modal. Esc, the ✕ button or clicking the backdrop closes them.
- **Meadow reel**: Gather Wildflower spins a strip of random wildflowers. The result is decided first and the reel eases onto it over about 2.8s (instantly with reduced motion), then the flower is planted with a grow-in animation.
- **Flower bed**: 24 plots in a CSS grid. The soil bands are one repeating background, sized to the grid row height (`--row-h`), so the rows line up at any width.
- **Tooltips**: hovering or focusing a flower shows its card. Clicking pins the card, which gains "Choose for Crossing / Release Parent" and "Uproot" buttons. Clicking outside or pressing Esc unpins it.
- Code map: `renderGarden` + the tooltip functions, `renderAchievements` / `renderHerbarium`, the meadow reel + `pickWildflower`, and the navigation/drawer/modal block just above INIT.

## Unchanged
The genetics engine, achievement rules, stats, the save/load format (old `floralis-garden.json` saves load as they are), localStorage auto-restore and the portfolio toolbar.

## Extending
- **New bloom form**: add an entry to `FLOWER_FORMS`, keyed by the uppercase petal allele. It needs `rows` (12 strings × 16 chars), `name`, `latin` and `nouns`.
- **New leaf habit**: add an entry to `LEAF_HABITS`, keyed by the uppercase stem allele.
- **Sprite codes**: `O` outline, `P`/`D`/`H` petal base, shade and light, `C`/`c` pistil, `G`/`g` stem, `L`/`l` leaf, `K` leaf outline, `.` empty. Sprites are validated at startup.
