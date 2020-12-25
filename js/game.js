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

let thetaDistance;
let phiDistance;
let radiusDistance;

var updateCameraInStart = function () {
    if(isStarted === 0){
        thetaDistance = theta - 45;
        phiDistance = phi - 90;
        radiusDistance = radius - 5;
        updateCameraBeforeStart();
    }
    if(isStarted === 1){
        updateCameraAfterStart();
    }
    
};

var updateCameraBeforeStart = function () {
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

let startPosition = function (value, distance, startValue, range) {
    if(value > startValue + range){
        value -= distance / 500;
    }
    else if(value < startValue - range){
        value -= distance / 500;
    }
    else {
        value = startValue;
    }
    return value;
}
 

var updateCameraAfterStart = function () {
    
    theta = startPosition(theta, thetaDistance, 45, 0.2);
    phi = startPosition(phi, phiDistance, 90, 0.5);
    radius = startPosition(radius, radiusDistance, 5, 0.2);
    if(theta === 45 && phi === 90 && radius === 5){
        isStarted = 2;
    }
    //console.log(theta, phi, radius);
    camera.position.set( -radius * Math.cos(degToRad(theta)), radius * Math.sin(degToRad(theta)), radius * Math.cos(degToRad(phi)));
    if(ball){
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
    }
};

let move = function () {
    if(isStarted === 2){
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
    }
    
};

// Run game loop(update, render, repeat)
var GameLoop = function () {
  requestAnimationFrame(GameLoop);
  
  move();
  update();
  render();
};

GameLoop();
