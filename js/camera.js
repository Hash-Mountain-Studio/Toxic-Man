let degToRad = function (degree) {
    return (degree * Math.PI) / 180;
};

let radToDeg = function (radian) {
    return (radian * 180) / Math.PI;
};

let rotateLeft = false;
let rotateRight = false;
let init_angle = 90;
let rotation_angleX = 0;
let rotation_angleY = 0;

let camRotate_speed = 10;
let camTheta = 135;

function rotateCam_inCorner(corner, ball, camera, isPress_d, isPress_a) {
    // update the camera-right vector
    var angle = getCamAngle(camera);
    if (rotateLeft) {
        rotateLeft = rotateCam_aroundPoint(ball, "left", 3.6, camera);
    } else if (rotateRight) {
        rotateRight = rotateCam_aroundPoint(ball, "right", 3.6, camera);
    } else {
        // if camera looks along +x axis
        if (angle <= 95 && angle >= 85) {
            if (corner == "upper left" && isPress_d) {
                console.log("rotate camera to left");
                rotateLeft = true;
                init_angle = angle;
                rotateRight = false;
            } else if (corner == "upper right" && isPress_a) {
                console.log("rotate camera to right");
                rotateRight = true;
                init_angle = angle;
                rotateLeft = false;
            }
        }
        // if camera looks along +z axis
        else if (angle <= 5 || angle >= 355) {
            if (corner == "upper right" && isPress_d) {
                console.log("rotate camera to left");
                rotateLeft = true;
                init_angle = angle;
                rotateRight = false;
            } else if (corner == "bottom right" && isPress_a) {
                console.log("rotate camera to right");
                rotateRight = true;
                init_angle = angle;
                rotateLeft = false;
            }
        }
        // if camera looks along -x axis
        else if (angle <= 275 && angle >= 265) {
            if (corner == "bottom right" && isPress_d) {
                console.log("rotate camera to left");
                rotateLeft = true;
                init_angle = angle;
                rotateRight = false;
            } else if (corner == "bottom left" && isPress_a) {
                console.log("rotate camera to right");
                rotateRight = true;
                init_angle = angle;
                rotateLeft = false;
            }
        }
        // if camera looks along -z axis
        else if (angle <= 185 && angle >= 175) {
            if (corner == "upper left" && isPress_a) {
                console.log("rotate camera to right");
                rotateRight = true;
                init_angle = angle;
                rotateLeft = false;
            } else if (corner == "bottom left" && isPress_d) {
                console.log("rotate camera to left");
                rotateLeft = true;
                init_angle = angle;
                rotateRight = false;
            }
        }
    }
}

function rotateCam_aroundPoint(point, direction, radius, camera) {
    camera.position.set(
        radius * (Math.cos(degToRad(camTheta)) - Math.sin(degToRad(camTheta))) +
            point.x,
        camera.position.y,
        radius * (Math.sin(degToRad(camTheta)) + Math.cos(degToRad(camTheta))) +
            point.z
    );
    camera.lookAt(point.x, point.y, point.z);

    var new_angle = getCamAngle(camera);

    if (direction == "left") {
        if (init_angle == 0 && new_angle == 270) {
            rotation_angleX = (rotation_angleX + 90) % 360;
            return false;
        } else if (new_angle != (init_angle - 90) % 360) {
            camTheta += camRotate_speed;
            return true;
        } else {
            rotation_angleX = (rotation_angleX + 90) % 360;
            return false;
        }
    } else if (direction == "right") {
        if (new_angle != (init_angle + 90) % 360) {
            camTheta -= camRotate_speed;
            return true;
        } else {
            rotation_angleX = (rotation_angleX - 90) % 360;
            return false;
        }
    }
}

function getCamAngle(camera) {
    var cam_vectors = new THREE.Vector3();
    camera.getWorldDirection(cam_vectors);

    var cam_angle = Math.round(
        radToDeg(Math.atan2(cam_vectors.x, cam_vectors.z))
    );
    if (cam_angle < 0) {
        cam_angle = cam_angle + 360;
    }
    if (cam_angle == -0) {
        cam_angle = 0;
    }

    return cam_angle;
}
