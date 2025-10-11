// Masonry + Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const figs = Array.from(document.querySelectorAll('#masonry figure'));

let idx = 0;
function open(i){
  idx = i;
  const img = figs[i].querySelector('img');
  lbImg.src = img.src;
  lbCap.textContent = figs[i].querySelector('figcaption')?.textContent || '';
  lb?.setAttribute('aria-hidden','false'); lb?.classList.add('is-open');
}
function close(){ lb?.classList.remove('is-open'); lb?.setAttribute('aria-hidden','true'); }
function prev(){ open((idx-1+figs.length)%figs.length); }
function next(){ open((idx+1)%figs.length); }

figs.forEach((f,i)=> f.addEventListener('click', ()=>open(i)));
lbClose?.addEventListener('click', close);
lbPrev?.addEventListener('click', prev);
lbNext?.addEventListener('click', next);
lb?.addEventListener('click', e=>{ if(e.target===lb) close(); });

