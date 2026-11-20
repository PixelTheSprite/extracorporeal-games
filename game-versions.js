/* Versions of each game, shown in the "Version" menu of the Back to Portfolio bar.
   Key: the game's folder name under games/.  List newest first.
     file    – the HTML file, in the same folder as the current version
     label   – short name shown in the menu, e.g. "v2"
     note    – a few words on what changed
     current – true on the version the hub's Play button opens
   Every game gets the menu. A game that isn't listed here shows a single
   "v1 (current)" entry for whatever page is open. */

window.GAME_VERSIONS = {
  'american-dream-simulator': [
    { file: 'american-dream-simulator.html', label: 'v1', current: true },
  ],
  clickin_ship: [
    { file: 'clickin_ship.html', label: 'v1', current: true },
  ],
  cryptozone: [
    { file: 'cryptozone-dark-patterns-game.html', label: 'v1', current: true },
  ],
  'fighting-game': [
    { file: 'html5_scuffle.html', label: 'v4', note: 'Six bosses, Boss Rush, costumes', current: true },
    { file: 'html5_scuffle_v3.html', label: 'v3', note: 'Boss gallery, three new bosses' },
    { file: 'html5_scuffle_v2.html', label: 'v2', note: '36 fighters, first boss' },
    { file: 'html5_scuffle_v1.html', label: 'v1', note: 'HTML5 Scuffle' },
  ],
  floralis: [
    { file: 'floralis.html', label: 'v2', note: 'A Mendelian Garden', current: true },
    { file: 'floralis-v1.html', label: 'v1', note: 'Mendelian Flower Garden' },
  ],
  'grand-works': [
    { file: 'card-collector.html', label: 'v1', current: true },
  ],
  'nautil.io': [
    { file: 'nautil_io.html', label: 'v1', current: true },
  ],
  racearound: [
    { file: 'race-around_v1.html', label: 'v1', current: true },
  ],
  'sticker-star': [
    { file: 'StickerStar.html', label: 'v1', current: true },
  ],
  'the-flood': [
    { file: 'the-flood.html', label: 'v1', current: true },
  ],
  'the-stacks': [
    { file: 'the-stacks.html', label: 'v1', current: true },
  ],
  'wacky-pets': [
    { file: 'virtual-pet-game.html', label: 'v2', current: true },
    { file: 'virtual-pet-game_v1.html', label: 'v1' },
  ],
};
