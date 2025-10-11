// Chispas diagonales: rayas finas que cruzan de manera esporádica
(function () {
  const cvs = document.getElementById('contentMeteors');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  let W = 0, H = 0, streaks = [];
  function resize() {
    const rect = cvs.parentElement.getBoundingClientRect();
    W = cvs.width = Math.floor(rect.width);
    H = cvs.height = Math.max(800, Math.floor(rect.height));
  }

  function spawn() {
    // densidad baja para no distraer
    if (streaks.length > 18) return;
    const len = 180 + Math.random() * 180; // largo de la estela
    const speed = 2.2 + Math.random() * 1.6;
    const y = Math.random() * (H * 0.8) + H * 0.05;
    const hue = Math.random() < 0.5 ? 180 : 155; // azul verdoso / lima
    streaks.push({
      x: -50, y, len, speed, life: 0, hue,
      angle: -Math.PI / 5.5 // diagonal suave
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // fondo con leve viñeta para resaltar chispas
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    for (let i = streaks.length - 1; i >= 0; i--) {
      const s = streaks[i];
      s.x += Math.cos(s.angle) * s.speed * 4.0;
      s.y += Math.sin(s.angle) * s.speed * 4.0;
      s.life += s.speed;

      // dibujar como línea con gradiente
      const dx = Math.cos(s.angle) * s.len;
      const dy = Math.sin(s.angle) * s.len;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
      grad.addColorStop(0, `hsla(${s.hue}, 80%, 70%, .55)`);
      grad.addColorStop(1, `hsla(${s.hue}, 80%, 70%, 0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - dx, s.y - dy);
      ctx.stroke();

      // sombra suave
      ctx.shadowColor = `hsla(${s.hue}, 80%, 60%, .35)`;
      ctx.shadowBlur = 6;

      if (s.x > W + s.len || s.y < -s.len || s.y > H + s.len) streaks.splice(i, 1);
    }
    requestAnimationFrame(draw);
  }

  // generar chispas cada cierto tiempo
  function loop() {
    if (Math.random() < 0.65) spawn(); // probabilidad por tick
    setTimeout(loop, 900 + Math.random() * 800); // cada ~0.9–1.7s
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(cvs.parentElement);
  resize(); draw(); loop();
})();
