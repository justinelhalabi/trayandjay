/* Year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Lightbox defaults */
if (window.lightbox) {
  lightbox.option({
    resizeDuration: 150,
    wrapAround: true,
    fadeDuration: 150,
    imageFadeDuration: 150
  });
}

/* Surprise reveal + confetti */
const btn = document.getElementById('surpriseBtn');
const surprise = document.getElementById('surprise-content');
if (btn && surprise) {
  btn.addEventListener('click', () => {
    surprise.classList.toggle('hidden');
    try {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
    } catch(e) {}
    btn.textContent = surprise.classList.contains('hidden') ? 'Reveal' : 'Hide';
  });
}
