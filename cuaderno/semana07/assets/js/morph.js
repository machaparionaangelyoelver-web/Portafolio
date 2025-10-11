// Subtítulo morph (data-phrases en #heroMorph)
const el = document.getElementById('heroMorph');
if(el){
  const phrases = JSON.parse(el.dataset.phrases || '[]'); let i = 0;
  setInterval(()=>{
    i = (i+1) % phrases.length;
    el.animate([{opacity:1,filter:'blur(0)'},{opacity:0,filter:'blur(6px)'}],{duration:220}).onfinish = ()=>{
      el.textContent = phrases[i];
      el.animate([{opacity:0,filter:'blur(6px)'},{opacity:1,filter:'blur(0)'}],{duration:260});
    };
  }, 2000);
}
