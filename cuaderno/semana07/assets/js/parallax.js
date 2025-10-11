// Parallax suave del hero
const hero = document.querySelector('[data-parallax]');
if(hero){
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY * 0.15;
    hero.style.transform = `translateY(${y}px)`;
  }, { passive:true });
}
