class Movable {
    constructor(object) {
        this.object = object;
        this.speed = { x: 0, y: 0, z: 0 };
        this.angle = { x: 0, y: 0, z: 0 };
        this.old_position = {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
        };
        this.auto_speed = 0.2;
        this.isCommand_continue = false;
        this.path;
    }

    action() {
        // translation
        this.object.position.x += this.speed.x;
        this.object.position.z += this.speed.z;

        this.object.position.x = Math.round(this.object.position.x * 100) / 100;
        this.object.position.z = Math.round(this.object.position.z * 100) / 100;

        // rotation
        this.object.rotation.z = 2 * this.angle.z * (Math.PI / 180);
        this.object.rotation.x = this.angle.x * (Math.PI / 180);
    }

    /*
          this function first moves along x-axis (columns in maze matrix)
          then moves along z-axis (rows in maze matrix)
          */
    moveTo(maze, dest_col, dest_row) {
        console.log(this.get_mazeCoord(maze));
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
            this.path.shift();
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
}