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

// Animated connecting line fill
(function(){
  const tl = document.getElementById('timelineLine');
  const fill = document.getElementById('timelineFill');
  function update(){
    if(!tl || !fill) return;
    const rect = tl.getBoundingClientRect();
    const vH = window.innerHeight || document.documentElement.clientHeight;
    const start = rect.top;
    const progress = Math.min(1, Math.max(0, (vH - start) / (rect.height + vH*0.4)));
    const h = Math.max(0, progress * rect.height);
    fill.style.height = h + 'px';
  }
  update();
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
})();

// Simple map tooltips
(function(){
  const tip = document.getElementById('mapTip');
  const mapWrap = document.querySelector('.map-wrap');
  if(!tip || !mapWrap) return;
  mapWrap.querySelectorAll('.pin').forEach(pin=>{
    pin.addEventListener('mouseenter', ()=>{
      tip.textContent = pin.getAttribute('data-name') || '';
      tip.style.opacity = 1;
    });
    pin.addEventListener('mouseleave', ()=>{
      tip.style.opacity = 0;
    });
    pin.addEventListener('mousemove', (e)=>{
      const r = mapWrap.getBoundingClientRect();
      tip.style.left = (e.clientX - r.left) + 'px';
      tip.style.top  = (e.clientY - r.top) + 'px';
    });
    pin.addEventListener('click', ()=>{
      tip.textContent = pin.getAttribute('data-name') || '';
      tip.style.opacity = 1;
      setTimeout(()=> tip.style.opacity = 0, 1200);
    });
  });
})();