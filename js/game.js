import { ColladaLoader } from "../dependencies/ColladaLoader.js";

var scene = new THREE.Scene();
let elf;
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
const plane = new THREE.Mesh(geometry, material);
plane.rotateX(-Math.PI / 2);

scene.add(plane);

// COLLADA BEGINS
const loadingManager = new THREE.LoadingManager(function() {
    scene.add(elf);
});

camera.position.x = 12;
camera.position.y = 14;
camera.position.z = -33;

let controls = new THREE.OrbitControls(camera, renderer.domElement);

// collada
let shape;
const loader = new ColladaLoader(loadingManager);
loader.load("../models/Globe.dae", function(collada) {
    collada.scene.position.y += 10;
    elf = collada.scene;
});

const light = new THREE.AmbientLight(0x404040, 5); // soft white light
scene.add(light);

// COLLADA END

// Game Logic
var update = function() {
    //cube.rotation.x += 0.01;
    // cube.rotation.y += 0.005;
};

//  Draw the scene
var render = function() {
    renderer.render(scene, camera);
};

// Run game loop(update, render, repeat)
var GameLoop = function() {
    requestAnimationFrame(GameLoop);
    document.onkeypress = function(e) {
        e = e || window.event;
        switch (e.key) {
            // Press 1
            case "w":
                elf.position.x += 5;
                break;
            case "s":
                elf.position.x -= 5;
                break;
            case "a":
                elf.position.z -= 5;
                break;
            case "d":
                elf.position.z += 5;
                break;
        }
    };
    update();
    render();
    /*console.log(
                                                            "x: ",
                                                            camera.position.x,
                                                            "\ny: ",
                                                            camera.position.y,
                                                            "\nz: ",
                                                            camera.position.z,
                                                            "\n"
                                                        );
                                                        */
};

GameLoop();