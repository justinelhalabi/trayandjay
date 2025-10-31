// Basic Three.js spinning globe + pins + labels (no textures)
(function(){
  const mount = document.getElementById('globe3d');
  if(!mount || !window.THREE) return;

  const scene = new THREE.Scene();
  const width = mount.clientWidth;
  const height = mount.clientHeight;

  const camera = new THREE.PerspectiveCamera(35, width/height, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  const R = 2;
  const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96),
    new THREE.MeshPhongMaterial({ color: 0x9ecbff, specular: 0xffffff, shininess: 12 })
  );
  scene.add(globe);

  const glow = new THREE.Mesh(new THREE.SphereGeometry(R*1.015, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xb9a8ff, transparent: true, opacity: 0.15 })
  );
  scene.add(glow);

  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(4, 2, 3); scene.add(dir);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  function latLonToVec3(lat, lon, radius=R){
    const phi = (90 - lat) * Math.PI/180;
    const theta = (lon + 180) * Math.PI/180;
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function addGraticule(step = 15){
    const m = new THREE.LineBasicMaterial({ color: 0x7eaee6, opacity: 0.45, transparent: true });
    for(let lon=-180; lon<=180; lon+=step){
      const points = [];
      for(let lat=-89; lat<=89; lat+=2){ points.push(latLonToVec3(lat, lon, R+0.001)); }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      scene.add(new THREE.Line(geo, m));
    }
    for(let lat=-75; lat<=75; lat+=step){
      const points = [];
      for(let lon=-180; lon<=180; lon+=2){ points.push(latLonToVec3(lat, lon, R+0.001)); }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      scene.add(new THREE.Line(geo, m));
    }
  }

  function makeTextSprite(msg, color='#111827'){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = 28, padding = 24;
    ctx.font = `600 ${fontSize}px Poppins, system-ui`;
    const w = ctx.measureText(msg).width;
    canvas.width = w + padding*2; canvas.height = fontSize + padding*1.6;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    roundRect(ctx, 0, 0, canvas.width, canvas.height, 12); ctx.fill();
    ctx.fillStyle = color; ctx.textBaseline = 'middle';
    ctx.font = `600 ${fontSize}px Poppins, system-ui`;
    ctx.fillText(msg, padding, canvas.height/2);
    const tex = new THREE.CanvasTexture(canvas); tex.anisotropy = 8;
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    const scale = 0.6; spr.scale.set(canvas.width/200*scale, canvas.height/200*scale, 1);
    return spr;
  }
  function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}

  function addPin(lat, lon, color, label){
    const pos = latLonToVec3(lat, lon, R+0.02);
    const pin = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 12),
      new THREE.MeshStandardMaterial({ color }));
    pin.position.copy(pos); pin.lookAt(new THREE.Vector3(0,0,0)); pin.rotateX(Math.PI/2); scene.add(pin);
    const text = makeTextSprite(label);
    const labelPos = latLonToVec3(lat+4, lon, R+0.32);
    text.position.copy(labelPos); scene.add(text);
  }

  addGraticule(15);
  addPin(33.8938, 35.5018, 0xff7a7a, 'Beirut');
  addPin(48.8566, 2.3522, 0x94f7c5, 'Paris');
  addPin(48.5734, 7.7521, 0xb28dff, 'Strasbourg');
  addPin(25.2048, 55.2708, 0x7bdff2, 'Dubai');
  addPin(24.4539, 54.3773, 0xffcc70, 'Abu Dhabi');

  function onResize(){ const w = mount.clientWidth, h = mount.clientHeight; renderer.setSize(w,h); camera.aspect = w/h; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', onResize);

  let paused = false;
  mount.addEventListener('mouseenter', ()=> paused = true);
  mount.addEventListener('mouseleave', ()=> paused = false);

  function animate(){
    requestAnimationFrame(animate);
    if(!paused){ globe.rotation.y += 0.002; glow.rotation.y += 0.002;
      scene.traverse(o=>{ if(o.type==='Sprite') o.lookAt(camera.position); });
    }
    renderer.render(scene, camera);
  }
  animate();
})();