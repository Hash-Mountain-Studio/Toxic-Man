class Graph {
    constructor(){
        this.vertex_num = 0;
        this.adjList = new Map();
        this.distTo;
        this.edgeTo;
    }

    addVertex(vertex_id){
        this.adjList.set(vertex_id, []);
        this.vertex_num++;
    }

    addEdge(vertex_id, adj_vertex){
        // if two vertices not linked already
        if (!this.adjList.get(vertex_id).includes(adj_vertex)) {
            this.adjList.get(vertex_id).push(adj_vertex);
            this.adjList.get(adj_vertex).push(vertex_id);
        }
    }

    fillGraph(mazeMat){
        // first add vertices
        for (let i = 1; i < mazeMat.length-1; i++) {
            for (let j = 1; j < mazeMat[i].length-1; j++) {
                // if it is a wall
                if (mazeMat[i][j] == "#") {
                    continue;
                }
                let vertex_id = (i-1).toString()+":"+(j-1).toString();
                this.addVertex(vertex_id);
            }
        }

        // then add the edges
        for (let i = 1; i < mazeMat.length-1; i++) {
            for (let j = 1; j < mazeMat[i].length-1; j++) {
                // if it is a wall
                if (mazeMat[i][j] == "#") {
                    continue;
                }
                let vertex_id = (i-1).toString()+":"+(j-1).toString();

                //up
                if (mazeMat[i-1][j] == ".") {
                    this.addEdge(vertex_id, (i-2).toString()+":"+(j-1).toString());
                }

                // bottom
                if (mazeMat[i+1][j] == ".") {
                    this.addEdge(vertex_id, (i).toString()+":"+(j-1).toString());
                }

                // left
                if (mazeMat[i][j-1] == ".") {
                    this.addEdge(vertex_id, (i-1).toString()+":"+(j-2).toString());
                }

                // right
                if (mazeMat[i][j+1] == ".") {
                    this.addEdge(vertex_id, (i-1).toString()+":"+(j).toString());
                }
            }
        }
    }


    dijkstra_sp(start_id){
        var keys = this.adjList.keys();

        this.distTo = new Map();
        this.edgeTo = new Map();
        let pq = new PriorityQueue()

        this.distTo.set(start_id, 0);
        pq.enqueue(start_id, 0);

        // fill the distances with infinity
        for (var key of keys) {
            if (key != start_id) {
                this.distTo.set(key, Infinity);
            }
            this.edgeTo.set(key, null);
        }

        while (!pq.isEmpty()) {
            let minVertex = pq.dequeue();
            let current_vertex = minVertex.element;
            let distance = minVertex.priority;

            this.adjList.get(current_vertex).forEach(adj => {
                let alt = this.distTo.get(current_vertex) + 1;
                if (alt < this.distTo.get(adj)) {
                    this.distTo.set(adj, alt);
                    this.edgeTo.set(adj, current_vertex);
                    pq.enqueue(adj, alt);
                }
            });
        }
    }


    shortest_path(start, dest){
        this.dijkstra_sp(start);
        var to_node = dest;
        var path = [];
        console.log(dest);
        while (to_node != start) {
            let from_node = this.edgeTo.get(to_node);

            if (parseInt(from_node.split(":")[0]) < parseInt(to_node.split(":")[0])) {
                path.push("back");
            }
            else if (parseInt(from_node.split(":")[0]) > parseInt(to_node.split(":")[0])) {
                path.push("forward");
            }
            else if (parseInt(from_node.split(":")[1]) < parseInt(to_node.split(":")[1])) {
                path.push("right");
            }
            else if (parseInt(from_node.split(":")[1]) > parseInt(to_node.split(":")[1])) {
                path.push("left");
            }
            to_node = from_node;
        }
        return path.reverse();
    }

    getRandomNode(){
        let keys = Array.from(this.adjList.keys());
        return keys[Math.floor(Math.random() * keys.length)];
    }

    getVertices(){
        return this.adjList.keys();
    }

    getVertexNum(){
        return this.vertex_num;
    }


    printGraph(){
        // get all the vertices
        var get_keys = this.adjList.keys();
     
        // iterate over the vertices
        for (var i of get_keys) {
            var get_values = this.adjList.get(i);
            var conc = "";
     
            for (var j of get_values){
                conc += j + " ";
            }
     
            // print the vertex and its adjacency list
            console.log(i + " -> " + conc);
        }
    }



}

class QElement { 
    constructor(element, priority) 
    { 
        this.element = element; 
        this.priority = priority; 
    } 
} 
  
// PriorityQueue class 
class PriorityQueue { 
  
    // An array is used to implement priority 
    constructor() 
    { 
        this.items = []; 
    } 
  

    enqueue(element, priority) { 
        // creating object from queue element 
        var qElement = new QElement(element, priority); 
        var contain = false; 
    
        for (var i = 0; i < this.items.length; i++) { 
            if (this.items[i].priority > qElement.priority) { 
                // Once the correct location is found it is 
                // enqueued 
                this.items.splice(i, 0, qElement); 
                contain = true; 
                break; 
            } 
        } 
    
        if (!contain) { 
            this.items.push(qElement); 
        } 
    } 

    dequeue() { 
        if (this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    } 

    front() { 
        if (this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    }

    rear() { 
        if (this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[this.items.length - 1]; 
    }

    isEmpty() { 
        return this.items.length == 0; 
    }

    printPQueue() 
    { 
        var str = ""; 
        for (var i = 0; i < this.items.length; i++) 
            str += this.items[i].element + " "; 
        return str; 
    }  
}