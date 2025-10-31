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
document.querySelectorAll('a[href^=\"#\"]').forEach(a=>{
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
  lightbox.option({ fadeDuration:150, imageFadeDuration:150, resizeDuration:150, wrapAround:true });
}

// Animated timeline fill
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

// --------- 3D Globe via Globe.gl (with Leaflet fallback) ---------
(function(){
  const container = document.getElementById('globeContainer');
  const fallbackEl = document.getElementById('mapFallback');
  const hasWebGL = (()=>{
    try{
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    }catch(e){ return false; }
  })();

  const locations = [
    { name: 'Beirut',     lat: 33.8938, lon: 35.5018, color: '#ff7a7a' },
    { name: 'Paris',      lat: 48.8566, lon: 2.3522,  color: '#94f7c5' },
    { name: 'Strasbourg', lat: 48.5734, lon: 7.7521,  color: '#b28dff' },
    { name: 'Dubai',      lat: 25.2048, lon: 55.2708, color: '#7bdff2' },
    { name: 'Abu Dhabi',  lat: 24.4539, lon: 54.3773, color: '#ffcc70' }
  ];

  if (hasWebGL && window.Globe){
    // 3D globe
    const globeEl = Globe()
      (container)
      .pointAltitude(0.02)
      .pointRadius(0.45)          // size multiplier
      .pointColor(d => d.color)
      .pointsData(locations)
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl('https://unpkg.com/three-globe@2.27.2/example/img/earth-dark.jpg')  // lightweight texture
      .bumpImageUrl('https://unpkg.com/three-globe@2.27.2/example/img/earth-topology.png');

    // autorotate & pause on hover
    const controls = globeEl.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    container.addEventListener('mouseenter', ()=> controls.autoRotate = false);
    container.addEventListener('mouseleave', ()=> controls.autoRotate = true);
  } else {
    // Fallback 2D Leaflet
    fallbackEl.style.display = 'block';
    const map = L.map('mapFallback', { zoomControl: false, attributionControl: true })
      .setView([30, 20], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 5,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    locations.forEach(p => {
      L.circleMarker([p.lat, p.lon], { radius: 6, color: p.color, fillColor: p.color, fillOpacity: 0.8 }).addTo(map).bindPopup(p.name);
    });
  }
})();