import { ColladaLoader } from "../dependencies/ColladaLoader.js";
import { gameCondition, radius, updateCameraInStart, degToRad } from "./startMenu.js";

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

const geometry = new THREE.PlaneGeometry(100, 100, 8, 8);

const texture = new THREE.TextureLoader().load( 'ground.png' );

const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
});

// THREE.JS PLANE
 const plane = new THREE.Mesh(geometry, material);
 plane.rotateX(Math.PI / 2);
 plane.position.y = 0.001;
 scene.add(plane);
 
// COLLADA BEGINS
const loadingManager = new THREE.LoadingManager(function () {
    scene.add(ball);
    scene.add(maze);
});

camera.position.set(-15, 0, -0.035);

let controls = new THREE.OrbitControls(camera, renderer.domElement);



controls.update();
// collada
let shape;
const loader = new ColladaLoader(loadingManager);
loader.load("models/sphere.dae", function (collada) {
    collada.scene.position.x += 0;
    collada.scene.position.y += 0.75;
    collada.scene.position.z += 0;
    ball = collada.scene;
});


loader.load("models/pacman_maze.dae", function (collada) {
    collada.scene.position.y += 0;
    maze = collada.scene;
});
let maze_mat = new Maze();

const light = new THREE.AmbientLight(0x404040, 10); // soft white light
light.position.set(10, 20, 0);
scene.add(light);

// COLLADA END

// Game Logic
var update = function () {};

//  Draw the scene

var render = function () {
    renderer.render(scene, camera);
    updateCameraInStart(camera, ball);
    if(gameCondition === 4){
        
    }
};

let isPressW = false;
let isPressS = false;
let isPressA = false;
let isPressD = false;

document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "w":
        case "W":
            isPressW = true;
            break;
        case "s":
        case "S":
            isPressS = true;
            break;
        case "a":
        case "A":
            isPressA = true;
            break;
        case "d":
        case "D":
            isPressD = true;
            break;
    }
});

document.addEventListener("keyup", function (e) {
    switch (e.key) {
        case "w":
        case "W":
            isPressW = false;
            break;
        case "s":
        case "S":
            isPressS = false;
            break;
        case "a":
        case "A":
            isPressA = false;
            break;
        case "d":
        case "D":
            isPressD = false;
            break;
    }
});
let speed = 0.1;
let angleX = 0;
let angleY = 0;
let angleIncrement = 10;
rotation_angleX = 0;
rotation_angleY = 53;
let current_radius = 3.6;
// Run game loop(update, render, repeat)
let canvas = document.body;

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

let isActiveE = 0;

document.onkeypress = function (e) {
    //console.log(e)
    if((e.key === "e" || e.key === "E") && gameCondition === 2){
        if(!isActiveE){
            canvas.requestPointerLock();
            isActiveE = 1;
        }
        else{
            document.exitPointerLock();
            isActiveE = 0;
        }
    }
};

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      document.addEventListener("mousemove", updateCamera, false);
    } else {
      document.removeEventListener("mousemove", updateCamera, false);
    }
}

function updateCamera(e) {
    if(gameCondition === 2){
        rotation_angleX += e.movementX * 0.05;
        if(rotation_angleY >= 20 && rotation_angleY <= 60){
            rotation_angleY += e.movementY * 0.05;
            current_radius += e.movementY * 0.001;
        }
        if(rotation_angleY < 30){
            rotation_angleY = 30;
            current_radius = 3.14;
        }
        if(rotation_angleY > 60){
            rotation_angleY = 60;
            current_radius = 3.74;
        }
    }
    
    
    //eyeY += e.movementY * 0.005;
}
    
var GameLoop = function () {
    requestAnimationFrame(GameLoop);
    //console.log(speed * Math.cos(degToRad(rotation_angle)))
    if (gameCondition === 2 && ball) {
        if (isPressW) {
            //ball.position.x += speed;
            ball.position.x += speed * Math.cos(degToRad(rotation_angleX));
            ball.position.z += speed * Math.sin(degToRad(rotation_angleX));
            //camera.position.x += speed * Math.cos(degToRad(rotation_angle));
            //camera.position.z += speed * Math.sin(degToRad(rotation_angle));
            angleX += angleIncrement;
            ball.rotation.y = angleX * (Math.PI / 180);
        }
        if (isPressS) {
            //ball.position.x -= speed
            ball.position.x -= speed * Math.cos(degToRad(rotation_angleX));
            ball.position.z -= speed * Math.sin(degToRad(rotation_angleX));
            //camera.position.x -= speed * Math.cos(degToRad(rotation_angle));
            //camera.position.z -= speed * Math.sin(degToRad(rotation_angle));
            angleX -= angleIncrement;
            ball.rotation.y = angleX * (Math.PI / 180);
        }
        if (isPressA) {
            //ball.position.z -= speed
            ball.position.x += speed * Math.sin(degToRad(rotation_angleX));
            ball.position.z -= speed * Math.cos(degToRad(rotation_angleX));
            //camera.position.x += speed * Math.sin(degToRad(rotation_angle));
            //camera.position.z -= speed * Math.cos(degToRad(rotation_angle));
            angleY -= angleIncrement;
            ball.rotation.x = angleY * (Math.PI / 180);
        }
        if (isPressD) {
            //ball.position.z += speed
            ball.position.x -= speed * Math.sin(degToRad(rotation_angleX));
            ball.position.z += speed * Math.cos(degToRad(rotation_angleX));
            //camera.position.x -= speed * Math.sin(degToRad(rotation_angle));
            //camera.position.z += speed * Math.cos(degToRad(rotation_angle));
            angleY += angleIncrement;
            ball.rotation.x = angleY * (Math.PI / 180);
        }
        camera.position.x = ball.position.x - current_radius * Math.cos(degToRad(rotation_angleX));
        camera.position.z = ball.position.z - current_radius * Math.sin(degToRad(rotation_angleX));
        camera.position.y = ball.position.y + current_radius * Math.sin(degToRad(rotation_angleY));
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
        
        // corner check
        //let corner = maze_mat.corner_check(ball.position.x, ball.position.z);
        //rotateCam_inCorner(corner, ball.position, camera, isPressD, isPressA);
        //maze_mat.refresh_mazeMat(ball.position.x, ball.position.z);
    }
    update();
    render();
};

GameLoop();
