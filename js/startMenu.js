let radius = 25;
let theta = 20;
let phi = 0;
let thetaSpeed = 0.1;
let phiSpeed = 0.3;

let thetaDistance;
let phiDistance;
let radiusDistance;

let isStarted = 0;

let radToDeg = function (radian) {
    return (radian * 180) / Math.PI;
};

let degToRad = function (degree) {
    return (degree * Math.PI) / 180;
};

function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.parentNode.remove();
}

document.getElementById("playButton").onclick = function () {
    isStarted = 1;
    removeElement("playButton");
};

let startPosition = function (value, distance, startValue, range) {
    if (value > startValue + range) {
        value -= distance / 500;
    } else if (value < startValue - range) {
        value -= distance / 500;
    } else {
        value = startValue;
    }
    return value;
};

var updateCameraInStart = function (camera, ball) {
    if (isStarted === 0) {
        thetaDistance = theta - 45;
        phiDistance = phi - 90;
        radiusDistance = radius - 5;
        updateCameraBeforeStart(camera, ball);
    }
    if (isStarted === 1) {
        updateCameraAfterStart(camera, ball);
    }
};

var updateCameraBeforeStart = function (camera, ball) {
    if (theta >= 170 || theta <= 10) {
        thetaSpeed = -thetaSpeed;
    }
    phi = (phi + phiSpeed) % 360;
    //console.log(theta, phi);
    camera.position.set(
        -radius * Math.cos(degToRad(theta)),
        radius * Math.sin(degToRad(theta)),
        radius * Math.cos(degToRad(phi))
    );
    if (ball) {
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
    }

    theta += thetaSpeed;
};
    
var updateCameraAfterStart = function (camera, ball) {
    theta = startPosition(theta, thetaDistance, 45, 0.2);
    phi = startPosition(phi, phiDistance, 90, 0.5);
    radius = startPosition(radius, radiusDistance, 5, 0.2);
    if (theta === 45 && phi === 90 && radius === 5) {
        isStarted = 2;
    }
    //console.log(camera.position)
    //console.log(theta, phi, radius);
    camera.position.set(
        -radius * Math.cos(degToRad(theta)),
        radius * Math.sin(degToRad(theta)),
        radius * Math.cos(degToRad(phi))
    );
    if (ball) {
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
    }
};

var followCaracter = function (camera, ball) {};

export { isStarted, radius, updateCameraInStart, degToRad };
