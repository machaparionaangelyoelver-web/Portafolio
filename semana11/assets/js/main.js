document.addEventListener('DOMContentLoaded', () => {
  // Activa animación del título tras breve pausa (backup si la estrella tarda)
  const title = document.getElementById('heroTitle');
  if (title) setTimeout(() => title.classList.add('is-in'), 1000);
});
