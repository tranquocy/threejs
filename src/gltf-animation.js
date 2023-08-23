import {
  Color,
  Mesh,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  DirectionalLight,
  WebGLRenderer,
  Clock,
  PlaneGeometry,
  MeshPhongMaterial,
  SkeletonHelper,
  AnimationMixer,
  Fog
} from "three";

import Stats from 'three/addons/libs/stats.module.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, renderer, camera, stats;
let model, skeleton, mixer, clock;

let walkAction;
let walkWeight;
let actions;

let singleStepMode = false;
let sizeOfNextStep = 0;

init();

function init() {

  const container = document.getElementById( 'container' );

  camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.set( 1, 2, - 3 );
  camera.lookAt( 0, 1, 0 );

  clock = new Clock();

  scene = new Scene();
  scene.background = new Color( 0xa0a0a0 );
  scene.fog = new Fog( 0xa0a0a0, 10, 50 );

  const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
  hemiLight.position.set( 0, 20, 0 );
  scene.add( hemiLight );

  const dirLight = new DirectionalLight( 0xffffff, 3 );
  dirLight.position.set( - 3, 10, - 10 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = - 2;
  dirLight.shadow.camera.left = - 2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add( dirLight );

  // scene.add( new CameraHelper( dirLight.shadow.camera ) );

  // ground

  const mesh = new Mesh( new PlaneGeometry( 100, 100 ), new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );

  const loader = new GLTFLoader();
  loader.load( 'public/Soldier.glb', function ( gltf ) {

    model = gltf.scene;
    scene.add( model );

    model.traverse( function ( object ) {

      if ( object.isMesh ) object.castShadow = true;

    } );

    //

    skeleton = new SkeletonHelper( model );
    skeleton.visible = false;
    scene.add( skeleton );
    const animations = gltf.animations;

    mixer = new AnimationMixer( model );

    walkAction = mixer.clipAction( animations[ 3 ] );

    actions = [ walkAction ];

    activateAllActions();

    animate();

  } );

  renderer = new WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  stats = new Stats();
  container.appendChild( stats.dom );
}


function activateAllActions() {
  actions.forEach( function ( action ) {

    action.play();

  } );

}

function animate() {

  // Render loop

  requestAnimationFrame( animate );

  walkWeight = walkAction.getEffectiveWeight();

  // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)

  let mixerUpdateDelta = clock.getDelta();

  // If in single step mode, make one step and then do nothing (until the user clicks again)

  if ( singleStepMode ) {

    mixerUpdateDelta = sizeOfNextStep;
    sizeOfNextStep = 0;

  }

  // Update the animation mixer, the stats panel, and render this frame

  mixer.update( mixerUpdateDelta );

  stats.update();

  renderer.render( scene, camera );

}