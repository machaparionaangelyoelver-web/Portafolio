/* Desactiva el morph de la ola para usuarios con 'reduced-motion' */
(function(){
  if (!window.matchMedia) return;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mq.matches) return;
  const path = document.getElementById('heroWavePath');
  if (!path) return;
  // El <animate> es el siguiente hermano; lo eliminamos
  const anim = path.nextElementSibling;
  if (anim && anim.tagName.toLowerCase() === 'animate'){
    anim.remove();
  }
})();
