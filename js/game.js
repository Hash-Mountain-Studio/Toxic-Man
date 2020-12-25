import { ColladaLoader } from "../dependencies/ColladaLoader.js";

var scene = new THREE.Scene();
let ball;
let maze;
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

const geometry = new THREE.PlaneGeometry(1000, 1000, 8, 8);
const material = new THREE.MeshBasicMaterial({
  color: 0x1d2951,
  side: THREE.DoubleSide,
});

// THREE.JS PLANE
// const plane = new THREE.Mesh(geometry, material);
// plane.rotateX(-Math.PI / 2);
// scene.add(plane);

// COLLADA BEGINS
const loadingManager = new THREE.LoadingManager(function () {
  scene.add(ball);
  scene.add(maze);
});

// DEFAULT CAMERA
// camera.position.x = 12;
// camera.position.y = 14;
// camera.position.z = -33;

// SPHERE CAMERA
//camera.position.x = -17.67;  // r*cosa
//camera.position.y = 0;   // 10, 30
//camera.position.z = -0.035;  // r*sina

//camera.rotation.x = -17.67;  // -0.40
//camera.rotation.y = 24.46;   // 10, 30
//camera.rotation.z = -0.035;  // r*sina
camera.position.set( -17.67, 0, -0.035 );

let controls = new THREE.OrbitControls(camera, renderer.domElement);


controls.update();
// collada
let shape;
const loader = new ColladaLoader(loadingManager);
loader.load("models/sphere.dae", function (collada) {
  collada.scene.position.x += 0;
  collada.scene.position.y += 1;
  collada.scene.position.z += 0;
  ball = collada.scene;
});

loader.load("models/pacman_maze.dae", function (collada) {
  collada.scene.position.y += 0;
  maze = collada.scene;
});

const light = new THREE.AmbientLight(0x404040, 10); // soft white light
light.position.set(10, 20, 0);
scene.add(light);

// COLLADA END

// Game Logic
var update = function () {};


function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.parentNode.remove();
}

let isStarted = 0;
document.getElementById("playButton").onclick = function(){
    isStarted = 1;
    removeElement("playButton");
    
};


//  Draw the scene
var render = function () {
  renderer.render(scene, camera);
  updateCameraInStart();
  //console.log(camera.position.y + " " + camera.rotation.y );
};

let radius = 25;
let theta = 20;
let phi = 0;
let thetaSpeed = 0.1;
let phiSpeed = 0.3;
 

let radToDeg = function(radian){
    return radian * 180 / Math.PI;
};

let degToRad = function(degree){
    return degree * Math.PI / 180;
};

var updateCameraInStart = function () {
    if(theta >= 170 || theta <= 10){
        thetaSpeed = -thetaSpeed;
    }
    phi = (phi + phiSpeed) % 360;
    //console.log(theta, phi);
    camera.position.set( -radius * Math.cos(degToRad(theta)), radius * Math.sin(degToRad(theta)), radius * Math.cos(degToRad(phi)));
    if(ball){
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
    }
    
    theta += thetaSpeed;
};

// Run game loop(update, render, repeat)
var GameLoop = function () {
  requestAnimationFrame(GameLoop);
  document.onkeypress = function (e) {
    e = e || window.event;
    switch (e.key) {
      case "w":
        ball.position.x += 0.5;
        camera.position.x += 0.5;
        break;
      case "s":
        ball.position.x -= 0.5;
        camera.position.x -= 0.5;
        break;
      case "a":
        ball.position.z -= 0.5;
        camera.position.z -= 0.5;
        break;
      case "d":
        ball.position.z += 0.5;
        camera.position.z += 0.5;
        break;
    }
  };
  update();
  render();
};

GameLoop();
