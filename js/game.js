import { ColladaLoader } from "../dependencies/ColladaLoader.js";
import { isStarted, updateCameraInStart, radToDeg } from "./startMenu.js";

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

camera.position.set(-15, 0, -0.035);

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
};

let isPressW = false;
let isPressS = false;
let isPressA = false;
let isPressD = false;

document.addEventListener("keydown", function (e) {
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

document.addEventListener("keyup", function (e) {
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
});
let speed = 0.3;
let angleX = 0;
let angleY = 0;
let angleIncrement = 10;

// Run game loop(update, render, repeat)
var GameLoop = function () {
    requestAnimationFrame(GameLoop);
    if (isStarted === 2 && ball) {
        if (isPressW) {
            ball.position.x += speed;
            angleX += angleIncrement;
            ball.rotation.y = angleX * (Math.PI / 180);
            camera.position.x += speed;
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
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);

        let corner = maze_mat.corner_check(ball.position.x, ball.position.z);
        rotateCam_inCorner(corner, ball.position, camera, isPressD, isPressA);
        maze_mat.refresh_mazeMat(ball.position.x, ball.position.z);
    }
    update();
    render();
};

GameLoop();
