import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Loaders
 */

const gltfLoader = new GLTFLoader();
// cube texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
// add an envMapIntensity property to Dat.GUI by using debugObject
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * update all materials
 */
const updateAllMaterials = () => {
  // use instanceof to target the THREE.Mesh using THREE.MeshStandardMaterial
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      console.log(child, "child");
      // now we can use 'environmentMap' on the 'envMap' of material
      child.material.envMap = environmentMap;
      // increase intensity of env map
      child.material.envMapIntensity = debugObject.envMapIntensity;
      // activate the shadow on all Meshes
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

// /**
//  * Test sphere
//  */
// const testSphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial()
// );
// scene.add(testSphere);

// Loading textures after creating a scene
/**
 * Environment Maps
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

// ### Apply enviroment map to the background ###
// To apply the environmentMap on the scene we use background property
scene.background = environmentMap;

// There is an easier way of applying the environment map to all objects with the 'environment' property on the scene
scene.environment = environmentMap;

// change environmentMap encoding to THREE.sRGBEncoding
// environmentMap.encoding = THREE.sRGBEncoding  // This is also handled by THREE.GLTFLoader()

debugObject.envMapIntensity = 5;
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(() => {
    updateAllMaterials();
  });

/**
 * Models
 */
// Load the model
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  console.log("success");
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  // add to gui
  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("rotation");

  updateAllMaterials();
});

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(0.25, 3, -2.25);
// Activate the shadow on directional light
directionalLight.castShadow = true;
// Reduce the far value of the light
directionalLight.shadow.camera.far = 15;
// increase the shadow map size to 1024x1024
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);

/**
 * GUI Changes
 */

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");
gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, // Three.js handles aliasing automatically, just we have to initialize it.
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.outputEncoding = THREE.sRGBEncoding; // Not required to handle as THREE.GLTFLoader() does it automatically
renderer.toneMapping = THREE.ReinhardToneMapping;

renderer.toneMappingExposure = 3;

// To activate the shadow on WebGLRenderer and change the shadow type to THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add to "toneMapping" Dat.GUI
gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

// Add to "toneMappingExposure" Dat.GUI
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
