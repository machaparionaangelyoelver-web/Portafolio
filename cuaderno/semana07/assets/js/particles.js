// Estrellas sutiles
(function(){
  const canvas = document.getElementById('fxStars');
  if(!canvas) return;
  const ctx = canvas.getContext('2d'); let W,H,stars=[];
  const COUNT = 120;
  const R = (a,b)=> Math.random()*(b-a)+a;
  const resize = ()=>{ W=canvas.width=window.innerWidth; H=canvas.height=Math.max(420, window.innerHeight*.52); };
  const init = ()=>{ stars = Array.from({length:COUNT}).map(()=>({ x:R(0,W), y:R(0,H), s:R(.06,.38), a:R(.4,.9), r:R(.25,1.2) })); };
  const draw = ()=>{
    ctx.clearRect(0,0,W,H);
    for(const st of stars){ ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2); ctx.fillStyle = `rgba(255,255,255,${st.a})`; ctx.fill(); st.x += st.s; if(st.x>W+5){ st.x=-5; st.y=R(0,H);} }
    requestAnimationFrame(draw);
  };
  resize(); init(); draw(); window.addEventListener('resize', ()=>{ resize(); init(); });
})();

// Nebulosa suave (ya la maneja CSS)
// Meteoro grande que cruza cada 7–12s
(function(){
  const hero = document.getElementById('hero');
  if(!hero) return;

  function spawnBigMeteor(){
    const m = document.createElement('div');
    m.className = 'meteor-big';
    hero.appendChild(m);
    const dur = 1800 + Math.random()*900; // 1.8–2.7s
    const startY = -10 + Math.random()*10; // entre -10vh y 0vh
    m.style.top = startY + 'vh';
    m.animate([
      { transform:'translate3d(0,0,0) rotate(-30deg)', opacity: .95, left:'110vw' },
      { transform:'translate3d(-140vw, 80vh,0) rotate(-30deg)', opacity: .05, left:'-30vw' }
    ], { duration: dur, easing:'cubic-bezier(.2,.55,.3,1)', fill:'forwards' });
    setTimeout(()=> m.remove(), dur + 200);
  }

  function loop(){
    spawnBigMeteor();
    const wait = 7000 + Math.random()*5000; // 7–12s
    setTimeout(loop, wait);
  }
  loop();
})();
