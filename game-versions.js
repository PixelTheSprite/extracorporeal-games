/* Versions of each game, shown in the "Version" menu of the Back to Portfolio bar.
   Key: the game's folder name under games/.  List newest first.
     file    – the HTML file, in the same folder as the current version
     label   – short name shown in the menu, e.g. "v2"
     note    – a few words on what changed
     current – true on the version the hub's Play button opens
   A game with fewer than two entries (or none) shows no menu. */

window.GAME_VERSIONS = {
  floralis: [
    { file: 'floralis.html', label: 'v2', note: 'A Mendelian Garden', current: true },
    { file: 'floralis-v1.html', label: 'v1', note: 'Mendelian Flower Garden' },
  ],
};
