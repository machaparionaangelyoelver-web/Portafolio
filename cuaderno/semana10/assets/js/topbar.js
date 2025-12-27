(function(){
  const bar = document.getElementById('scrollProgress');
  const topbar = document.querySelector('.topbar');
  const hero = document.getElementById('hero');

  function setProgress(){
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? (h.scrollTop / max) : 0;
    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
  }
  function setShadow(){
    const sc = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (!topbar) return;
    topbar.classList.toggle('topbar--shadow', sc > 2);
  }
  function observeHero(){
    if (!topbar || !hero || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry])=>{
      if (entry.isIntersecting) topbar.classList.add('topbar--on-hero');
      else topbar.classList.remove('topbar--on-hero');
    }, { root: null, rootMargin: '-56px 0px 0px 0px', threshold: 0.01 });
    io.observe(hero);
  }
  document.addEventListener('scroll', ()=>{ setProgress(); setShadow(); }, {passive:true});
  window.addEventListener('resize', setProgress, {passive:true});
  window.addEventListener('load', ()=>{ setProgress(); setShadow(); observeHero(); });

  // Scroll-cue
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.scroll-cue[data-scroll]');
    if (!btn) return;
    const sel = btn.getAttribute('data-scroll');
    const el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({behavior:'smooth', block:'start'});
  });

  // Copiar email (contacto)
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn){
    copyBtn.addEventListener('click', ()=>{
      const value = copyBtn.getAttribute('data-copy') || '';
      navigator.clipboard.writeText(value).then(()=>{
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copiado!';
        setTimeout(()=> copyBtn.textContent = prev, 900);
      });
    });
  }
})();
