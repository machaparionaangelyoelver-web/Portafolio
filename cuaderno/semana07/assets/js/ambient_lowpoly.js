// Low-poly que respira: malla de triángulos con luz animada (muy liviano)
(function () {
  const cvs = document.getElementById('contentLowpoly');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  let W = 0, H = 0, cols = 0, rows = 0, grid = [];
  const GAP = 120; // tamaño de celda (sube/baja para más/menos detalle)
  const HUES = [150, 170, 190]; // lima/teal/azulado

  function resize() {
    const rect = cvs.parentElement.getBoundingClientRect();
    W = cvs.width = Math.floor(rect.width);
    H = cvs.height = Math.max(800, Math.floor(rect.height));
    cols = Math.ceil(W / GAP) + 2;
    rows = Math.ceil(H / GAP) + 2;
    grid = [];
    for (let y = 0; y < rows; y++) {
      grid[y] = [];
      for (let x = 0; x < cols; x++) {
        // jitter para que no sea una grilla perfecta
        const jx = (Math.random() - 0.5) * 16;
        const jy = (Math.random() - 0.5) * 16;
        grid[y][x] = { x: x * GAP + jx, y: y * GAP + jy };
      }
    }
  }

  function tri(a, b, c, t) {
    // Luz animada por tiempo (sin Perlin para mantenerlo liviano)
    const cx = (a.x + b.x + c.x) / 3;
    const cy = (a.y + b.y + c.y) / 3;
    const n = Math.sin((cx + t * 40) * 0.002) + Math.cos((cy - t * 30) * 0.0025);
    const hue = HUES[(Math.floor((cx + cy) / 600) % HUES.length + HUES.length) % HUES.length];
    const light = 70 + n * 12;  // 58–82 aprox
    const alpha = 0.35 + (n + 1) * 0.12; // 0.11–0.59
    ctx.fillStyle = `hsla(${hue}, 60%, ${light}%, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y);
    ctx.closePath(); ctx.fill();
  }

  function draw(tms) {
    const t = tms / 1000;
    ctx.clearRect(0, 0, W, H);
    // dibuja dos triángulos por celda (triangulación alternada)
    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols - 1; x++) {
        const p = grid[y][x], q = grid[y][x + 1], r = grid[y + 1][x], s = grid[y + 1][x + 1];
        if ((x + y) % 2 === 0) { tri(p, q, s, t); tri(p, s, r, t); }
        else { tri(p, q, r, t); tri(q, s, r, t); }
      }
    }
    requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(cvs.parentElement);
  resize(); requestAnimationFrame(draw);
})();

