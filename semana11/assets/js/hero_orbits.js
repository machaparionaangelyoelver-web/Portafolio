/* Órbitas tech que dan vueltas y luego se acomodan junto al título */
(function(){
  const orbits = document.querySelector('.orbits');
  if (!orbits) return;

  // Tras X segundos, dejar las órbitas estáticas en posición de "reposo"
  const settleAfter = 3600; // ms
  setTimeout(() => {
    orbits.classList.add('settle');
  }, settleAfter);

  // Respeta prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    orbits.classList.add('settle');
  }
})();
