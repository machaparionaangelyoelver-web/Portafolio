// Enlace del Informe01 (fijo)
const informe = document.getElementById('informeBtn');
if (informe) {
  informe.href = 'https://github.com/machaparionaangelyoelver-web/cuaderno_digital/blob/f6db34f8ed9768623996568e8c4b2c1d951b4cc1/semana01.md';
  informe.setAttribute('target', '_blank');
  informe.setAttribute('rel', 'noopener');
}


// ===== Utilidades =====
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Reveal on scroll =====
function setupReveal(){
  try{
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
      });
    }, {threshold:0.15});
    document.querySelectorAll('.reveal, .card').forEach(el=>io.observe(el));
    document.documentElement.classList.add('js-ready');
  }catch(err){
    console.error(err);
    document.documentElement.classList.remove('js-ready');
  }
}

// ===== Flip por click/tap o teclado =====
function setupFlipCards(){
  document.querySelectorAll('.card.flip').forEach(card=>{
    card.addEventListener('click', e=>{
      if (e.target.closest('a,button')) return;
      card.classList.toggle('is-flipped');
    });
    card.addEventListener('keyup', e=>{
      if(e.key === 'Enter' || e.key === ' '){ card.classList.toggle('is-flipped'); }
    });
  });
}

// ===== HERO FX: Constellation + Glow + Comets (Canvas 2D) =====
function setupConstellation(){
  const cvs = document.getElementById('canvasFx');
  if(!cvs) return;

  if(prefersReduced){
    // Fondo estático elegante
    const ctx = cvs.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio||1, 2);
    const W = cvs.width  = Math.floor(innerWidth * DPR);
    const H = cvs.height = Math.floor(innerHeight * 0.58 * DPR);
    const g = ctx.createRadialGradient(W*0.5, H*0.4, 0, W*0.5, H*0.4, Math.max(W,H)*0.6);
    g.addColorStop(0, 'rgba(99,132,255,.20)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    return;
  }

  const ctx = cvs.getContext('2d', { alpha: true });
  let DPR = Math.min(window.devicePixelRatio||1, 2);
  let W = 0, H = 0;

  const state = {
    points: [],
    mx: 0.5, my: 0.5,
    tick: 0,
    cometEvery: 380,   // frames
    linesMaxDist: 160, // px (antes de DPR)
    baseSpeed: 0.25
  };

  function resize(){
    DPR = Math.min(window.devicePixelRatio||1, 2);
    W = cvs.width  = Math.floor(innerWidth * DPR);
    H = cvs.height = Math.floor(innerHeight * 0.58 * DPR);

    const density = 0.00018; // puntos por px²
    const targetCount = Math.max(80, Math.floor(W*H * density));
    state.points.length = 0;

    for(let i=0; i<targetCount; i++){
      state.points.push({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()*2-1) * state.baseSpeed * DPR,
        vy: (Math.random()*2-1) * state.baseSpeed * DPR,
        r:  (Math.random()*1.6 + 0.6) * DPR,
        glow: Math.random()*0.5 + 0.5
      });
    }
  }

  function drawBackground(){
    // Negro base
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,W,H);

    // Neblina suave
    const g = ctx.createRadialGradient(W*0.5, H*0.45, 0, W*0.5, H*0.45, Math.max(W,H)*0.6);
    g.addColorStop(0, 'rgba(80,120,255,.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // Vignette
    const v = ctx.createLinearGradient(0,0,0,H);
    v.addColorStop(0,   'rgba(0,0,0,.35)');
    v.addColorStop(0.2, 'rgba(0,0,0,0)');
    v.addColorStop(0.8, 'rgba(0,0,0,0)');
    v.addColorStop(1,   'rgba(0,0,0,.45)');
    ctx.fillStyle = v;
    ctx.fillRect(0,0,W,H);
  }

  function updatePoints(){
    const parallaxX = (state.mx - 0.5) * 16 * DPR;
    const parallaxY = (state.my - 0.5) * 12 * DPR;

    for(const p of state.points){
      // movimiento base
      p.x += p.vx;
      p.y += p.vy;

      // parallax sutil
      p.x += (parallaxX) * 0.002;
      p.y += (parallaxY) * 0.002;

      // rebotes
      if(p.x < -10) p.x = W+10;
      if(p.x > W+10) p.x = -10;
      if(p.y < -10) p.y = H+10;
      if(p.y > H+10) p.y = -10;
    }
  }

  function drawConnections(){
    const maxDist = state.linesMaxDist * DPR;
    ctx.lineWidth = 0.9 * DPR;
    for(let i=0; i<state.points.length; i++){
      const a = state.points[i];
      for(let j=i+1; j<state.points.length; j++){
        const b = state.points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy;
        if(d2 < maxDist*maxDist){
          const d = Math.sqrt(d2);
          const alpha = (1 - d/maxDist) * 0.6;
          ctx.strokeStyle = `rgba(173, 200, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawPoints(){
    for(const p of state.points){
      // glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6*DPR);
      g.addColorStop(0, `rgba(170,200,255,${0.22*p.glow})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, 6*DPR, 0, Math.PI*2); ctx.fill();

      // núcleo
      ctx.fillStyle = 'rgba(220,235,255,.92)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    }
  }

  // Cometas esporádicos
  const comets = [];
  function maybeSpawnComet(){
    if(state.tick % state.cometEvery === 0){
      const fromLeft = Math.random()<0.5;
      const y = Math.random()*H*0.6 + H*0.1;
      const speed = (Math.random()*1.2 + 0.8) * DPR;
      comets.push({
        x: fromLeft ? -40*DPR : W+40*DPR,
        y,
        vx: fromLeft ? speed : -speed,
        vy: -speed*0.15,
        life: 0,
        maxLife: 260
      });
    }
  }
  function drawComets(){
    for(let i=comets.length-1; i>=0; i--){
      const c = comets[i];
      c.x += c.vx; c.y += c.vy; c.life++;

      // estela
      const trailLen = 120 * DPR;
      const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx*trailLen, c.y - c.vy*trailLen);
      grad.addColorStop(0, 'rgba(180,220,255,.9)');
      grad.addColorStop(1, 'rgba(180,220,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2*DPR;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x - c.vx*trailLen, c.y - c.vy*trailLen);
      ctx.stroke();

      // núcleo del cometa
      ctx.fillStyle = 'rgba(230,245,255,1)';
      ctx.beginPath(); ctx.arc(c.x, c.y, 2.2*DPR, 0, Math.PI*2); ctx.fill();

      if(c.life > c.maxLife || c.x < -200 || c.x > W+200) comets.splice(i,1);
    }
  }

  function tick(){
    state.tick++;
    drawBackground();
    updatePoints();
    drawConnections();
    drawPoints();
    maybeSpawnComet();
    drawComets();
    requestAnimationFrame(tick);
  }

  function onMove(e){
    const rect = cvs.getBoundingClientRect();
    const cx = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    const cy = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
    state.mx = Math.max(0, Math.min(1, cx / rect.width));
    state.my = Math.max(0, Math.min(1, cy / rect.height));
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', onMove, { passive: true });
  cvs.addEventListener('touchmove', onMove, { passive: true });

  resize();
  tick();
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  setupFlipCards();
  setupConstellation();
});
