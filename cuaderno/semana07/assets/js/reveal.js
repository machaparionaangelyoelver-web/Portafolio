// Revela .reveal al entrar en viewport
const io = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(n=>io.observe(n));
