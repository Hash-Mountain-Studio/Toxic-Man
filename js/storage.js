
function addScore(e){
     
    const newScore = document.querySelector("#nickname").value.trim();
    let level = 1;
    let score = Math.random() * 20;
    let flag = 0;
    let isNewAdded = 0; 
    
    if (newScore !== ""){
        let todos = getHighScoresFromStorage();
        let length = todos.length;
        let newTodos = [];
        if(todos.length >= 10){
            length = 10;
        }
        for(let i=0; i<length; i++){
            flag = 1;
            if(parseInt(todos[i][1]) < score && isNewAdded !== 1){
                newTodos.push([newScore, score, level]);
                isNewAdded = 1;
            }
            newTodos.push(todos[i]);
        }
        if(flag === 0 || isNewAdded === 0){
            newTodos.push([newScore, score, level]);
        }

        localStorage.setItem("highScores", JSON.stringify(newTodos.slice(0, 10)));
    }
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






