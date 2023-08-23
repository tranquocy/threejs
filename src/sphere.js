import {
    AxesHelper,
    Mesh,
    MeshNormalMaterial,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    WebGLRenderer
  } from "three";
  
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  
  let scene = new Scene();
  
  // Camera
  let camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1500
  );
  camera.position.x = 5;
  camera.position.z = 100;
  camera.position.y = 10;
  
  // Renderer
  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("#container").appendChild(renderer.domElement);

  // Control
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.update();
  
  // Geometry and Cube
  const geometry = new SphereGeometry(10, 20, 20);
  const material = new MeshNormalMaterial({ wireframe: true });
  const cube = new Mesh(geometry, material);

  // Axes helper
  const axes = new AxesHelper(100);
  scene.add(axes);
  
  scene.add( cube );
  
  // Render function
  function render() {
    controls.update();
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  
  requestAnimationFrame(render);