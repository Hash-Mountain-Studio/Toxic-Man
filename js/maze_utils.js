class Maze {
    constructor() {
        this.maze_matrix = [
            [
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
            ],
            [
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                "#",
                "#",
                "#",
                "#",
                "#",
                ".",
                "#",
                ".",
                "#",
                "#",
                "#",
                "#",
                "#",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                ".",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                "#",
                "#",
                ".",
                "#",
                ".",
                ".",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                ".",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                "#",
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
                ".",
                ".",
                ".",
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
            ],
            [
                "#",
                "#",
                "#",
                "#",
                "#",
                ".",
                "#",
                "#",
                ".",
                "#",
                "#",
                ".",
                "#",
                "#",
                "#",
                "#",
                "#",
            ],
            [
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
                ".",
                ".",
                ".",
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                "#",
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                ".",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                ".",
                ".",
                "#",
                ".",
                "#",
                ".",
                "#",
                "#",
                "#",
                ".",
                "#",
                ".",
                ".",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                "#",
                "#",
                "#",
                "#",
                "#",
                ".",
                "#",
                ".",
                "#",
                "#",
                "#",
                "#",
                "#",
                ".",
                "#",
            ],
            [
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                ".",
                "#",
            ],
            [
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
                "#",
            ],
        ];
        /*
        141 + 148 = 289
        */
        this.old_symbol = ".";
        this.mazeLoc = { x: 0, z: 0 };
        this.graph = new Graph();
        this.graph.fillGraph(this.maze_matrix);
    }

    // returns the x-maze and z-maze coordinates of given object
    localizer(x, z) {
        let rounded_x = -1 * Math.round(x / 2);
        let rounded_z = Math.round(z / 2);
        let in_matrix_x = 1 + rounded_x + 7;
        let in_matrix_z = 1 + rounded_z + 7;

        // index limits
        in_matrix_x = Math.min(in_matrix_x, this.maze_matrix.length - 2);
        in_matrix_z = Math.min(in_matrix_z, this.maze_matrix.length - 2);
        in_matrix_x = Math.max(in_matrix_x, 1);
        in_matrix_z = Math.max(in_matrix_z, 1);
        return { x: in_matrix_x, z: in_matrix_z };
    }

    mazeLoc2worldLoc(mazeloc){
        let maze_x = mazeloc.split(":")[0];
        let maze_z = mazeloc.split(":")[1];
        let world_x = (7-maze_x)*2;
        let world_z = (maze_z-7)*2;
        return {x:world_x, z:world_z};
    }

    // calculate the new position in the maze
    // if it is changed then update the this.maze_matrix
    refresh_mazeMat(x, z) {
        var new_mazeLoc = this.localizer(x, z);
        if (
            this.mazeLoc.x != new_mazeLoc.x ||
            this.mazeLoc.z != new_mazeLoc.z
        ) {
            this.maze_matrix[this.mazeLoc.x][this.mazeLoc.z] = this.old_symbol;
            this.old_symbol = this.maze_matrix[new_mazeLoc.x][new_mazeLoc.z];
            this.maze_matrix[new_mazeLoc.x][new_mazeLoc.z] = "O";
            this.mazeLoc.x = new_mazeLoc.x;
            this.mazeLoc.z = new_mazeLoc.z;
            console.clear();
            this.print_mazeMat();
            console.log(new_mazeLoc.x, new_mazeLoc.z);
        }
    }

    corner_check(x, z) {
        let loc = this.localizer(x, z);

        if (this.maze_matrix[loc.x - 1][loc.z] == "#") {
            // upper
            if (this.maze_matrix[loc.x][loc.z - 1] == "#") {
                // left
                return "upper left";
            } else if (this.maze_matrix[loc.x][loc.z + 1] == "#") {
                // right
                return "upper right";
            }
        } else if (this.maze_matrix[loc.x + 1][loc.z] == "#") {
            // bottom
            if (this.maze_matrix[loc.x][loc.z - 1] == "#") {
                // left
                return "bottom left";
            } else if (this.maze_matrix[loc.x][loc.z + 1] == "#") {
                // right
                return "bottom right";
            }
        }
    }

    getRightPath(){
        return ["left",
        "left",
        "left",
        "left",
        "left",
        "left",
        "back",
        "back",
        "right",
        "right",
        "back",
        "back",
        "back",
        "back",
        "back",
        "back",
        "right",
        "right",
        "right",
        "right",
        "back",
        "back",
        "back",
        "left",
        "left",
        "back",
        "left",
        "left",
        "left",
        "left",
        "back",
        "back",
        "right",
        "right",
        "right",
        "right",
        "right",
        "right",
        "forward",
        "forward",
        "forward",
        "left",
        "left",
        "forward",
        "forward",
        "forward",
        "left",
        "left",
        "forward",
        "forward",
        "right",
        "right",
        "forward",
        "forward",
        "forward",
        "forward",
        "left",
        "left",
        "left",
        "left",
        "forward",
        "forward",
        "right",
        "right",
        "right",
        "right",
        "right",
        "right"
    ];
    }

    getLeftPath(){
        return [
            "forward",
            "forward",
            "forward",
            "forward",
            "forward",
            "forward",
            "right",
            "right",
            "back",
            "back",
            "back",
            "back",
            "right",
            "right",
            "forward",
            "forward",
            "forward",
            "forward",
            "forward",
            "forward",
            "left",
            "left",
            "left",
            "left",
            "forward",
            "forward",
            "forward",
            "right",
            "right",
            "forward",
            "right",
            "right",
            "right",
            "right",
            "forward",
            "forward",
            "left",
            "left",
            "left",
            "left",
            "left",
            "left",
            "back",
            "back",
            "back",
            "right",
            "right",
            "back",
            "back",
            "back",
            "right",
            "right",
            "back",
            "back",
            "left",
            "left",
            "back",
            "back",
            "back",
            "back",
            "right",
            "right",
            "right",
            "right",
            "back",
            "back",
            "left",
            "left",
            "left",
            "left",
            "left",
            "left"];

    }

    getRandomCorner_except(exception){
        let corners = ["0:0", "0:14", "14:14", "14:0"];
        let excp = exception;
        while(excp == exception){
            let rand = Math.floor(Math.random() * 10)%4;
            excp = corners[rand];
        }
        return excp;
    }

    print_mazeMat() {
        var lines = [];
        this.maze_matrix.forEach((row) => {
            lines.push(row.join(" "));
        });
        console.log(lines.join("\n"));
    }
}
