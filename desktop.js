// Copied from the profile site (pixelthesprite.github.io/assets/js/desktop.js); keep the two in sync.
// Desktop touches shared by every page:
//  - the spinning pixel globe logo (any <canvas data-globe>)
//  - the taskbar clock (any element with data-clock)
//  - the 90s-style visit counter (any element with data-visit-counter)
//  - "Back" buttons (any button with data-back; shown only when there's a page to go back to)
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Pixel globe ----------
  // A tiny world map (32 x 16, longitude -180..180, latitude 90..-90). '#' is land.
  // It's wrapped onto a sphere each frame and nudged east to make it spin.
  var MAP = [
    '................................',
    '......###...###.....######......',
    '..#######..###....############..',
    '...########.......############..',
    '....######.......#############..',
    '.....####........##.##########..',
    '......##........######..####....',
    '.......##.......#######..##.##..',
    '........###......#####.....#....',
    '........####......####....###...',
    '.........###......###....####...',
    '.........##.......##......##....',
    '.........#......................',
    '................................',
    '................................',
    '################################'
  ];
  var MAP_W = 32, MAP_H = MAP.length;

  // Three shades each, dark to light, so the globe looks lit from the top left.
  var OCEAN = ['#000060', '#0000a8', '#3a6ee8'];
  var LAND = ['#005000', '#00a800', '#5ce65c'];
  var RIM = '#000000';

  var SIZE = 22;          // canvas pixels; CSS draws it at 2x
  var CENTER = SIZE / 2;
  var RADIUS = 9.5;       // sphere radius; one more pixel for the black rim
  var LIGHT = normalize([-0.55, -0.6, 0.6]);

  function normalize(v) {
    var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  function isLand(col, row) {
    var line = MAP[row] || '';
    return line.charAt(col) === '#';
  }

  function drawGlobe(ctx, spin) {
    ctx.clearRect(0, 0, SIZE, SIZE);
    for (var j = 0; j < SIZE; j++) {
      for (var i = 0; i < SIZE; i++) {
        var dx = i + 0.5 - CENTER;
        var dy = j + 0.5 - CENTER;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > RADIUS + 1) continue;
        if (dist > RADIUS) {
          ctx.fillStyle = RIM;
        } else {
          var x = dx / RADIUS, y = dy / RADIUS;
          var z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
          var lat = Math.asin(-y);
          var lon = Math.atan2(x, z) + spin;
          var u = (lon / (2 * Math.PI)) % 1;
          if (u < 0) u += 1;
          var col = Math.floor(u * MAP_W);
          var row = Math.min(MAP_H - 1, Math.floor((0.5 - lat / Math.PI) * MAP_H));
          var light = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
          var shade = light > 0.75 ? 2 : light > 0.25 ? 1 : 0;
          ctx.fillStyle = (isLand(col, row) ? LAND : OCEAN)[shade];
        }
        ctx.fillRect(i, j, 1, 1);
      }
    }
  }

  document.querySelectorAll('canvas[data-globe]').forEach(function (canvas) {
    canvas.width = SIZE;
    canvas.height = SIZE;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var step = (2 * Math.PI) / 48;  // a choppy, frame-by-frame spin
    var spin = 0;
    drawGlobe(ctx, spin);
    if (reduceMotion) return;

    setInterval(function () {
      if (document.hidden) return;
      spin += step;
      drawGlobe(ctx, spin);
    }, 120);
  });

  // ---------- Taskbar clock ----------
  document.querySelectorAll('[data-clock]').forEach(function (clock) {
    function tick() {
      clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    tick();
    clock.hidden = false;
    setInterval(tick, 15000);
  });

  // ---------- Visit counter ----------
  // A real site-wide hit counter needs a server, so this counts the visitor's own
  // visits in their browser. If storage is blocked, the counter stays hidden.
  document.querySelectorAll('[data-visit-counter]').forEach(function (counter) {
    var visits;
    try {
      visits = (parseInt(localStorage.getItem('visits'), 10) || 0) + 1;
      localStorage.setItem('visits', String(visits));
    } catch (err) {
      return;
    }
    var digits = counter.querySelector('[data-visit-count]');
    var unit = counter.querySelector('[data-visit-unit]');
    if (digits) digits.textContent = String(Math.min(visits, 9999999)).padStart(7, '0');
    if (unit) unit.textContent = visits === 1 ? 'time' : 'times';
    counter.hidden = false;
  });

  // ---------- Back buttons ----------
  if (window.history.length > 1) {
    document.querySelectorAll('[data-back]').forEach(function (button) {
      button.hidden = false;
      button.addEventListener('click', function () { window.history.back(); });
    });
  }
})();
