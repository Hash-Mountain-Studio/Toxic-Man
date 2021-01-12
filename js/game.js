import { ColladaLoader } from "../dependencies/ColladaLoader.js";
import { gameCondition, radius, updateCameraInStart, degToRad } from "./startMenu.js";

var scene = new THREE.Scene();
let ball;
let ghost1;
let ghost2;
var ghost1_path;
var ghost2_path;

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
 const plane = new THREE.Mesh(geometry, material);
 plane.rotateX(Math.PI / 2);
 plane.position.y = 0.001;
 scene.add(plane);
 
// COLLADA BEGINS
const loadingManager = new THREE.LoadingManager(function () {
    scene.add(ball);
    scene.add(ghost1);
    scene.add(ghost2);
    scene.add(maze);
});

camera.position.set(-15, 0, -0.035);

let controls = new THREE.OrbitControls(camera, renderer.domElement);



controls.update();
// collada
let BallObject;
let GhostObject;
let GhostObject2;
const loader = new ColladaLoader(loadingManager);
loader.load("models/sphere.dae", function (collada) {
    collada.scene.position.x += 0;
    collada.scene.position.y += 0.5;
    collada.scene.position.z += 0;
    ball = collada.scene;
    BallObject = new Movable(ball);
});

loader.load("models/ghost.dae", function (collada) {
    collada.scene.position.x += 14;
    collada.scene.position.y += 0.75;
    collada.scene.position.z += -14;
    ghost1 = collada.scene;
    GhostObject = new Movable(ghost1);
});

loader.load("models/ghost2.dae", function (collada) {
    collada.scene.position.x += 14;
    collada.scene.position.y += 0.75;
    collada.scene.position.z += 14;
    ghost2 = collada.scene;
    GhostObject2 = new Movable(ghost2);
});

loader.load("models/pacman_maze_cubes.dae", function (collada) {
    collada.scene.position.y += 0;
    maze = collada.scene;
});
let maze_mat = new Maze();

// COLLADA END

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 200, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 200, 100 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );

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
        case "x":
        case "X":
            // call the green ghost
            ghost2_path = maze_mat.graph.shortest_path(GhostObject2.get_mazeCoord(maze_mat), BallObject.get_mazeCoord(maze_mat));
            break;
        case "z":
        case "Z":
            // call the red ghost
            ghost1_path = maze_mat.graph.shortest_path(GhostObject.get_mazeCoord(maze_mat), BallObject.get_mazeCoord(maze_mat));
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

// shortest path from ghost's locaction to pacman's location

var GameLoop = function () {
    requestAnimationFrame(GameLoop);
    if (gameCondition === 2 && ball) {
        if (isPressW) {

            BallObject.speedUp(speed * Math.cos(degToRad(rotation_angleX)), 0, speed * Math.sin(degToRad(rotation_angleX)));
            BallObject.rotation(0, 0, -angleIncrement);
            // ball.position.x += speed * Math.cos(degToRad(rotation_angleX));
            // ball.position.z += speed * Math.sin(degToRad(rotation_angleX));

            // angleX += angleIncrement;
            // ball.rotation.y = angleX * (Math.PI / 180);
        }
        if (isPressS) {
            BallObject.speedUp(-speed * Math.cos(degToRad(rotation_angleX)), 0, -speed * Math.sin(degToRad(rotation_angleX)));
            BallObject.rotation(0, 0, angleIncrement);
            // ball.position.x -= speed * Math.cos(degToRad(rotation_angleX));
            // ball.position.z -= speed * Math.sin(degToRad(rotation_angleX));

            // angleX -= angleIncrement;
            // ball.rotation.y = angleX * (Math.PI / 180);
        }
        if (isPressA) {
            BallObject.speedUp(speed * Math.sin(degToRad(rotation_angleX)), 0, -speed * Math.cos(degToRad(rotation_angleX)));
            BallObject.rotation(-angleIncrement, 0, 0);

            // ball.position.x += speed * Math.sin(degToRad(rotation_angleX));
            // ball.position.z -= speed * Math.cos(degToRad(rotation_angleX));

            // angleY -= angleIncrement;
            // ball.rotation.x = angleY * (Math.PI / 180);
        }
        if (isPressD) {
            BallObject.speedUp(-speed * Math.sin(degToRad(rotation_angleX)), 0, speed * Math.cos(degToRad(rotation_angleX)));
            BallObject.rotation(angleIncrement, 0, 0);

            // ball.position.x -= speed * Math.sin(degToRad(rotation_angleX));
            // ball.position.z += speed * Math.cos(degToRad(rotation_angleX));

            // angleY += angleIncrement;
            // ball.rotation.x = angleY * (Math.PI / 180);
        }


        GhostObject.execute_thePath(ghost1_path);
        GhostObject2.execute_thePath(ghost2_path);


        BallObject.action();
        BallObject.resetMotion();
        GhostObject.action();
        GhostObject.resetMotion();
        GhostObject2.action();
        GhostObject2.resetMotion();
    
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
