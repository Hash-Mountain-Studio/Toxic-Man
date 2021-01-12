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
        this.graph = new Graph((this.maze_matrix.length-1)*(this.maze_matrix.length-1));
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

    print_mazeMat() {
        var lines = [];
        this.maze_matrix.forEach((row) => {
            lines.push(row.join(" "));
        });
        console.log(lines.join("\n"));
    }
}
