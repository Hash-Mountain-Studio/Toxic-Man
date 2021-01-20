import { ColladaLoader } from "../dependencies/ColladaLoader.js";
import { Geometry } from "../dependencies/three.module.js";
import {
    gameCondition,
    changed,
    radius,
    focus,
    canFocus,
    setGameCondition,
    setChanged,
    setCanFocus,
    updateCameraInStart,
    degToRad,
    gameOver,
    youWon,
} from "./startMenu.js";
import * as dat from "../dependencies/dat.gui.module.js";
var scene = new THREE.Scene();
let ball;
let ghost1;
let ghost2;
let ghost3;
let wings;
let hammer;
let hammerDown;
let BallObject;
let GhostObject;
let GhostObject2;
let GhostObject3;

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

//texture
const groundTexture = new THREE.TextureLoader().load("../textures/ground.jpeg");
// console.log(groundTexture);
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(16, 16);

//texture
const wallTexture = new THREE.TextureLoader().load("../textures/wall.jpg");
// console.log(wallTexture);
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.rotation = degToRad(90);
wallTexture.repeat.set(2, 2);

const oildrumTexture = new THREE.TextureLoader().load(
    "../textures/oildrum.jpeg"
);
const ballTexture = new THREE.TextureLoader().load("../textures/ball.jpg");
const ghostTexture1 = new THREE.TextureLoader().load("../textures/ghost1.jpg");
const ghostTexture2 = new THREE.TextureLoader().load("../textures/ghost2.jpg");
const ghostTexture3 = new THREE.TextureLoader().load("../textures/ghost3.jpg");

// THREE.JS PLANE
const plane_geometry = new THREE.PlaneGeometry(32, 32, 8, 8);
const plane_material = new THREE.MeshLambertMaterial({
    //color: 0xffff00,
    map: groundTexture,
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
});
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

function setChecked(prop) {
    for (let param in shadingTypes) {
        shadingTypes[param] = false;
    }
    shadingTypes[prop] = true;
}

var cubeMaterial = new THREE.MeshFaceMaterial(cube_materials);
var cube = new THREE.Mesh(cubegeo, cubeMaterial);

var sliderOptions = {
    //paused: false,
    muted: false,
    godMode: false,
    changeFreely: false,
    isDay: true,
    spotLightFromAbove: true,

    rotationObjX: 0,
    rotationObjY: 0,
    rotationObjZ: 0,

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
    cameraTargetZ: 0,
};

let shadingTypes = {
    phongShading: true,
    toonShading: false,
    lambertShading: false,
};

var gui = new dat.GUI();

var general = gui.addFolder("General Settings");
general.add(sliderOptions, "muted").listen();
general.add(sliderOptions, "godMode").listen();
general.add(sliderOptions, "changeFreely").listen();
general
    .add(sliderOptions, "isDay")
    .name("Day/Night")
    .listen()
    .onChange(function() {
        if (sliderOptions.isDay) {
            scene.remove(hemiLightNight);
            scene.add(hemiLightDay);
            scene.remove(spotLight);
            scene.add(dirLight);
        } else {
            scene.remove(hemiLightDay);
            scene.add(hemiLightNight);
            scene.remove(dirLight);
            scene.add(spotLight);
        }
    });
general
    .add(sliderOptions, "spotLightFromAbove")
    .name("Spot Light Type")
    .listen();
general.open();

var shading = gui.addFolder("Shading");
shading
    .add(shadingTypes, "phongShading")
    .name("Phong Shading")
    .listen()
    .onChange(function() {
        setChecked("phongShading");
        makePhongShading();
    });
shading
    .add(shadingTypes, "toonShading")
    .name("Toon Shading")
    .listen()
    .onChange(function() {
        setChecked("toonShading");
        makeToonShading();
    });
shading
    .add(shadingTypes, "lambertShading")
    .name("Lambert Shading")
    .listen()
    .onChange(function() {
        setChecked("lambertShading");
        makeLambertShading();
    });

var selectedOjectRotationSpeed = gui.addFolder("Obj Rotation Speed");
selectedOjectRotationSpeed
    .add(sliderOptions, "rotationObjX", -0.1, 0.1)
    .name("Rotation Speed X")
    .listen();
selectedOjectRotationSpeed
    .add(sliderOptions, "rotationObjY", -0.1, 0.1)
    .name("Rotation Speed Y")
    .listen();
selectedOjectRotationSpeed
    .add(sliderOptions, "rotationObjZ", -0.1, 0.1)
    .name("Rotation Speed Z")
    .listen();
selectedOjectRotationSpeed.open();

var lightPos = gui.addFolder("Light Position");
lightPos
    .add(sliderOptions, "lightPositionX", -200, 200)
    .name("Position X")
    .listen();
lightPos
    .add(sliderOptions, "lightPositionY", 0, 400)
    .name("Position Y")
    .listen();
lightPos
    .add(sliderOptions, "lightPositionZ", -200, 200)
    .name("Position Z")
    .listen();
lightPos.open();

var spotLightPos = gui.addFolder("Spot Light Position");
spotLightPos
    .add(sliderOptions, "spotLightPositionX", -32, 32)
    .name("Position X")
    .listen();
spotLightPos
    .add(sliderOptions, "spotLightPositionY", 0, 200)
    .name("Position Y")
    .listen();
spotLightPos
    .add(sliderOptions, "spotLightPositionZ", -32, 32)
    .name("Position Z")
    .listen();
spotLightPos.open();

var spotLightTarget = gui.addFolder("Spot Light Target");
spotLightTarget
    .add(sliderOptions, "spotLightTargetX", -32, 32)
    .name("Target X")
    .listen();
spotLightTarget
    .add(sliderOptions, "spotLightTargetZ", -32, 32)
    .name("Target Z")
    .listen();
spotLightTarget.open();

var cameraPos = gui.addFolder("Camera Position");
cameraPos
    .add(sliderOptions, "cameraPositionX", -50, 50)
    .name("Position X")
    .listen();
cameraPos
    .add(sliderOptions, "cameraPositionY", 0, 100)
    .name("Position Y")
    .listen();
cameraPos
    .add(sliderOptions, "cameraPositionZ", -50, 50)
    .name("Position Z")
    .listen();
cameraPos.open();

var cameraTarget = gui.addFolder("Camera Target");
cameraTarget
    .add(sliderOptions, "cameraTargetX", -50, 50)
    .name("Target X")
    .listen();
cameraTarget
    .add(sliderOptions, "cameraTargetY", 0, 100)
    .name("Target Y")
    .listen();
cameraTarget
    .add(sliderOptions, "cameraTargetZ", -50, 50)
    .name("Target Z")
    .listen();
cameraTarget.open();

const useSliders = function() {
    //lightPosition
    hemiLightDay.position.set(
        sliderOptions.lightPositionX,
        sliderOptions.lightPositionY,
        sliderOptions.lightPositionZ
    );
    dirLight.position.set(
        sliderOptions.lightPositionX,
        sliderOptions.lightPositionY,
        sliderOptions.lightPositionZ
    );

    if (sliderOptions.changeFreely) {
        camera.position.set(
            sliderOptions.cameraPositionX,
            sliderOptions.cameraPositionY,
            sliderOptions.cameraPositionZ
        );
        camera.lookAt(
            sliderOptions.cameraTargetX,
            sliderOptions.cameraTargetY,
            sliderOptions.cameraTargetZ
        );
        spotLight.position.set(
            sliderOptions.spotLightPositionX,
            sliderOptions.spotLightPositionY,
            sliderOptions.spotLightPositionZ
        );
        spotLight.rotation.set(
            sliderOptions.spotLightTargetX,
            sliderOptions.spotLightTargetY,
            sliderOptions.spotLightTargetZ
        );
        spotLight.target.updateMatrixWorld();
    }
};

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

let spotLight = new THREE.SpotLight(0xffffff, 0.8);
spotLight.position.set(0, 10, 0);
spotLight.target.position.set(0, 0, 0);
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
    scene.add(ghost3);
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
    BallObject = new Movable(ball, true, false);
});

var newPath_counter = 0;
loader.load("models/ghost_red.dae", function(collada) {
    collada.scene.position.x += 14;
    collada.scene.position.y += 0.75;
    collada.scene.position.z += -14;
    collada.scene.rotation.z = degToRad(180);
    ghost1 = collada.scene;
    GhostObject = new Movable(ghost1, false, true);
    GhostObject.path = maze_mat.graph.shortest_path(
        GhostObject.get_mazeCoord(maze_mat),
        BallObject.get_mazeCoord(maze_mat)
    );
});

loader.load("models/ghost_green.dae", function(collada) {
    collada.scene.position.x += 14;
    collada.scene.position.y += 0.75;
    collada.scene.position.z += 14;
    collada.scene.rotation.z = degToRad(180);
    ghost2 = collada.scene;
    GhostObject2 = new Movable(ghost2, false, true);
    GhostObject2.path = maze_mat.getRightPath();
});

loader.load("models/ghost_blue.dae", function(collada) {
    collada.scene.position.x += -14;
    collada.scene.position.y += 0.75;
    collada.scene.position.z += -14;
    collada.scene.rotation.z = degToRad(180);
    ghost3 = collada.scene;
    GhostObject3 = new Movable(ghost3, false, true);
    GhostObject3.path = maze_mat.getLeftPath();
});

loader.load("models/hammer.dae", function(collada) {
    collada.scene.position.x += -10;
    collada.scene.position.y += 1;
    collada.scene.position.z += -10;
    // collada.scene.rotation.z = degToRad(270);
    hammer = collada.scene;
    scene.add(collada.scene);
});

loader.load("models/wings.dae", function(collada) {
    collada.scene.position.x += -10;
    collada.scene.position.y += 1;
    collada.scene.position.z += 10;
    // collada.scene.rotation.z = degToRad(270);
    wings = collada.scene;
    scene.add(collada.scene);
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
        scene.add(collada.scene);
    });
}

function collectedObject() {
    loader.load("models/barrel.dae", function(collada) {
        collada.scene.position.x += 0;
        collada.scene.position.y += 1;
        collada.scene.position.z += 0;
        scene.add(collada.scene);
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
let isSpace = false;

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
        case " ":
            // space
            isSpace = true;
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
        case " ":
            // space
            isSpace = false;
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
function collisionCheckForMaze() {
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

function collisionCheckForTwoSpheres(obj1, obj2, r1, r2) {
    if (using_powerUp == "hammer") {
        return false;
    }
    // Sphere Coordinates
    if (sliderOptions.godMode) {
        return false;
    }
    let x1 = obj1.position.x;
    let y1 = obj1.position.y;
    let z1 = obj1.position.z;

    let x2 = obj2.position.x;
    let y2 = obj2.position.y;
    let z2 = obj2.position.z;

    if (
        x1 - r1 - r2 < x2 &&
        x2 <= x1 + r1 + r2 &&
        z1 - r1 - r2 <= z2 &&
        z2 <= z1 + r1 + r2
    ) {
        return true;
    } else {
        return false;
    }
}

function collisionCheckForBarrels() {
    // Sphere Coordinates
    let sx = ball.position.x;
    let sy = ball.position.y;
    let sz = ball.position.z;
    let radius = 0.5;

    for (let i = 0; i < barrels.length; i++) {
        //  console.log(i);

        let currentBarrel = barrels[i];
        // Cube Coordinates
        let cx = currentBarrel["position"]["x"];
        let cy = currentBarrel["position"]["y"];
        let cz = currentBarrel["position"]["z"];
        let barrelRadius = 0.35;
        if (
            cx - barrelRadius - radius < sx &&
            sx <= cx + barrelRadius + radius &&
            cz - barrelRadius - radius <= sz &&
            sz <= cz + barrelRadius + radius &&
            currentBarrel["visible"] === true
        ) {
            return i;
        }
    }

    return -23;
}

let using_powerUp = "";
let hammerDownSpeed = 10;

function collisionCheckForPowerUps() {
    // Sphere Coordinates
    let sx = ball.position.x;
    let sy = ball.position.y;
    let sz = ball.position.z;
    let radius = 0.5;

    let isWings = false;
    let isHammer = false;
    // wings Coordinates
    let cx = wings["position"]["x"];
    let cy = wings["position"]["y"];
    let cz = wings["position"]["z"];
    let wingsRadius = 0.2;
    if (
        cx - wingsRadius - radius < sx &&
        sx <= cx + wingsRadius + radius &&
        cz - wingsRadius - radius <= sz &&
        sz <= cz + wingsRadius + radius &&
        wings["visible"] === true
    ) {
        isWings = true;
    }

    // hammer Coordinates
    cx = hammer["position"]["x"];
    cy = hammer["position"]["y"];
    cz = hammer["position"]["z"];
    let hammerRadius = 0.2;
    if (
        cx - hammerRadius - radius < sx &&
        sx <= cx + hammerRadius + radius &&
        cz - hammerRadius - radius <= sz &&
        sz <= cz + hammerRadius + radius &&
        hammer["visible"] === true
    ) {
        isHammer = true;
    }
    if (isHammer) {
        if (using_powerUp == "wings") {
            return wings;
        } else {
            using_powerUp = "hammer";
            return hammer;
        }
    }
    if (isWings) {
        if (using_powerUp == "hammer") {
            return hammer;
        } else {
            using_powerUp = "wings";
            return wings;
        }
    }
    using_powerUp = "";
    return null;
}

function collisionCheckForHammer(ghst) {
    // Sphere Coordinates
    let sx = ghst.position.x;
    let sy = ghst.position.y;
    let sz = ghst.position.z;
    let radius = 0.75;

    // hammer Coordinates
    let cx = hammer["position"]["x"];
    let cy = hammer["position"]["y"];
    let cz = hammer["position"]["z"];
    let hammerRadius = 0.75;
    if (
        cx - hammerRadius - radius < sx &&
        sx <= cx + hammerRadius + radius &&
        cz - hammerRadius - radius <= sz &&
        sz <= cz + hammerRadius + radius &&
        ghst["visible"] === true
    ) {
        return true;
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

function makeToonShading() {
    let materialRedToonShading = new THREE.MeshToonMaterial({
        map: ballTexture,
        color: 0xaaaaaa,
    });

    // ONLY FOR PLANE
    let materialYellowToonShading = new THREE.MeshToonMaterial({
        map: groundTexture,
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
    });

    let materialBlueToonShading = new THREE.MeshToonMaterial({
        map: wallTexture,
        color: 0x999999,
    });

    let materialGreenToonShading = new THREE.MeshToonMaterial({
        map: oildrumTexture,
        color: 0xdddddd,
    });

    let materialPurpleToonShading = new THREE.MeshToonMaterial({
        map: ghostTexture1,
        color: 0xdddddd,
    });

    let materialWaterGreenToonShading = new THREE.MeshToonMaterial({
        map: ghostTexture2,
        color: 0xdddddd,
    });

    let materialPinkToonShading = new THREE.MeshToonMaterial({
        map: ghostTexture3,
        color: 0xdddddd,
    });
    BallObject.object["children"][0]["material"] = materialRedToonShading;
    GhostObject.object["children"][1]["material"] = materialPurpleToonShading;
    GhostObject2.object["children"][1][
        "material"
    ] = materialWaterGreenToonShading;
    GhostObject3.object["children"][1]["material"] = materialPinkToonShading;
    // Barrels Materials
    for (let i = 0; i < barrels.length; i++) {
        let currentBarrel = barrels[i];
        currentBarrel["children"][0]["material"] = materialGreenToonShading;
    }

    // Maze Materials
    for (let i = 0; i < 150; i++) {
        if (maze["children"][i]["name"].substr(0, 5) !== "Cube.") continue;

        let currentCube = maze["children"][i];
        currentCube["material"] = materialBlueToonShading;
    }

    // Plane Material
    plane["material"] = materialYellowToonShading;
}

function makePhongShading() {
    let materialRedPhongShading = new THREE.MeshPhongMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: ballTexture,
        color: 0xaaaaaa,
    });

    let materialYellowPhongShading = new THREE.MeshPhongMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: groundTexture,
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
    });

    let materialBluePhongShading = new THREE.MeshPhongMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: wallTexture,
        color: 0x999999,
    });

    let materialGreenPhongShading = new THREE.MeshPhongMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: oildrumTexture,
        color: 0xdddddd,
    });

    let materialPurplePhongShading = new THREE.MeshPhongMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: ghostTexture1,
        color: 0xdddddd,
    });

    let materialWaterGreenPhongShading = new THREE.MeshPhongMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: ghostTexture2,
        color: 0xdddddd,
    });

    let materialPinkPhongShading = new THREE.MeshPhongMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: ghostTexture3,
        color: 0xdddddd,
    });

    BallObject.object["children"][0]["material"] = materialRedPhongShading;
    GhostObject.object["children"][1]["material"] = materialPurplePhongShading;
    GhostObject2.object["children"][1][
        "material"
    ] = materialWaterGreenPhongShading;
    GhostObject3.object["children"][1]["material"] = materialPinkPhongShading;
    // Barrels Materials
    for (let i = 0; i < barrels.length; i++) {
        let currentBarrel = barrels[i];
        currentBarrel["children"][0]["material"] = materialGreenPhongShading;
    }

    // Maze Materials
    for (let i = 0; i < 150; i++) {
        if (maze["children"][i]["name"].substr(0, 5) !== "Cube.") continue;

        let currentCube = maze["children"][i];
        currentCube["material"] = materialBluePhongShading;
    }

    // Plane Material
    plane["material"] = materialYellowPhongShading;
}

function makeLambertShading() {
    let materialRedLambertShading = new THREE.MeshLambertMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: ballTexture,
        color: 0xaaaaaa,
    });

    let materialYellowLambertShading = new THREE.MeshLambertMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: groundTexture,
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
    });

    let materialBlueLambertShading = new THREE.MeshLambertMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: wallTexture,
        color: 0x999999,
    });

    let materialGreenLambertShading = new THREE.MeshLambertMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: oildrumTexture,
        color: 0xffffff,
    });

    let materialPurpleLambertShading = new THREE.MeshLambertMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: ghostTexture1,
        color: 0xdddddd,
    });

    let materialWaterGreenLambertShading = new THREE.MeshLambertMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: ghostTexture2,
        color: 0xdddddd,
    });

    let materialPinkLambertShading = new THREE.MeshPhongMaterial({
        ambient: 0x050505,
        specular: 0x555555,
        shininess: 30,
        map: ghostTexture3,
        color: 0xdddddd,
    });

    BallObject.object["children"][0]["material"] = materialRedLambertShading;
    GhostObject.object["children"][1]["material"] = materialPurpleLambertShading;
    GhostObject2.object["children"][1][
        "material"
    ] = materialWaterGreenLambertShading;
    GhostObject3.object["children"][1]["material"] = materialPinkLambertShading;

    // Barrels Materials
    for (let i = 0; i < barrels.length; i++) {
        let currentBarrel = barrels[i];
        currentBarrel["children"][0]["material"] = materialGreenLambertShading;
    }

    // Maze Materials
    for (let i = 0; i < 150; i++) {
        if (maze["children"][i]["name"].substr(0, 5) !== "Cube.") continue;

        let currentCube = maze["children"][i];
        currentCube["material"] = materialBlueLambertShading;
    }

    // Plane Material
    plane["material"] = materialYellowLambertShading;
}

const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("sounds/main-theme.mp3", function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
});

let oneTimes = 1;
let isFocus = 0;
let isCollision = 0;
let ghostRunningtarget = "0:14";

function objectTranslation(obj, angleFix, positionFixY, positionFixZ) {
    obj.scale.set(0.75, 0.75, 0.75);
    obj.position.set(
        ball.position.x,
        ball.position.y + positionFixY,
        ball.position.z
    );
    obj.rotation.x = -Math.PI / 2;
    // obj.rotation.y = 0;
    obj.rotation.z = -degToRad(rotation_angleX) + degToRad(angleFix);
    //console.log(obj)
}

function objectRotation(obj) {
    obj.rotation.x += sliderOptions.rotationObjX;
    obj.rotation.y += sliderOptions.rotationObjY;
    obj.rotation.z += sliderOptions.rotationObjZ;
    //console.log(obj)
}

var GameLoop = function() {
    requestAnimationFrame(GameLoop);

    if (BallObject && GhostObject && GhostObject2 && GhostObject3 && oneTimes) {
        makePhongShading();
        collectedObject();
        oneTimes = 0;
    }
    // random barrel movements
    for (let b = 0; b < barrels.length; b++) {
        barrels[b].position.y =
            Math.abs(Math.sin(degToRad(barrel_updownTheta[b]))) / 10 + 0.5;
        barrels[b].rotation.x = barrel_rotationTheta[b];
        barrels[b].rotation.y = barrel_rotationTheta[b];
        barrels[b].rotation.z = barrel_rotationTheta[b];

        barrel_updownTheta[b] = (barrel_updownTheta[b] + 5) % 360;
        barrel_rotationTheta[b] = (barrel_rotationTheta[b] + 0.01) % 360;
    }

    //request pointer lock when game start, exit pointer lock when game paused
    if (changed) {
        if (gameCondition === 2) {
            canvas.requestPointerLock();
        } else {
            document.exitPointerLock();
        }
        setChanged(0);
    }

    useSliders();
    if (ball && wings && hammer) {
        let powerObject = collisionCheckForPowerUps();
        //console.log(using_powerUp);
        if (using_powerUp !== "") {
            setCanFocus(1);
            if (focus) {
                if (!isFocus) {
                    //camera.position.set(ball.position.x, ball.position.y+3, ball.position.z-2);
                    powerObject.position.y += 2;
                    camera.lookAt(powerObject.position);
                }
                isFocus = 1;
                isCollision = 1;
                objectRotation(powerObject);
            } else {
                if (isFocus) {
                    setCanFocus(0);
                    isFocus = 0;
                    powerObject.rotation.y = 0;
                }
                if (isCollision) {
                    if (using_powerUp === "wings") {
                        objectTranslation(powerObject, 90, 0);
                    }
                    if (using_powerUp === "hammer") {
                        objectTranslation(powerObject, 0, 1);
                    }
                    if (isSpace) {
                        if (using_powerUp === "hammer") {
                            hammerDown = true;
                        } else if (using_powerUp === "wings") {
                            speed = 0.2;
                        }
                    }

                    if (hammerDown) {
                        if (hammer.rotation.y >= degToRad(90)) {
                            hammerDownSpeed = -hammerDownSpeed;
                        }
                        if (hammer.rotation.y < degToRad(0)) {
                            console.log(hammer.rotation.y);

                            hammer.rotation.y = Math.round(degToRad(0) * 100) / 100;
                            hammerDownSpeed = -hammerDownSpeed;
                            console.log(hammer.rotation.y);
                            hammerDown = false;
                        }
                        hammer.rotation.y += degToRad(hammerDownSpeed);
                        hammer.rotation.y = Math.round(hammer.rotation.y * 100) / 100;
                        if (collisionCheckForHammer(ghost1)) {
                            ghost1["visible"] = false;
                        }
                        if (collisionCheckForHammer(ghost2)) {
                            ghost2["visible"] = false;
                        }
                        if (collisionCheckForHammer(ghost3)) {
                            ghost3["visible"] = false;
                        }
                    }
                }
            }
        }
    }
    if (gameCondition === 2 && ball && !focus) {
        if (collisionCheckForMaze() === false) {
            if (isPressW) {
                moveForward();
                if (collisionCheckForMaze() === true) moveBackward();
                // ball.position.x += speed * Math.cos(degToRad(rotation_angleX));
                // ball.position.z += speed * Math.sin(degToRad(rotation_angleX));

                // angleX += angleIncrement;
                // ball.rotation.y = angleX * (Math.PI / 180);
            }
            if (isPressS) {
                moveBackward();
                if (collisionCheckForMaze() === true) moveForward();
                // ball.position.x -= speed * Math.cos(degToRad(rotation_angleX));
                // ball.position.z -= speed * Math.sin(degToRad(rotation_angleX));

                // angleX -= angleIncrement;
                // ball.rotation.y = angleX * (Math.PI / 180);
            }
            if (isPressA) {
                moveLeft();
                if (collisionCheckForMaze() === true) moveRight();
                // ball.position.x += speed * Math.sin(degToRad(rotation_angleX));
                // ball.position.z -= speed * Math.cos(degToRad(rotation_angleX));

                // angleY -= angleIncrement;
                // ball.rotation.x = angleY * (Math.PI / 180);
            }
            if (isPressD) {
                moveRight();
                if (collisionCheckForMaze() === true) moveLeft();

                // ball.position.x -= speed * Math.sin(degToRad(rotation_angleX));
                // ball.position.z += speed * Math.cos(degToRad(rotation_angleX));

                // angleY += angleIncrement;
                // ball.rotation.x = angleY * (Math.PI / 180);
            }
        }

        if (!focus) {
            if (
                (newPath_counter >= 100 && !GhostObject.isCommand_continue) ||
                GhostObject.path.length == 0
            ) {
                // console.log("new path calculating");
                let current_command = GhostObject.path[0];
                if (using_powerUp == "hammer") {
                    if (GhostObject.path.length == 0) {
                        ghostRunningtarget = maze_mat.getRandomCorner_except(
                            ghostRunningtarget
                        );
                    }
                    GhostObject.path = maze_mat.graph.shortest_path(
                        GhostObject.get_mazeCoord(maze_mat),
                        ghostRunningtarget
                    );
                    newPath_counter = 0;
                } else {
                    console.log(GhostObject.get_mazeCoord(maze_mat));
                    GhostObject.path = maze_mat.graph.shortest_path(
                        GhostObject.get_mazeCoord(maze_mat),
                        BallObject.get_mazeCoord(maze_mat)
                    );
                    newPath_counter = 0;
                }

                // if (current_command != undefined) {
                //     GhostObject.path.unshift(current_command);
                // }
            } else {
                newPath_counter++;
            }
            GhostObject.execute_thePath();
            GhostObject2.execute_thePath();
            GhostObject3.execute_thePath();
            if (GhostObject2.path.length == 0) {
                GhostObject2.path = maze_mat.getRightPath();
            }
            if (GhostObject3.path.length == 0) {
                GhostObject3.path = maze_mat.getLeftPath();
            }
            let barrelsCollisionCheckResult = collisionCheckForBarrels();
            if (
                collisionCheckForTwoSpheres(
                    BallObject.object,
                    GhostObject.object,
                    0.5,
                    0.75
                ) == true
            ) {
                console.log("ghost1 collision!");
                gameOver();
            } else if (
                collisionCheckForTwoSpheres(
                    BallObject.object,
                    GhostObject2.object,
                    0.5,
                    0.75
                ) == true
            ) {
                console.log("ghost2 collision!");
                gameOver();
            } else if (
                collisionCheckForTwoSpheres(
                    BallObject.object,
                    GhostObject3.object,
                    0.5,
                    0.75
                ) == true
            ) {
                console.log("ghost3 collision!");
                gameOver();
            } else if (barrelsCollisionCheckResult != -23) {
                barrels[barrelsCollisionCheckResult]["visible"] = false;
                score++;
            }

            BallObject.action();
            BallObject.resetMotion();
            GhostObject.action();
            GhostObject.resetMotion();
            GhostObject2.action();
            GhostObject2.resetMotion();
            GhostObject3.action();
            GhostObject3.resetMotion();

            if (gameCondition !== 4 && gameCondition !== 5) {
                document.getElementById("scoreboard").textContent = "Score: " + score;
            }
        }

        if (!sliderOptions.changeFreely && !focus) {
            camera.position.x =
                ball.position.x - current_radius * Math.cos(degToRad(rotation_angleX));
            camera.position.z =
                ball.position.z - current_radius * Math.sin(degToRad(rotation_angleX));
            camera.position.y =
                ball.position.y + current_radius * Math.sin(degToRad(rotation_angleY));
            camera.lookAt(ball.position.x, ball.position.y, ball.position.z);

            if (sliderOptions.spotLightFromAbove) {
                spotLight.position.set(
                    ball.position.x,
                    ball.position.y + 10,
                    ball.position.z
                );
                spotLight.target.position.set(
                    ball.position.x,
                    ball.position.y,
                    ball.position.z
                );
                spotLight.distance = 50;
            } else {
                spotLight.position.set(
                    ball.position.x,
                    ball.position.y,
                    ball.position.z
                );
                spotLight.target.position.x =
                    ball.position.x + (ball.position.x - camera.position.x);
                spotLight.target.position.y = ball.position.y - 0.1;
                spotLight.target.position.z =
                    ball.position.z + (ball.position.z - camera.position.z);
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