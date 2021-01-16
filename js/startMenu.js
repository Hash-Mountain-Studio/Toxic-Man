let radius = 25;
let theta = 20;
let phi = 0;
let thetaSpeed = 0.1;
let phiSpeed = 0.3;

let thetaDistance;
let phiDistance;
let radiusDistance;

// gameCondition = 0 --> not started yet
// gameCondition = 1 --> started but  animation not finished
// gameCondition = 2 --> started
// gameCondition = 3 --> paused
// gameCondition = 4 --> finished
let gameCondition = 0;

let changed = 0;

function setGameCondition(condition){
    gameCondition = condition;
    changed = 1;
}

function setChanged(val){
    changed = val;
}

let radToDeg = function (radian) {
    return (radian * 180) / Math.PI;
};

let degToRad = function (degree) {
    return (degree * Math.PI) / 180;
};

function gameOver(score){
    gameCondition = 4;
    changed = 1;
    enterNickNameMenu(score);
};

document.addEventListener("click",function(e){
    if(e.target.id === "playButton"){
        gameCondition = 1;
        changed = 1;
        removeElement("playButton");
        addScoreboard();
    }
    if(e.target.id === "restartButton"){
        window.location.reload(false);
    }
    if(e.target.id === "highScores"){
        removeElement("playButton");
        addHighScoreTable();
    }
    if(e.target.id === "closeButton"){
        removeElement(e.target.id);
        
        if(gameCondition === 0){
            addStartMenu();
        }
        
        if(gameCondition === 3){
            addPauseMenu();
        }
    }
    if(e.target.id === "controls"){
        removeElement("playButton");
        addControls();
            
    }
});
document.onkeydown = function (e) {
    if((e.key === "p" || e.key === "P")){
        if(gameCondition === 2){
            removeScoreboard();
            // add pause screen
            gameCondition = 3;
            changed = 1;
            addPauseMenu();
        }
        else if (gameCondition === 3){
            addScoreboard();
            // remove pause screen and continue
            gameCondition = 2;
            changed = 1;
            let element = document.getElementById("playButton");
            if(!element){
               element = document.getElementById("closeButton");
            }
            element.parentNode.parentNode.remove();
        }
    }
    if((e.key === "q" || e.key === "Q") && gameCondition === 2){
        removeScoreboard();
        gameOver();
    }
};

let startPosition = function (value, distance, startValue, range) {
    if (value > startValue + range) {
        value -= distance / 100;
    } else if (value < startValue - range) {
        value -= distance / 100;
    } else {
        value = startValue;
    }
    return value;
};

var updateCameraInStart = function (camera, ball) {
    if (gameCondition === 0) {
        thetaDistance = theta - 45;
        phiDistance = phi - 90;
        radiusDistance = radius - 5;
        updateCameraBeforeStart(camera, ball);
    }
    if (gameCondition === 1) {
        updateCameraAfterStart(camera, ball);
    }
};

var updateCameraBeforeStart = function (camera, ball) {
    if (theta >= 170 || theta <= 10) {
        thetaSpeed = -thetaSpeed;
    }
    phi = (phi + phiSpeed) % 360;
    camera.position.set(
        -radius * Math.cos(degToRad(theta)),
        radius * Math.sin(degToRad(theta)),
        radius * Math.cos(degToRad(phi))
    );
    if (ball) {
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
    }

    theta += thetaSpeed;
};
    
var updateCameraAfterStart = function (camera, ball) {
    theta = startPosition(theta, thetaDistance, 45, 0.2);
    phi = startPosition(phi, phiDistance, 90, 0.5);
    radius = startPosition(radius, radiusDistance, 5, 0.2);
    if (theta === 45 && phi === 90 && radius === 5) {
        gameCondition = 2;
        changed = 1;
    }
    camera.position.set(
        -radius * Math.cos(degToRad(theta)),
        radius * Math.sin(degToRad(theta)),
        radius * Math.cos(degToRad(phi))
    );
    if (ball) {
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
    }
};



export { gameCondition, changed, radius, setGameCondition, setChanged, updateCameraInStart, degToRad };
