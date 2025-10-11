// ===== Helper
const $ = (sel, ctx=document) => ctx.querySelector(sel);

/* ========= Paleta dinámica (Azul ↔ Lima) ========= */
(function(){
  const btn = $('#togglePaleta');
  if(!btn) return;

  // Lee preferencia previa
  const saved = localStorage.getItem('sem06_paleta'); // 'blue' | 'lime'
  if(saved === 'lime'){
    document.body.classList.remove('theme-blue');
    document.body.classList.add('theme-lime');
    btn.textContent = '🎨 Paleta: Lima';
  }else{
    document.body.classList.add('theme-blue');
    btn.textContent = '🎨 Paleta: Azul';
  }

  btn.addEventListener('click', ()=>{
    const isBlue = document.body.classList.contains('theme-blue');
    if(isBlue){
      document.body.classList.remove('theme-blue');
      document.body.classList.add('theme-lime');
      localStorage.setItem('sem06_paleta','lime');
      btn.textContent = '🎨 Paleta: Lima';
    }else{
      document.body.classList.remove('theme-lime');
      document.body.classList.add('theme-blue');
      localStorage.setItem('sem06_paleta','blue');
      btn.textContent = '🎨 Paleta: Azul';
    }
  });
})();

/* ========= Partículas (estrellas) en canvas ========= */
(function(){
  const canvas = $('#stars');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W,H,stars=[];
  const COUNT = 160;

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = Math.max(420, window.innerHeight * .62);
  };
  const rand = (a,b) => Math.random()*(b-a)+a;

  const init = () => {
    stars = Array.from({length:COUNT}).map(()=>({
      x: rand(0,W), y: rand(0,H), r: rand(.4,1.6), s: rand(.08,.45), a: rand(.4,.9)
    }));
  };
  const draw = () => {
    ctx.clearRect(0,0,W,H);
    for(const st of stars){
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${st.a})`;
      ctx.fill();
      st.x += st.s;
      if(st.x > W+5){ st.x = -5; st.y = rand(0,H) }
    }
    requestAnimationFrame(draw);
  };
  resize(); init(); draw();
  window.addEventListener('resize', ()=>{ resize(); init(); });
})();

/* ========= Meteoritos ========= */
(function(){
  const wrap = $('#meteors');
  if(!wrap) return;

  function spawn(){
    const m = document.createElement('div');
    const size = Math.random()*2+1;
    const dur = Math.random()*2+2.2;
    const startX = Math.random()*100; // vw
    m.style.position='absolute';
    m.style.top='-10vh';
    m.style.left = startX+'vw';
    m.style.width = size+'px';
    m.style.height = size*120+'px';
    m.style.background='linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,0))';
    m.style.filter='blur(0.4px)';
    m.style.transform='rotate(35deg)';
    m.style.opacity='.9';
    m.style.pointerEvents='none';
    m.animate([
      { transform:`translate3d(0,0,0) rotate(35deg)`, opacity:.95 },
      { transform:`translate3d(-40vw, 100vh,0) rotate(35deg)`, opacity:0.1 }
    ], { duration: dur*1000, easing:'cubic-bezier(.2,.55,.3,1)', fill:'forwards' });
    wrap.appendChild(m);
    setTimeout(()=>wrap.removeChild(m), dur*1000+200);
  }
  setInterval(()=>{ if (document.visibilityState==='visible') spawn(); }, 900);
})();

/* ========= Morph de frases (portada) ========= */
(function(){
  const el = $('#morphText');
  if(!el) return;
  const frases = [
    'Renderizado • Virtual DOM • Diffing',
    'Componentes de Función • Props • Children',
    'JSX • Expresiones { } • Listas con map()',
    'Estilos: CSS Modules • Tailwind • Inline',
    'TSX • Tipado de Props • Reutilización'
  ];
  let i = 0;
  function swap(){
    i = (i+1) % frases.length;
    el.animate([{opacity:1, filter:'blur(0px)'},{opacity:0, filter:'blur(8px)'}], { duration:280, easing:'ease' })
      .onfinish = ()=>{
        el.textContent = frases[i];
        el.animate([{opacity:0, filter:'blur(8px)'},{opacity:1, filter:'blur(0px)'}], { duration:320, easing:'ease' });
      };
  }
  setInterval(swap, 2200);
})();

/* ========= Typewriter (título portada) ========= */
(function(){
  const el = $('#typeTitle');
  if(!el) return;
  const texto = el.textContent.trim();
  el.textContent = '';
  let i=0;
  function type(){
    if(i <= texto.length){
      el.textContent = texto.slice(0,i);
      i++; requestAnimationFrame(type);
    }
  }
  setTimeout(type, 300);
})();

/* ========= Modo Estudio (reduce animaciones y brillos) ========= */
(function(){
  const btn = $('#toggleEstudio');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const on = document.body.classList.toggle('estudio');
    btn.textContent = on ? '✨ Modo normal' : '🎓 Modo estudio';
  });
})();

/* ========= Historial de contacto (últimos 5) ========= */
function renderHistorial(){
  const cont = $('#historial');
  if(!cont) return;
  let data = [];
  try{ data = JSON.parse(localStorage.getItem('contacto_sem06') || '[]'); }catch(_){}
  cont.innerHTML = '';
  if(!data.length){
    cont.innerHTML = '<p class="mini" style="opacity:.7">Sin envíos aún.</p>';
    return;
  }
  data.slice(0,5).forEach(item=>{
    const card = document.createElement('div');
    card.className = 'card-hist';
    const fecha = new Date(item.ts);
    card.innerHTML = `
      <div class="meta"><strong>${item.nombre}</strong> · ${item.correo} · <span>${fecha.toLocaleString()}</span></div>
      <div class="msg">${(item.msg || '').replace(/[<>&]/g,s=>({ '<':'&lt;','>':'&gt;','&':'&amp;' }[s]))}</div>
    `;
    cont.appendChild(card);
  });
}
window.addEventListener('DOMContentLoaded', renderHistorial);

/* ========= Envío de contacto (demo) ========= */
window.enviarMensaje = function(){
  const nombre = $('#nombre')?.value?.trim();
  const correo = $('#correo')?.value?.trim();
  const msg = $('#mensaje')?.value?.trim();
  const estado = $('#estado');
  if(!estado) return;

  if(!nombre || !correo){
    estado.textContent = 'Por favor, completa nombre y correo.';
    estado.style.color = '#b22929';
    return;
  }
  const payload = { nombre, correo, msg, ts: new Date().toISOString() };
  try{
    const prev = JSON.parse(localStorage.getItem('contacto_sem06') || '[]');
    prev.unshift(payload);
    localStorage.setItem('contacto_sem06', JSON.stringify(prev.slice(0,5)));
    estado.textContent = 'Gracias, tu mensaje fue registrado localmente ✅ (demo).';
    estado.style.color = '#2c5c2e';
    renderHistorial();
  }catch(_){
    estado.textContent = 'Guardado local no disponible.';
    estado.style.color = '#b22929';
  }
  setTimeout(()=>estado.textContent='', 4200);
};
