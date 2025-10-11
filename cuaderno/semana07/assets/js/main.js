// Progreso de scroll
const bar = document.getElementById('scrollProgress');
function onScroll(){
  const h = document.documentElement;
  const ratio = h.scrollTop / (h.scrollHeight - h.clientHeight);
  if (bar) bar.style.transform = `scaleX(${Math.max(0,Math.min(1,ratio))})`;
}
document.addEventListener('scroll', onScroll, {passive:true}); onScroll();
