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

// --------- 3D Globe (Three.js) ---------
(function(){
  const mount = document.getElementById('globeCanvas');
  if(!mount || !window.THREE) return;

  const width = mount.clientWidth;
  const height = mount.clientHeight;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, width/height, 0.1, 1000);
  camera.position.set(0, 0, 5.2);

  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  // Globe
  const sphereGeo = new THREE.SphereGeometry(2, 64, 64);
  // Minimalistic material (soft blue with subtle shininess)
  const sphereMat = new THREE.MeshPhongMaterial({ color: 0x84c9ff, specular: 0xddddff, shininess: 6, flatShading: false });
  const globe = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(globe);

  // Subtle atmosphere glow
  const glowGeo = new THREE.SphereGeometry(2.05, 64, 64);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xcdbbff, transparent: true, opacity: 0.18 });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);

  // Lights
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(5, 3, 2);
  scene.add(dir);
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));

  // Convert lat/lon to 3D position on sphere
  function latLonToVector3(lat, lon, radius = 2, height = 0){
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const r = radius + height;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  // Add a pin (small cone) for a city
  function addPin(lat, lon, color){
    const pinGeo = new THREE.ConeGeometry(0.03, 0.18, 10);
    const pinMat = new THREE.MeshStandardMaterial({ color });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    const pos = latLonToVector3(lat, lon, 2, 0.02);
    pin.position.copy(pos);

    // Orient the pin outward from center
    pin.lookAt(new THREE.Vector3(0,0,0));
    pin.rotateX(Math.PI/2);

    scene.add(pin);
    return pin;
  }

  // Our places (approximate lat/lon)
  const places = [
    {name:'Beirut', lat:33.8938, lon:35.5018, color:0xff7a7a},
    {name:'Paris', lat:48.8566, lon:2.3522, color:0x94f7c5},
    {name:'Strasbourg', lat:48.5734, lon:7.7521, color:0xb28dff},
    {name:'Dubai', lat:25.2048, lon:55.2708, color:0x7bdff2},
    {name:'Abu Dhabi', lat:24.4539, lon:54.3773, color:0xffcc70},
  ];
  places.forEach(p => addPin(p.lat, p.lon, p.color));

  // Resize handling
  function onResize(){
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w,h);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Autorotate; pause on hover
  let paused = false;
  mount.addEventListener('mouseenter', ()=> paused = true);
  mount.addEventListener('mouseleave', ()=> paused = false);

  function animate(){
    requestAnimationFrame(animate);
    if(!paused){
      globe.rotation.y += 0.0022;
      glow.rotation.y += 0.0022;
    }
    renderer.render(scene, camera);
  }
  animate();
})();