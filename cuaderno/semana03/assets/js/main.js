// ===== Informe03 → GitHub (refuerza el link correcto) =====
document.addEventListener('DOMContentLoaded', () => {
  const informe = document.getElementById('informeBtn');
  if (informe) {
    const URL_INFORME = 'https://github.com/machaparionaangelyoelver-web/cuaderno_digital/blob/f6db34f8ed9768623996568e8c4b2c1d951b4cc1/semana03.md';
    informe.href = URL_INFORME;
    informe.target = '_blank';
    informe.rel = 'noopener';
  }
});

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Reveal */
function setupReveal(){
  try{
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
      });
    }, {threshold:0.15});
    document.querySelectorAll('.reveal, .card, .lab').forEach(el=>io.observe(el));
    document.documentElement.classList.add('js-ready');
  }catch(err){
    console.error(err);
    document.documentElement.classList.remove('js-ready');
  }
}

/* Flip cards */
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

/* Code tools */
function setupCodeTools(){
  document.querySelectorAll('.code-btn.copy').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const pre = document.querySelector(btn.dataset.target);
      if(!pre) return;
      navigator.clipboard.writeText(pre.innerText).then(()=>{
        const old = btn.textContent; btn.textContent = '✓'; setTimeout(()=>btn.textContent = old, 900);
      });
    });
  });
  document.querySelectorAll('.code-btn.wrap').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const pre = document.querySelector(btn.dataset.target);
      if(pre) pre.classList.toggle('is-wrap');
    });
  });
}

/* HERO FX */
function setupConstellation(){
  const cvs = document.getElementById('canvasFx');
  if(!cvs) return;

  if(prefersReduced){
    const ctx = cvs.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio||1, 2);
    const W = cvs.width  = Math.floor(innerWidth * DPR);
    const H = cvs.height = Math.floor(innerHeight * 0.60 * DPR);
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
    const g = ctx.createRadialGradient(W*0.5, H*0.45, 0, W*0.5, H*0.45, Math.max(W,H)*0.6);
    g.addColorStop(0, 'rgba(34,211,238,.20)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    return;
  }

  const ctx = cvs.getContext('2d', { alpha:true });
  let DPR = Math.min(window.devicePixelRatio||1, 2), W=0, H=0;
  const state = { pts:[], mx:.5, my:.5, t:0, cometGap:360, linkDist:150, speed:.25 };

  function resize(){
    DPR = Math.min(window.devicePixelRatio||1, 2);
    W = cvs.width  = Math.floor(innerWidth * DPR);
    H = cvs.height = Math.floor(innerHeight * 0.60 * DPR);
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
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
    const neb = ctx.createRadialGradient(W*.5, H*.45, 0, W*.5, H*.45, Math.max(W,H)*.6);
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

  const comets=[];
  function spawnComet(){
    if(state.t % state.cometGap === 0){
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

  function frame(){
    state.t++; bg(); move(); links(); stars(); spawnComet(); drawComets();
    requestAnimationFrame(frame);
  }

  function onMove(e){
    const r=cvs.getBoundingClientRect();
    const cx=(e.touches?.[0]?.clientX ?? e.clientX)-r.left;
    const cy=(e.touches?.[0]?.clientY ?? e.clientY)-r.top;
    state.mx = Math.max(0, Math.min(1, cx/r.width));
    state.my = Math.max(0, Math.min(1, cy/r.height));
  }

  window.addEventListener('resize', resize, {passive:true});
  window.addEventListener('mousemove', onMove, {passive:true});
  cvs.addEventListener('touchmove', onMove, {passive:true});

  resize(); frame();
}

/* No bloquear enlaces externos si tienes un scroll suave global */
(function(){
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href]');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    const isExternal = /^https?:\/\//i.test(href);
    const isBlank = a.getAttribute('target') === '_blank';
    if (isExternal || isBlank) return; // no bloquear externos

    // scroll suave solo para anchors internos
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, true); // capture
})();

/* INIT */
document.addEventListener('DOMContentLoaded', ()=>{
  setupReveal();
  setupFlipCards();
  setupCodeTools();
  setupConstellation();
});
