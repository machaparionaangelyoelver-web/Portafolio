(function(){
  const grid = document.getElementById('masonry');
  const lb   = document.getElementById('lightbox');
  if (!grid || !lb) return;

  const items = Array.from(grid.querySelectorAll('.masonry__item'));
  const imgs  = items.map(f => f.querySelector('img'));
  const caps  = items.map(f => (f.querySelector('figcaption')?.textContent || ''));

  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let idx = 0;

  function open(i){
    idx = i;
    lbImg.src = imgs[idx].src;
    lbImg.alt = imgs[idx].alt || '';
    lbCap.textContent = caps[idx] || '';
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden','false');
  }
  function close(){
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden','true');
  }
  function prev(){ open((idx - 1 + imgs.length) % imgs.length) }
  function next(){ open((idx + 1) % imgs.length) }

  imgs.forEach((img,i)=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> open(i));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  document.addEventListener('keydown', (e)=>{
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });

  // Cerrar si clic fuera de la imagen
  lb.addEventListener('click', (e)=> {
    if (e.target === lb) close();
  });
})();
