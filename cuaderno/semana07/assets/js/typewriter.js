// Typewriter para el título del hero
(function(){
  const out = document.getElementById('typeWriter');
  if(!out) return;
  const frases = [
    'Hooks en React',
    'useState • useEffect • useRef',
    'useMemo • useCallback',
    'Context y composición'
  ];
  let i = 0, j = 0, borrando = false;

  function tick(){
    const palabra = frases[i];
    if(!borrando){
      j++;
      out.textContent = palabra.slice(0,j);
      if(j === palabra.length){
        borrando = true;
        setTimeout(tick, 1000);
        return;
      }
    }else{
      j--;
      out.textContent = palabra.slice(0,j);
      if(j === 0){
        borrando = false;
        i = (i+1) % frases.length;
      }
    }
    setTimeout(tick, borrando ? 35 : 70);
  }
  tick();
})();
