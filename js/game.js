import { ColladaLoader } from "../dependencies/ColladaLoader.js";
import { Geometry } from "../dependencies/three.module.js";
import {
    gameCondition,
    changed,
    radius,
    setGameCondition,
    setChanged,
    updateCameraInStart,
    degToRad,
} from "./startMenu.js";
import * as dat from "../dependencies/dat.gui.module.js";
var scene = new THREE.Scene();
let ball;
let ghost1;
let ghost2;
let BallObject;
let GhostObject;
let GhostObject2;

let maze;
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(-15, 0, -0.035);

// we dont need this since we have two type of camera move options (mouse or keys)
// let controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.update();

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
// THREE.JS PLANE
const plane_geometry = new THREE.PlaneGeometry(32, 32, 8, 8);
const plane_material = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh(plane_geometry, plane_material);
plane.rotateX(Math.PI / 2);
plane.position.y = 0.001;

// THREE.JS PLANE
// const plane_geometry = new THREE.PlaneGeometry(32, 32, 8, 8);
// const plane_texture = new THREE.TextureLoader().load( 'ground.png' );
// const plane_material = new THREE.MeshBasicMaterial({
//     map: plane_texture,
//     side: THREE.DoubleSide,
// });
// const plane = new THREE.Mesh(plane_geometry, plane_material);
// plane.rotateX(Math.PI / 2);
// plane.position.y = 0.001;

var cubegeo = new THREE.CubeGeometry(1000, 1000, 1000);
var cube_materials = [
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_space/ft.png"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_space/bk.png"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_space/up.png"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_space/dn.png"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_space/rt.png"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_space/lf.png"),
        side: THREE.DoubleSide,
    }),
];

var cubeMaterial = new THREE.MeshFaceMaterial(cube_materials);
var cube = new THREE.Mesh(cubegeo, cubeMaterial);

var sliderOptions = {
    //paused: false,
    muted: false,
    changeFreely: false,
    isDay: true,
    spotLightFromAbove: true,
    
    lightPositionX: 50,
    lightPositionY: 200,
    lightPositionZ: 50,
    
    spotLightPositionX: 0,
    spotLightPositionY: 10,
    spotLightPositionZ: 0,
    
    spotLightTargetX: 0,
    spotLightTargetY: 0,
    spotLightTargetZ: 0,
    
    cameraPositionX: -25,
    cameraPositionY: 25,
    cameraPositionZ: 0,
    
    cameraTargetX: 0,
    cameraTargetY: 0,
    cameraTargetZ: 0
};

var gui = new dat.GUI();


var general = gui.addFolder("General Settings");
general.add(sliderOptions, 'muted').listen();
general.add(sliderOptions, 'changeFreely').listen();
general.add(sliderOptions, 'isDay').name("Day/Night").listen().onChange(function(){
    if(sliderOptions.isDay){
        scene.remove(hemiLightNight);
        scene.add(hemiLightDay);
        scene.remove(spotLight);
        scene.add(dirLight);
    }
    else{
        scene.remove(hemiLightDay);
        scene.add(hemiLightNight);
        scene.remove(dirLight);
        scene.add(spotLight);
    }
});
general.add(sliderOptions, 'spotLightFromAbove').name("Spot Light Type").listen();
general.open();

var lightPos = gui.addFolder("Light Position");
lightPos.add(sliderOptions, "lightPositionX", -200, 200).name("Position X").listen();
lightPos.add(sliderOptions, "lightPositionY", 0, 400).name("Position Y").listen();
lightPos.add(sliderOptions, "lightPositionZ", -200, 200).name("Position Z").listen();
lightPos.open();

var spotLightPos = gui.addFolder("Spot Light Position");
spotLightPos.add(sliderOptions, "spotLightPositionX", -32, 32).name("Position X").listen();
spotLightPos.add(sliderOptions, "spotLightPositionY", 0, 200).name("Position Y").listen();
spotLightPos.add(sliderOptions, "spotLightPositionZ", -32, 32).name("Position Z").listen();
spotLightPos.open();

var spotLightTarget = gui.addFolder("Spot Light Target");
spotLightTarget.add(sliderOptions, "spotLightTargetX", -32, 32).name("Target X").listen();
spotLightTarget.add(sliderOptions, "spotLightTargetZ", -32, 32).name("Target Z").listen();
spotLightTarget.open();


var cameraPos = gui.addFolder("Camera Position");
cameraPos.add(sliderOptions, "cameraPositionX", -50, 50).name("Position X").listen();
cameraPos.add(sliderOptions, "cameraPositionY", 0, 100).name("Position Y").listen();
cameraPos.add(sliderOptions, "cameraPositionZ", -50, 50).name("Position Z").listen();
cameraPos.open();

var cameraTarget = gui.addFolder("Camera Target");
cameraTarget.add(sliderOptions, "cameraTargetX", -50, 50).name("Target X").listen();
cameraTarget.add(sliderOptions, "cameraTargetY", 0, 100).name("Target Y").listen();
cameraTarget.add(sliderOptions, "cameraTargetZ", -50, 50).name("Target Z").listen();
cameraTarget.open();

const useSliders = function(){
    
    //lightPosition
    hemiLightDay.position.set(sliderOptions.lightPositionX, sliderOptions.lightPositionY, sliderOptions.lightPositionZ);
    dirLight.position.set(sliderOptions.lightPositionX, sliderOptions.lightPositionY, sliderOptions.lightPositionZ);
    
    if(sliderOptions.changeFreely){
        camera.position.set(sliderOptions.cameraPositionX, sliderOptions.cameraPositionY, sliderOptions.cameraPositionZ);
        camera.lookAt(sliderOptions.cameraTargetX, sliderOptions.cameraTargetY, sliderOptions.cameraTargetZ);
        spotLight.position.set(sliderOptions.spotLightPositionX, sliderOptions.spotLightPositionY, sliderOptions.spotLightPositionZ);
        spotLight.target.position.set(sliderOptions.spotLightTargetX, sliderOptions.spotLightTargetY, sliderOptions.spotLightTargetZ);
        spotLight.target.updateMatrixWorld();
    }
}

// LIGHTS

const hemiLightDay = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLightDay.position.set(0, 200, 0);
scene.add(hemiLightDay);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = -100;
dirLight.shadow.camera.left = -120;
dirLight.shadow.camera.right = 120;
scene.add(dirLight);

const hemiLightNight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1);
hemiLightNight.position.set(0, 200, 0);
//scene.add(hemiLightNight);

let spotLight = new THREE.SpotLight( 0xffffff, 0.8 );
spotLight.position.set( 0, 10, 0 );
spotLight.target.position.set( 0, 0, 0 );
spotLight.target.updateMatrixWorld();
spotLight.angle = Math.PI / 8;
spotLight.penumbra = 1;
spotLight.decay = 2;
spotLight.distance = 50;

spotLight.intensity = 3;

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 200;
spotLight.shadow.focus = 1;
//scene.add( spotLight );

// LIGHTS END


// COLLADA BEGINS
const loadingManager = new THREE.LoadingManager(function() {
    scene.add(ball);
    scene.add(ghost1);
    scene.add(ghost2);
    scene.add(maze);
    scene.add(cube);
    scene.add(plane);
});

const loader = new ColladaLoader(loadingManager);
loader.load("models/sphere.dae", function(collada) {
    collada.scene.position.x += 0;
    collada.scene.position.y += 0.5;
    collada.scene.position.z += 0;
    ball = collada.scene;
    BallObject = new Movable(ball);
});

loader.load("models/ghost.dae", function(collada) {
    collada.scene.position.x += 14;
    collada.scene.position.y += 0.75;
    collada.scene.position.z += -14;
    ghost1 = collada.scene;
    GhostObject = new Movable(ghost1);
});

loader.load("models/ghost2.dae", function(collada) {
    collada.scene.position.x += 14;
    collada.scene.position.y += 0.75;
    collada.scene.position.z += 14;
    ghost2 = collada.scene;
    GhostObject2 = new Movable(ghost2);
});

loader.load("models/pacman_maze_cubes.dae", function(collada) {
    collada.scene.position.y += 0;
    maze = collada.scene;
});
let maze_mat = new Maze();

// barrel
var barrels = [];
var barrel_updownTheta = [];
var barrel_rotationTheta = [];
for (var vertex of maze_mat.graph.getVertices()) {
    let passNode = Math.random() < 0.5;
    if (passNode) {
        continue;
    }
    let worldLoc = maze_mat.mazeLoc2worldLoc(vertex);
    loader.load("models/barrel.dae", function(collada) {
        collada.scene.position.x += worldLoc.x;
        collada.scene.position.y += 0.5;
        collada.scene.position.z += worldLoc.z;
        barrels.push(collada.scene);
        barrel_updownTheta.push(Math.floor(Math.random() * 180));
        barrel_rotationTheta.push(Math.floor(Math.random() * 180));
        scene.add(collada.scene)
    });
}
// COLLADA END



// Game Logic
var update = function() {};

//  Draw the scene

var render = function() {
    renderer.render(scene, camera);
    updateCameraInStart(camera, ball);
    if (gameCondition === 4) {}
};

let isPressW = false;
let isPressS = false;
let isPressA = false;
let isPressD = false;

document.addEventListener("keydown", function(e) {
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
            GhostObject2.path = maze_mat.graph.shortest_path(
                GhostObject2.get_mazeCoord(maze_mat),
                BallObject.get_mazeCoord(maze_mat)
            );
            break;
        case "z":
        case "Z":
            // call the red ghost
            GhostObject.path = maze_mat.graph.shortest_path(
                GhostObject.get_mazeCoord(maze_mat),
                BallObject.get_mazeCoord(maze_mat)
            );
            break;
    }
});

document.addEventListener("keyup", function(e) {
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

canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock;

document.exitPointerLock =
    document.exitPointerLock || document.mozExitPointerLock;

let isActiveE = 1;

document.onkeypress = function(e) {
    if ((e.key === "e" || e.key === "E") && gameCondition === 2) {
        if (!isActiveE) {
            canvas.requestPointerLock();
            isActiveE = 1;
        } else {
            document.exitPointerLock();
            isActiveE = 0;
        }
    }
};

document.addEventListener("pointerlockchange", lockChangeAlert, false);
document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

function lockChangeAlert() {
    if (
        document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas
    ) {
        document.addEventListener("mousemove", updateCamera, false);
    } else {
        document.removeEventListener("mousemove", updateCamera, false);
    }
}

function updateCamera(e) {
    if (gameCondition === 2) {
        rotation_angleX += e.movementX * 0.05;
        if (rotation_angleY >= 20 && rotation_angleY <= 60) {
            rotation_angleY += e.movementY * 0.05;
            current_radius += e.movementY * 0.001;
        }
        if (rotation_angleY < 30) {
            rotation_angleY = 30;
            current_radius = 3.14;
        }
        if (rotation_angleY > 60) {
            rotation_angleY = 60;
            current_radius = 3.74;
        }
    }

    //eyeY += e.movementY * 0.005;
}

// shortest path from ghost's locaction to pacman's location
function collisionCheckSystemWithMachineLearningAndDeepLearning() {
    // Sphere Coordinates
    let sx = ball.position.x;
    let sy = ball.position.y;
    let sz = -ball.position.z;
    let radius = 0.4;
    for (let i = 0; i < 150; i++) {
        if (maze["children"][i]["name"].substr(0, 5) !== "Cube.") continue;

        let currentCube = maze["children"][i];
        // Cube Coordinates
        let cx = currentCube["position"]["x"];
        let cz = currentCube["position"]["y"];
        let cy = currentCube["position"]["z"];

        if (
            cx - 1 - radius < sx &&
            sx <= cx + 1 + radius &&
            cz - 1 - radius <= sz &&
            sz <= cz + 1 + radius
        ) {
            return true;
        }
    }

    return false;
}

function moveForward() {
    BallObject.speedUp(
        speed * Math.cos(degToRad(rotation_angleX)),
        0,
        speed * Math.sin(degToRad(rotation_angleX))
    );
    BallObject.rotation(0, 0, -angleIncrement);
    BallObject.action();
    BallObject.resetMotion();
}

function moveBackward() {
    BallObject.speedUp(-speed * Math.cos(degToRad(rotation_angleX)),
        0, -speed * Math.sin(degToRad(rotation_angleX))
    );
    BallObject.rotation(0, 0, angleIncrement);
    BallObject.action();
    BallObject.resetMotion();
}

function moveLeft() {
    BallObject.speedUp(
        speed * Math.sin(degToRad(rotation_angleX)),
        0, -speed * Math.cos(degToRad(rotation_angleX))
    );
    BallObject.rotation(-angleIncrement, 0, 0);
    BallObject.action();
    BallObject.resetMotion();
}

function moveRight() {
    BallObject.speedUp(-speed * Math.sin(degToRad(rotation_angleX)),
        0,
        speed * Math.cos(degToRad(rotation_angleX))
    );
    BallObject.rotation(angleIncrement, 0, 0);
    BallObject.action();
    BallObject.resetMotion();
}


let score = 0;

var GameLoop = function() {
    requestAnimationFrame(GameLoop);
    
    // random barrel movements 
    for (let b = 0; b < barrels.length; b++) {
        barrels[b].position.y = Math.abs(Math.sin(degToRad(barrel_updownTheta[b])))/10+0.5;
        barrels[b].rotation.x = barrel_rotationTheta[b];
        barrels[b].rotation.y = barrel_rotationTheta[b];
        barrels[b].rotation.z = barrel_rotationTheta[b];
        
        barrel_updownTheta[b] = (barrel_updownTheta[b] + 5)%360;
        barrel_rotationTheta[b] = (barrel_rotationTheta[b] + 0.01)%360;
    }
    
    //request pointer lock when game start, exit pointer lock when game paused
    if(changed){
        if(gameCondition === 2 ){
            canvas.requestPointerLock();
        }
        else{
            document.exitPointerLock();
            
        }
        setChanged(0);
    }
    
    
    useSliders();

    if (gameCondition === 2 && ball) {
        if (collisionCheckSystemWithMachineLearningAndDeepLearning() === false) {
            if (isPressW) {
                moveForward();
                if (collisionCheckSystemWithMachineLearningAndDeepLearning() === true)
                    moveBackward();
                // ball.position.x += speed * Math.cos(degToRad(rotation_angleX));
                // ball.position.z += speed * Math.sin(degToRad(rotation_angleX));

                // angleX += angleIncrement;
                // ball.rotation.y = angleX * (Math.PI / 180);
            }
            if (isPressS) {
                moveBackward();
                if (collisionCheckSystemWithMachineLearningAndDeepLearning() === true)
                    moveForward();
                // ball.position.x -= speed * Math.cos(degToRad(rotation_angleX));
                // ball.position.z -= speed * Math.sin(degToRad(rotation_angleX));

                // angleX -= angleIncrement;
                // ball.rotation.y = angleX * (Math.PI / 180);
            }
            if (isPressA) {
                moveLeft();
                if (collisionCheckSystemWithMachineLearningAndDeepLearning() === true)
                    moveRight();
                // ball.position.x += speed * Math.sin(degToRad(rotation_angleX));
                // ball.position.z -= speed * Math.cos(degToRad(rotation_angleX));

                // angleY -= angleIncrement;
                // ball.rotation.x = angleY * (Math.PI / 180);
            }
            if (isPressD) {
                moveRight();
                if (collisionCheckSystemWithMachineLearningAndDeepLearning() === true)
                    moveLeft();

                // ball.position.x -= speed * Math.sin(degToRad(rotation_angleX));
                // ball.position.z += speed * Math.cos(degToRad(rotation_angleX));

                // angleY += angleIncrement;
                // ball.rotation.x = angleY * (Math.PI / 180);
            }
        }
        GhostObject.execute_thePath();
        GhostObject2.execute_thePath();

        BallObject.action();
        BallObject.resetMotion();
        GhostObject.action();
        GhostObject.resetMotion();
        GhostObject2.action();
        GhostObject2.resetMotion();
        
        
        document.getElementById("scoreboard").textContent = "Score: "+ score;
        
        
        if(!sliderOptions.changeFreely){
            camera.position.x =
                ball.position.x - current_radius * Math.cos(degToRad(rotation_angleX));
            camera.position.z =
                ball.position.z - current_radius * Math.sin(degToRad(rotation_angleX));
            camera.position.y =
                ball.position.y + current_radius * Math.sin(degToRad(rotation_angleY));
            camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
            
            if(sliderOptions.spotLightFromAbove){
                spotLight.position.set(ball.position.x, ball.position.y + 10, ball.position.z);
                spotLight.target.position.set(ball.position.x, ball.position.y, ball.position.z);
                spotLight.distance = 50;
            }
            else{
                spotLight.position.set(ball.position.x, ball.position.y, ball.position.z);
                spotLight.target.position.x = ball.position.x + (ball.position.x - camera.position.x);
                spotLight.target.position.y = ball.position.y - 0.1;
                spotLight.target.position.z = ball.position.z + (ball.position.z - camera.position.z);
                spotLight.distance = 50;
            }
            spotLight.target.updateMatrixWorld();
            
        }
        
        
        // corner check
        //let corner = maze_mat.corner_check(ball.position.x, ball.position.z);
        //rotateCam_inCorner(corner, ball.position, camera, isPressD, isPressA);
        //maze_mat.refresh_mazeMat(ball.position.x, ball.position.z);
    }
    update();
    render();
};

GameLoop();