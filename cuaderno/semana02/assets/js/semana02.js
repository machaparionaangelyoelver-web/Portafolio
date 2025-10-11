// ===== Enlace Informe02 (fijo a GitHub, no PDF) =====
document.addEventListener('DOMContentLoaded', () => {
  const a = document.getElementById('informeBtn');
  if (a) {
    a.href = 'https://github.com/machaparionaangelyoelver-web/cuaderno_digital/blob/f6db34f8ed9768623996568e8c4b2c1d951b4cc1/semana02.md';
    a.target = '_blank';
    a.rel = 'noopener';
  }
});

/* Reveal */
(function(){
  try{
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
      });
    }, {threshold:0.15});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
    document.documentElement.classList.add('js-ready');
  }catch{
    document.documentElement.classList.remove('js-ready');
  }
})();

/* Flip cards (click/teclado) */
(function(){
  document.querySelectorAll('.card.flip').forEach(card=>{
    card.addEventListener('click', e=>{
      if (e.target.closest('a,button')) return;
      card.classList.toggle('is-flipped');
    });
    card.addEventListener('keyup', e=>{
      if(e.key === 'Enter' || e.key === ' '){ card.classList.toggle('is-flipped'); }
    });
  });
})();

/* HERO FX: constelación + cometas */
(function(){
  const cvs = document.getElementById('canvasFx');
  if(!cvs) return;
  const ctx = cvs.getContext('2d', { alpha:true });
  let DPR = Math.min(window.devicePixelRatio||1, 2), W=0, H=0;
  const state = { pts:[], mx:.5, my:.5, t:0, linkDist:150, speed:.25 };

  function resize(){
    DPR = Math.min(window.devicePixelRatio||1, 2);
    W = cvs.width  = Math.floor(innerWidth * DPR);
    H = cvs.height = Math.floor(innerHeight * 0.66 * DPR);
    const density = 0.0002;
    const count = Math.max(90, Math.floor(W*H*density));
    state.pts.length = 0;
    for(let i=0;i<count;i++){
      state.pts.push({
        x:Math.random()*W, y:Math.random()*H,
        vx:(Math.random()*2-1)*state.speed*DPR,
        vy:(Math.random()*2-1)*state.speed*DPR,
        r:(Math.random()*1.6+0.6)*DPR, g:Math.random()*0.5+0.5
      });
    }
  }
  function bg(){
    ctx.fillStyle = '#001014'; ctx.fillRect(0,0,W,H);
    const neb = ctx.createRadialGradient(W*.5, H*.42, 0, W*.5, H*.42, Math.max(W,H)*.6);
    neb.addColorStop(0,'rgba(34,211,238,.16)');
    neb.addColorStop(0.6,'rgba(25,179,148,.12)');
    neb.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = neb; ctx.fillRect(0,0,W,H);
  }
  function move(){
    const px = (state.mx-.5)*16*DPR, py = (state.my-.5)*12*DPR;
    for(const p of state.pts){
      p.x += p.vx + px*0.002;
      p.y += p.vy + py*0.002;
      if(p.x<-10) p.x=W+10; if(p.x>W+10) p.x=-10;
      if(p.y<-10) p.y=H+10; if(p.y>H+10) p.y=-10;
    }
  }
  function links(){
    const max = state.linkDist*DPR;
    ctx.lineWidth = .9*DPR;
    for(let i=0;i<state.pts.length;i++){
      const a = state.pts[i];
      for(let j=i+1;j<state.pts.length;j++){
        const b = state.pts[j];
        const dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy;
        if(d2<max*max){
          const d=Math.sqrt(d2), al=(1-d/max)*.55;
          ctx.strokeStyle = `rgba(170,240,230,${al})`;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
  }
  const comets=[];
  function spawnComet(){
    if(state.t % 360 === 0){
      const left = Math.random()<0.5;
      const y = Math.random()*H*0.6 + H*0.1;
      const s = (Math.random()*1.2 + .8)*DPR;
      comets.push({ x:left?-40*DPR:W+40*DPR, y, vx:left?s:-s, vy:-s*0.15, life:0, max:240 });
    }
  }
  function drawComets(){
    for(let i=comets.length-1;i>=0;i--){
      const c=comets[i];
      c.x+=c.vx; c.y+=c.vy; c.life++;
      const L = 120*DPR;
      const grad = ctx.createLinearGradient(c.x,c.y,c.x-c.vx*L,c.y-c.vy*L);
      grad.addColorStop(0,'rgba(140,255,240,1)');
      grad.addColorStop(1,'rgba(140,255,240,0)');
      ctx.strokeStyle=grad; ctx.lineWidth=2*DPR;
      ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(c.x-c.vx*L,c.y-c.vy*L); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,1)';
      ctx.beginPath(); ctx.arc(c.x,c.y,2.2*DPR,0,Math.PI*2); ctx.fill();
      if(c.life>c.max || c.x<-200 || c.x>W+200) comets.splice(i,1);
    }
  }
  function stars(){
    for(const p of state.pts){
      const glow = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,6*DPR);
      glow.addColorStop(0,`rgba(120,230,220,${0.22*p.g})`);
      glow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x,p.y,6*DPR,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(230,255,252,.95)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
  }
  function frame(){ state.t++; bg(); move(); links(); stars(); spawnComet(); drawComets(); requestAnimationFrame(frame); }
  window.addEventListener('resize', resize, {passive:true});
  window.addEventListener('mousemove', e=>{
    const r=cvs.getBoundingClientRect(); state.mx=(e.clientX-r.left)/r.width; state.my=(e.clientY-r.top)/r.height;
  }, {passive:true});
  resize(); frame();
})();

// === FIX Informe02 + navegación suave sin bloquear externos ===
(function() {
  // 1) Refuerza el enlace del informe (si otro script lo cambia)
  var informe = document.getElementById('informeBtn');
  if (informe) {
    var URL_INFORME = 'https://github.com/machaparionaangelyoelver-web/cuaderno_digital/blob/f6db34f8ed9768623996568e8c4b2c1d951b4cc1/semana02.md';
    informe.setAttribute('href', URL_INFORME);
    informe.setAttribute('target', '_blank');
    informe.setAttribute('rel', 'noopener');
  }

  // 2) Si existe un preventDefault global, no bloquear externos o _blank
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a[href]');
    if (!a) return;

    var href = a.getAttribute('href') || '';
    var isExternal = /^https?:\/\//i.test(href);
    var isBlank = a.getAttribute('target') === '_blank';

    // No bloquear externos ni _blank
    if (isExternal || isBlank) return;

    // Scroll suave solo para anchors internos (#temas, #contacto, etc.)
    if (href.startsWith('#')) {
      var el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, true); // capture para adelantarnos a otros handlers
})();
