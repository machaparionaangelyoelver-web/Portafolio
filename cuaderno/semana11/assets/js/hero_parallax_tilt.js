/* Parallax tilt suave del bloque del título (desktop) */
(function(){
  const block = document.getElementById('heroBlock');
  const hero = document.getElementById('hero');
  if (!block || !hero) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let rafId = 0;
  function onMove(e){
    const r = block.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / (r.width/2);
    const dy = (e.clientY - cy) / (r.height/2);
    const rotX = Math.max(-1, Math.min(1, dy)) * -6;  // hasta 6°
    const rotY = Math.max(-1, Math.min(1, dx)) *  6;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(()=>{
      block.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    });
  }
  function reset(){
    cancelAnimationFrame(rafId);
    block.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseleave', reset);
})();
