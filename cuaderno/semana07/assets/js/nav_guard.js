// Asegura rutas de Cuaderno si se abre en otra carpeta
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click', e=>e.preventDefault()));
  document.querySelectorAll('#btnCuaderno, #btnCuaderno2')
    .forEach(a=> a?.setAttribute('href','../../cuaderno.html'));
}, {once:true});
