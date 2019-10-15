var scl = 20;

const W = 600;
const H = 600;

const GAMMA = 0.9;
const LEARNING_RATE = 0.1

var EXPLORATION = 0.1
const EXPLORARATION_DECAY = 0.00001

const humanPlaying = false;


var FR = 100

let vision = false
var snake;

var pauseBtn;
var actBtn;
var pauseGame = false;
var act = false


function setup() {
  createCanvas(W, H);
  frameRate(FR);
  snake = new Snake();
  pauseBtn = createButton('Pause Game')
  pauseBtn.position(640, 100)
  pauseBtn.mousePressed(pauseTheGame)

  actBtn = createButton('Step')
  actBtn.position(640, 200)
  actBtn.mousePressed(stepGame)

}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      snake.dir(0, -1)
      break;
    case DOWN_ARROW:
      snake.dir(0, 1)
      break;
    case LEFT_ARROW:
      snake.dir(-1, 0)
      break;
    case RIGHT_ARROW:
      snake.dir(1, 0)
      break;
  }
}

function pauseTheGame() {
  pauseGame = true
  console.log(pauseGame)
}

function stepGame() {
  act = true
}

function draw() {
  background(51);
  if (snake.dead) {
    let brain = snake.brain;
    snake = new Snake;
    snake.brain = brain
    return;
  }
  let state = snake.getState();
  let action = snake.getAction(state);
  if (!pauseGame || act) {
    snake.takeAction(action)
    snake.update()
    act = false;
  }
  snake.show()
  snake.death()

  let reward = snake.getReward(state, action);
  let newState = snake.getState();
  act = false;
  let predict = snake.brain.predict(state)

  snake.brain.render(state, predict);
  
  let qVal = snake.getAndSetQValue(state, action, newState, reward)
}