
function addScore(e){
     
    const newTodo = document.querySelector("#nickname").value.trim();
    let level = 1;
    let score = 0;
    
    console.log(newTodo);
    if (newTodo !== ""){
        let todos = getHighScoresFromStorage();
        let index = 0;
        //console.log(document.querySelector("#todo-form"));

        todos.push([newTodo, level, score]);
        localStorage.setItem("highScores", JSON.stringify(todos));
    }
    e.preventDefault();
}

function getHighScoresFromStorage(){
    let highScores;

    if(localStorage.getItem("highScores") === null){
        highScores = [];
    }
    else{
        highScores = JSON.parse(localStorage.getItem("highScores"));
    }
    return highScores;
}


function addToStorage(){
   
    document.querySelector("#todo-form").addEventListener("submit", addScore);
    
    //console.log(getHighScoresFromStorage());
    //todos.splice(index, 0, "Lene");
    
    /*var arr = [];
    arr[0] = "Jani";
    arr[1] = "Hege";
    arr[2] = "Stale";
    arr[3] = "Kai Jim";
    arr[4] = "Borge";

    console.log(arr.join());
    arr.splice(2, 0, "Lene");
    console.log(arr.join());*/
}






