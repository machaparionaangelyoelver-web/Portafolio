/* Estrella fugaz que cruza el hero una sola vez al cargar */
(function(){
  const c = document.getElementById('shootingStarCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let w, h, dpr;

  function resize(){
    dpr = Math.max(1, window.devicePixelRatio||1);
    w = c.clientWidth; h = c.clientHeight;
    c.width = Math.floor(w*dpr); c.height = Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize, {passive:true});

  const star = {
    x: -80, y: 40,
    vx: 9.0, vy: 3.6,
    life: 1, trail: []
  };

  let started = false;
  function animate(){
    if (!started){ started = true; }
    // Relleno muy tenue para el rastro
    ctx.fillStyle = 'rgba(255,228,214,.35)'; // color de portada
    ctx.fillRect(0,0,w,h);

    // actualizar
    star.x += star.vx;
    star.y += star.vy;
    star.trail.push({x:star.x, y:star.y});
    if (star.trail.length > 24) star.trail.shift();

    // dibujar rastro
    for (let i=0;i<star.trail.length;i++){
      const p = star.trail[i];
      const alpha = i / star.trail.length;
      ctx.strokeStyle = `rgba(124,58,237,${alpha*0.8})`; // lila
      ctx.lineWidth = Math.max(1, 4*alpha);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - star.vx*2, p.y - star.vy*2);
      ctx.stroke();
    }

    // estrella
    ctx.fillStyle = '#0EA5E9';
    ctx.beginPath();
    ctx.arc(star.x, star.y, 2.6, 0, Math.PI*2);
    ctx.fill();

    // Revela el título al cruzar 35% del ancho
    const title = document.getElementById('heroTitle');
    if (title && !title.classList.contains('is-in') && star.x > w*0.35){
      title.classList.add('is-in');
    }

    if (star.x < w + 100 && star.y < h + 100){
      requestAnimationFrame(animate);
    }
  }

  // Ejecuta una sola pasada
  setTimeout(()=> requestAnimationFrame(animate), 220);
})();
