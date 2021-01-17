class Movable {
    constructor(object, rotateWhile_move, flying) {
        this.object = object;
        this.speed = { x: 0, y: 0, z: 0 };
        this.angle = { x: object.position.x, y: object.position.y, z: object.position.z };
        this.old_position = {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
        };
        this.auto_speed = 0.1;
        this.isCommand_continue = false;
        this.path = [];
        this.rotateWhile_move = rotateWhile_move;
        this.prev_command = "back";
        this.flying = flying;
        this.fly_theta = 0;
    }

    action() {
        // translation
        this.object.position.x += this.speed.x;
        this.object.position.z += this.speed.z;
        if (this.flying) {
            this.object.position.y = Math.abs(Math.sin(degToRad(this.fly_theta)))/5+1;
            this.fly_theta = (this.fly_theta + 5)%360
        }

        this.object.position.x = Math.round(this.object.position.x * 100) / 100;
        this.object.position.z = Math.round(this.object.position.z * 100) / 100;

        // rotation
        if (this.rotateWhile_move) {
            this.object.rotation.z = 2 * this.angle.z * (Math.PI / 180);
            this.object.rotation.x = this.angle.x * (Math.PI / 180);                
        }
    }

    oneStepForward() {
        if (
            this.old_position.x + 2 ==
            Math.round(this.object.position.x * 100) / 100
        ) {
            this.old_position.x = this.object.position.x;
            // motion is end
            return false;
        } else {
            this.speedUp(this.auto_speed, 0, 0);
            this.rotation(0, 0, -10);
            return true;
        }
    }

    oneStepBackward() {
        if (
            this.old_position.x - 2 ==
            Math.round(this.object.position.x * 100) / 100
        ) {
            this.old_position.x = this.object.position.x;
            // motion is end
            return false;
        } else {
            this.speedUp(-this.auto_speed, 0, 0);
            this.rotation(0, 0, 10);
            return true;
        }
    }

    oneStepRight() {
        if (
            this.old_position.z + 2 ==
            Math.round(this.object.position.z * 100) / 100
        ) {
            this.old_position.z = this.object.position.z;
            // motion is end
            return false;
        } else {
            this.speedUp(0, 0, this.auto_speed);
            this.rotation(10, 0, 0);
            return true;
        }
    }

    oneStepLeft() {
        if (
            this.old_position.z - 2 ==
            Math.round(this.object.position.z * 100) / 100
        ) {
            this.old_position.z = this.object.position.z;
            // motion is end
            return false;
        } else {
            this.speedUp(0, 0, -this.auto_speed);
            this.rotation(-10, 0, 0);
            return true;
        }
    }

    execute_thePath() {
        if (this.path == undefined || this.path == null) {
            return;
        }
        let command = this.path[0];
        if (command != this.prev_command) {
            this.turn_around(command);
        }
        if (command == "forward") {
            this.isCommand_continue = this.oneStepForward();
        } else if (command == "back") {
            this.isCommand_continue = this.oneStepBackward();
        } else if (command == "left") {
            this.isCommand_continue = this.oneStepLeft();
        } else if (command == "right") {
            this.isCommand_continue = this.oneStepRight();
        }
        if (!this.isCommand_continue && this.path.length != 0) {
            this.prev_command = this.path.shift();
        }
    }

    speedUp(x, y, z) {
        this.speed.x += x;
        this.speed.y += y;
        this.speed.z += z;
        this.speed.x = Math.round(this.speed.x * 100) / 100;
        this.speed.y = Math.round(this.speed.y * 100) / 100;
        this.speed.z = Math.round(this.speed.z * 100) / 100;
    }

    rotation(x, y, z) {
        if (!this.rotateWhile_move) {
            return;
        }
        this.angle.x += x;
        this.angle.y += y;
        this.angle.z += z;

        this.object.rotation.x = y * (Math.PI / 180);
        this.object.rotation.y = x * (Math.PI / 180);
    }

    resetMotion() {
        this.speed = { x: 0, y: 0, z: 0 };
    }

    get_worldCoord() {
        return this.object.position;
    }

    get_mazeCoord(maze) {
        let loc = maze.localizer(this.object.position.x, this.object.position.z);
        return (loc.x - 1).toString() + ":" + (loc.z - 1).toString();
    }

    getAngle() {
        var angle = Math.round(
            radToDeg(Math.atan2(this.object.rotation.x, this.object.rotation.z))
        );
        if (angle < 0) {
            angle = angle + 360;
        }
        if (angle == -0) {
            angle = 0;
        }
    
        return angle;
    }

    turn_around(direction){
        if (direction == "forward") {
            this.object.rotation.z = degToRad(0);
        }
        else if (direction == "back") {
            this.object.rotation.z = degToRad(180);
        }
        else if (direction == "left") {
            this.object.rotation.z = degToRad(90);
        }
        else if (direction == "right") {
            this.object.rotation.z = degToRad(270);
        }

    }
}