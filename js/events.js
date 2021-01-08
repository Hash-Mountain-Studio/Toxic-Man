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
            <tbody>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr><tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr><tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr><tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr><tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr><tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr><tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr><tr>
                  <th scope="col">#</th>
                  <th scope="col">NickName</th>
                  <th scope="col">Score</th>
                  <th scope="col">Level</th>
                </tr>

              </tbody>
        </table>
      </div>`;

    body.appendChild(element);
    //console.log(body);
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
        <button id="credits" class="menuButton">Credits</button>
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
        <button id ="credits" class="menuButton">Credits</button>
      </div>`;

    body.appendChild(element);
        
}