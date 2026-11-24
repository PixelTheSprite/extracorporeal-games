/* Adds a "Version" menu to the Back to Portfolio bar, listing the versions of the
   game from game-versions.js. Styled by portfolio-toolbar.css. */
(function () {
  function init() {
    var bar = document.getElementById('portfolio-toolbar');
    var all = window.GAME_VERSIONS || {};
    if (!bar) return;

    // .../games/<game>/<file>.html, or .../games/<game>/<sub>/<folders>/<file>.html
    // for builds kept in a subfolder (file is then 'sub/folders/file.html')
    var parts = decodeURIComponent(location.pathname).split('/');
    var gi = parts.lastIndexOf('games', parts.length - 3);
    if (gi < 0) gi = parts.length - 3;
    var game = parts[gi + 1] || '';
    var file = parts.slice(gi + 2).join('/');
    // How many folders below the game folder this page sits
    var up = '';
    for (var d = gi + 3; d < parts.length; d++) up += '../';
    var versions = all[game];
    // Every game gets the menu; one that isn't listed shows just the open page
    if (!versions || !versions.length) versions = [{ file: file, label: 'v1', current: true }];

    var here = null, hereAt = -1, currentAt = -1;
    for (var i = 0; i < versions.length; i++) {
      if (versions[i].file === file) { here = versions[i]; hereAt = i; }
      if (versions[i].current) currentAt = i;
    }

    var wrap = document.createElement('label');
    wrap.className = 'portfolio-version';

    var caption = document.createElement('span');
    caption.className = 'portfolio-version-caption';
    caption.textContent = 'Version';
    wrap.appendChild(caption);

    var select = document.createElement('select');
    select.setAttribute('aria-label', 'Game version');
    versions.forEach(function (v) {
      var option = document.createElement('option');
      option.value = v.file;
      option.textContent = v.label + (v.current ? ' (current)' : '') + (v.note ? ': ' + v.note : '');
      if (v === here) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener('change', function () {
      var v = select.value;
      if (/^([\w.-]+\/)*[\w.-]+\.html$/.test(v) && !/(^|\/)\.\.?\//.test(v)) location.href = up + v;
    });
    wrap.appendChild(select);

    if (here && !here.current) {
      var tag = document.createElement('span');
      tag.className = 'portfolio-version-old';
      // Listed above the current version (newest first) means a newer, unreleased build
      tag.textContent = currentAt >= 0 && hereAt < currentAt ? 'Dev build' : 'Older version';
      bar.appendChild(tag);
    }
    bar.appendChild(wrap);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
