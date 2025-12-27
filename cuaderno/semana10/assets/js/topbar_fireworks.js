/* Fuegos artificiales sutiles al lado de los logos de la topbar */
(function(){
  const c = document.getElementById('logoFireworks');
  const logos = document.querySelector('.topbar__logos');
  if (!c || !logos) return;

  const ctx = c.getContext('2d');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = c.clientWidth, h = c.clientHeight, dpr = Math.max(1, window.devicePixelRatio||1);
  function resize(){
    w = c.clientWidth; h = c.clientHeight; dpr = Math.max(1, window.devicePixelRatio||1);
    c.width = Math.floor(w*dpr); c.height = Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);
  }
  resize(); window.addEventListener('resize', resize, {passive:true});

  if (reduce){
    // Solo estrellas estáticas suaves
    ctx.fillStyle = 'rgba(124,58,237,.7)';
    for (let i=0;i<10;i++){ ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1) }
    ctx.fillStyle = 'rgba(14,165,233,.8)';
    for (let i=0;i<8;i++){ ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1) }
    return;
  }

  const colors = ['#ffffff', '#7C3AED', '#0EA5E9', '#38bdf8'];
  let particles = [];

  function burst(x, y){
    const n = 22 + Math.floor(Math.random()*8);
    for (let i=0; i<n; i++){
      const ang = (Math.PI*2) * (i/n) + Math.random()*0.3;
      const spd = 1.6 + Math.random()*2.2;
      particles.push({
        x, y, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd,
        life: 1, decay: 0.02 + Math.random()*0.02,
        color: colors[(Math.random()*colors.length)|0]
      });
    }
  }

  function loop(){
    requestAnimationFrame(loop);
    ctx.clearRect(0,0,w,h);
    // leve fondo transparente para "fade"
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0,0,w,h);

    for (let i=particles.length-1; i>=0; i--){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.03; // gravedad sutil
      p.life -= p.decay;
      if (p.life <= 0){
        particles.splice(i,1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);
    }
  }
  loop();

  function randomBurst(){
    const x = 20 + Math.random()*(w-40);
    const y = 16 + Math.random()*(h-28);
    burst(x, y);
  }

  // Disparo inicial y cada 6–10s
  randomBurst();
  let timer = setInterval(randomBurst, 6000 + Math.random()*4000);

  // Al pasar el mouse por los logos, dispara
  logos.addEventListener('mouseenter', () => {
    for (let i=0;i<3;i++) randomBurst();
  });

  // Limpieza si cambian pestañas (opcional)
  document.addEventListener('visibilitychange', ()=>{
    if (document.hidden){ clearInterval(timer); }
    else { timer = setInterval(randomBurst, 6000 + Math.random()*4000); }
  });
})();
