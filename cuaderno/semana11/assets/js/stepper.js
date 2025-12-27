(function(){
  const steps = Array.from(document.querySelectorAll('.step'));
  const indexItems = Array.from(document.querySelectorAll('#stepIndex li'));
  if (!steps.length) return;

  // Marca step visible y sincroniza índice
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const el = e.target;
      if (e.isIntersecting){
        el.classList.add('is-in');
        const n = el.getAttribute('data-step');
        indexItems.forEach(li => li.classList.toggle('is-active', li.getAttribute('data-step') === n));
        // typewriter en codeblocks con data-typewriter (solo primera vez)
        el.querySelectorAll('.codeblock[data-typewriter] pre code').forEach(code => {
          if (!code.dataset.done){
            code.dataset.done = '1';
            typewriter(code, code.textContent);
          }
        });
      }
    });
  }, { threshold: .35 });

  steps.forEach(s => io.observe(s));

  // Copiar al portapapeles
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const text = btn.getAttribute('data-copy').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#10;/g,'\n');
    navigator.clipboard.writeText(text).then(()=>{
      const prev = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(()=> btn.textContent = prev, 900);
    });
  });

  // Efecto typewriter simple
  function typewriter(node, full){
    node.textContent = '';
    let i = 0;
    (function tick(){
      node.textContent += full[i++] || '';
      if (i <= full.length) setTimeout(tick, 12);
    })();
  }
})();
