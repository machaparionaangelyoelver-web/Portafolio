/* Efecto "magnetic" en botones: siguen suavemente el cursor */
(function(){
  const MAX = 10; // px
  const els = Array.from(document.querySelectorAll('.btn--magnetic'));
  if (!els.length) return;

  els.forEach(el => {
    let rafId = 0;
    function onMove(e){
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width/2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height/2)));
      const tx = dx * MAX, ty = dy * MAX;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(()=> {
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    }
    function reset(){
      cancelAnimationFrame(rafId);
      el.style.transform = 'translate(0,0)';
    }
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
    el.addEventListener('blur', reset);
  });
})();
