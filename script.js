// Year
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

// Reveal on scroll
const els = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('revealed');
      io.unobserve(e.target);
    }
  })
},{rootMargin:'0px 0px -12% 0px', threshold:0.12});
els.forEach(el=>io.observe(el));

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Lightbox options (if library present)
if (window.lightbox) {
  lightbox.option({
    fadeDuration: 150,
    imageFadeDuration: 150,
    resizeDuration: 150,
    wrapAround: true
  });
}
