import { ColladaLoader } from "../dependencies/ColladaLoader.js";

localizer(1);
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

window.addEventListener("resize", function() {
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
const loadingManager = new THREE.LoadingManager(function() {
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
var update = function() {};


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

let isPressW = false;
let isPressS = false;
let isPressA = false;
let isPressD = false;

document.addEventListener("keydown", function(e) {
    console.log(
        "Camera Pos: " +
        camera.position.x.toFixed(4) +
        ", " +
        camera.position.y.toFixed(4) +
        ", " +
        camera.position.z.toFixed(4)
    );
    console.log(
        "Ball Pos: " +
        ball.position.x.toFixed(4) +
        ", " +
        ball.position.y.toFixed(4) +
        ", " +
        ball.position.z.toFixed(4)
    );

    switch (e.key) {
        case "w":
            isPressW = true;
            break;
        case "s":
            isPressS = true;
            break;
        case "a":
            isPressA = true;
            break;
        case "d":
            isPressD = true;
            break;
    }
});

document.addEventListener("keyup", function(e) {
    switch (e.key) {
        case "w":
            isPressW = false;
            break;
        case "s":
            isPressS = false;
            break;
        case "a":
            isPressA = false;
            break;
        case "d":
            isPressD = false;
            break;
    }

    // calculate the new position in the maze
    // if it is changed then update the maze_matrix
    var new_mazePosition = localizer(ball.position.x, ball.position.z);
    if (old_mazeX != new_mazePosition.x || old_mazeY != new_mazePosition.z) {
        maze_matrix[old_mazeY][old_mazeX] = old_symbol;
        old_symbol = maze_matrix[new_mazePosition.z][new_mazePosition.x];
        maze_matrix[new_mazePosition.z][new_mazePosition.x] = "O";
        old_mazeX = new_mazePosition.x;
        old_mazeY = new_mazePosition.z;
        console.clear();
        print_mazeMat();
    }
});
let speed = 0.3;
let angleX = 0;
let angleY = 0;
let angleIncrement = 10;

var old_mazeX = 0;
var old_mazeY = 0;
var old_symbol = ".";

// Run game loop(update, render, repeat)
var GameLoop = function() {
    requestAnimationFrame(GameLoop);
    if (isPressW) {
        ball.position.x += speed;
        camera.position.x += speed;
        angleX += angleIncrement;
        ball.rotation.y = angleX * (Math.PI / 180);
        console.log("test2");
    }
    if (isPressS) {
        ball.position.x -= speed;
        camera.position.x -= speed;
        angleX -= angleIncrement;
        ball.rotation.y = angleX * (Math.PI / 180);
    }
    if (isPressA) {
        ball.position.z -= speed;
        camera.position.z -= speed;
        angleY -= angleIncrement;
        ball.rotation.x = angleY * (Math.PI / 180);
    }
    if (isPressD) {
        ball.position.z += speed;
        camera.position.z += speed;
        angleY += angleIncrement;
        ball.rotation.x = angleY * (Math.PI / 180);
    }

    update();
    render();
};

GameLoop();