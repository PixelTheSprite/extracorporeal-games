/* Adds a "Version" menu to the Back to Portfolio bar when a game has more than one
   version listed in game-versions.js. Styled by portfolio-toolbar.css. */
(function () {
  function init() {
    var bar = document.getElementById('portfolio-toolbar');
    var all = window.GAME_VERSIONS || {};
    if (!bar) return;

    // .../games/<game>/<file>.html
    var parts = decodeURIComponent(location.pathname).split('/');
    var file = parts[parts.length - 1] || '';
    var game = parts[parts.length - 2] || '';
    var versions = all[game];
    if (!versions || versions.length < 2) return;

    var here = null;
    for (var i = 0; i < versions.length; i++) {
      if (versions[i].file === file) here = versions[i];
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
      if (/^[\w.-]+\.html$/.test(select.value)) location.href = select.value;
    });
    wrap.appendChild(select);

    if (here && !here.current) {
      var tag = document.createElement('span');
      tag.className = 'portfolio-version-old';
      tag.textContent = 'Older version';
      bar.appendChild(tag);
    }
    bar.appendChild(wrap);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
