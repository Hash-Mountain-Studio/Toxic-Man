function addElement(elementId) {
    let element = document.getElementById(elementId);
    element.parentNode.parentNode.remove();
}

function removeElement(elementId) {
    let element = document.getElementById(elementId);
    element.parentNode.parentNode.remove();
}

function addHighScoreTable(){
    const body = document.querySelector("body");
            
    let element = document.createElement("div");
    element.id = "highScoreTable";
    element.innerHTML = `
      <div  class="menuScores">
        <i id="closeButton" class="fa fa-times" aria-hidden="true"></i>
        <div class="name">High Scores</div>
        <table id = "scoreTable">
            <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
      </div>`;

    body.appendChild(element);
    const tbody = document.querySelector("tbody");
    for(let i=0; i<getHighScoresFromStorage().length; i++){
        let element = document.createElement("tr");
        element.innerHTML = `
                  <th scope="col">${i+1}</th>
                  <th scope="col">${getHighScoresFromStorage()[i][0]}</th>
                  <th scope="col">${getHighScoresFromStorage()[i][1]}</th>
                  <th scope="col">${getHighScoresFromStorage()[i][2]}</th>`;
        tbody.appendChild(element);
    }
}

function addControls(){
    const body = document.querySelector("body");
    let element = document.createElement("div");
    element.id = "controlTable";
    element.innerHTML = `
      <div  class="menuScores">
        <i id="closeButton" class="fa fa-times" aria-hidden="true"></i>
        <div class="name">High Scores</div>
        <table id = "scoreTable">
            <tbody>
                <tr>
                  <th scope="col">w</th>
                  <th scope="col">Move Forward</th>
                </tr>
                <tr>
                  <th scope="col">s</th>
                  <th scope="col">Move Backward</th>
                </tr>
                <tr>
                  <th scope="col">a</th>
                  <th scope="col">Move Left</th>
                </tr>
                <tr>
                  <th scope="col">d</th>
                  <th scope="col">Move Righ</th>
                </tr>
                <tr>
                  <th scope="col">e</th>
                  <th scope="col">Pointer Lock</th>
                </tr>
                <tr>
                  <th scope="col">p</th>
                  <th scope="col">Pause Game</th>
                </tr>
                <tr>
                  <th scope="col">q</th>
                  <th scope="col">Quit Game</th>
                </tr>
            </tbody>
        </table>
      </div>`;

    body.appendChild(element);
}

function addStartMenu(){
    const body = document.querySelector("body");
        
    let element = document.createElement("div");
    element.id = "logoAndMenu";
    element.innerHTML = `
      <img
        id="startMenuLogo"
        src="images/logo.png"
        alt="Hash Mountain Studio"
      >
      <div id="menu">
        <div class="name">TOXIC-MAN</div>
        <button
          id="playButton"
          class="menuButton"
        >Play now!</button>
        <button id="highScores" class="menuButton">High Scores</button>
        <button id="controls" class="menuButton">Controls</button>
      </div>`;

    body.appendChild(element);
        
}

function addPauseMenu(){
    const body = document.querySelector("body");
        
    let element = document.createElement("div");
    element.id = "logoAndMenu";
    element.innerHTML = `
      <img
        id="startMenuLogo"
        src="images/logo.png"
        alt="Hash Mountain Studio"
      >
      <div id="menu">
        <div class="name">PAUSED</div>
        <button
          id="playButton"
          class="menuButton"
        >Continue</button>
        <button id ="restartButton" class="menuButton">Restart Game</button>
        <button id ="highScores" class="menuButton">High Scores</button>
        <button id ="controls" class="menuButton">Controls</button>
      </div>`;

    body.appendChild(element);
        
}

function enterNickNameMenu(){
    const body = document.querySelector("body");
        
    let element = document.createElement("div");
    element.id = "logoAndMenu";
    element.innerHTML = `
      <div id="finishedGame">
        <div class="name">GAME OVER</div>
        <form id = "todo-form" name="form">
            <input class="form-control" type="text" name="nickname" id = "nickname" placeholder="Enter a Nickname">
            <button class="menuButton addButton">Add to Table</button>
        </form>
      </div>`;

    body.appendChild(element);
    addToStorage();
}