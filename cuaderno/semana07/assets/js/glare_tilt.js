// Tilt + glare suave usando Web Animations (sin librerías)
const blk = document.getElementById('heroBlock');
if(blk){
  let rx=0, ry=0;
  blk.addEventListener('pointermove', (e)=>{
    const r = blk.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - .5;
    const py = (e.clientY - r.top)/r.height - .5;
    rx = py * -8; ry = px * 8;
    blk.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    blk.style.boxShadow = `${-ry*2}px ${rx*2}px 24px rgba(0,0,0,.18)`;
    blk.style.background = `linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02))`;
  });
  blk.addEventListener('pointerleave', ()=>{
    blk.style.transform = 'rotateX(0) rotateY(0)';
    blk.style.boxShadow = '0 12px 28px rgba(0,0,0,.18)';
  });
}
