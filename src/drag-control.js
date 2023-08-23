import {
  Group,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  MOUSE
} from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

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

const group = new Group();
scene.add( group );

// Geometry and Cube
const geometry = new SphereGeometry(5, 200, 200);
const material = new MeshNormalMaterial({ wireframe: true });
const objects = [];

for ( let i = 0; i < 50; i ++ ) {
  const cube = new Mesh(geometry, material);

  cube.position.x = Math.random() * 50 - 15;
  cube.position.y = Math.random() * 50 - 7.5;
  cube.position.z = Math.random() * 70 - 10;

  cube.castShadow = true;
  cube.receiveShadow = true;

  scene.add( cube );

  objects.push( cube );

}

// Renderer
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#container").appendChild(renderer.domElement);

// Control
const controls = new OrbitControls( camera, renderer.domElement );

controls.mouseButtons = {
	RIGHT: MOUSE.ROTATE,
}

// dragControls
const dragControls = new DragControls( [ ... objects ], camera, renderer.domElement );
dragControls.addEventListener( 'drag', render );

// Render function
function render() {
  renderer.render(scene, camera);
}

render()