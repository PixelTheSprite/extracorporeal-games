/* Versions of each game, shown in the "Version" menu of the Back to Portfolio bar.
   Key: the game's folder name under games/.  List newest first.
     file    – the HTML file, in the same folder as the current version (or a
             path from that folder, e.g. 'dev_versions/0.0.6/x.html', whose
             ../../ links then need one extra ../ per subfolder)
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
  'doomsday-95': [
    { file: 'doomsday-95.html', label: 'v1', current: true },
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
  'fossil-revival': [
    { file: 'fossil-revival-jungle.html', label: 'v1', current: true },
  ],
  'grand-works': [
    { file: 'card-collector.html', label: 'v1', current: true },
  ],
  'iron-hex': [
    { file: 'iron-hex.html', label: 'v1', current: true },
  ],
  'nautil.io': [
    { file: 'nautil_io.html', label: 'v2', note: 'Armory, cosmetics, commanders', current: true },
    { file: 'nautil_io_v1.html', label: 'v1', note: 'Survival and Territory' },
  ],
  plunderhex: [
    { file: 'PLUNDERHEX.IO.html', label: 'v1', current: true },
  ],
  racearound: [
    // Dev builds toward v4 live in subfolders; give their path from this folder
    { file: 'dev_versions/0.0.6/race-around_v3.html', label: 'v4 dev 0.0.6', note: 'Racer and Destruction modes', current: true },
    { file: 'dev_versions/0.0.5/race-around_v3.html', label: 'v4 dev 0.0.5', note: 'Sightseer photo mode' },
    { file: 'dev_versions/0.0.4/race-around_v3.html', label: 'v4 dev 0.0.4', note: 'Handling, lane assist' },
    { file: 'dev_versions/0.0.3/race-around_v3.html', label: 'v4 dev 0.0.3', note: '3D by default, bridges' },
    { file: 'dev_versions/0.0.2/race-around_v3.html', label: 'v4 dev 0.0.2', note: 'First low-poly 3D' },
    { file: 'dev_versions/0.0.1/race-around_v3.html', label: 'v4 dev 0.0.1', note: 'City at 2x scale' },
    { file: 'race-around_v3.html', label: 'v3', note: 'Fog City: real San Francisco'},
    { file: 'race-around_v2.html', label: 'v2', note: 'Fog City' },
    { file: 'race-around_v1.html', label: 'v1', note: 'Neon Bay' },
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
