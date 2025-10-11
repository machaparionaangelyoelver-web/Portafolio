(function(){
  const panels = Array.from(document.querySelectorAll('.accordion .panel'));
  if (!panels.length) return;

  // Auto open al entrar en viewport, cierra el resto
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const det = e.target;
      if (e.isIntersecting){
        panels.forEach(p => { if (p !== det) p.removeAttribute('open') });
        det.setAttribute('open','');
      }
    });
  }, { threshold:.35 });

  panels.forEach(p => io.observe(p));
})();
