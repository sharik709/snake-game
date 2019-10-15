/**
 * 0 down
 * 1  up
 * 2 left
 * 3 right
 */

var scl = 20;

const W = 400;
const H = 400;

var width = W;
var height = H;

const GAMMA = 0.9;
const LEARNING_RATE = 0.1

const EXPLORATION = 0.0



function setup() {
  createCanvas(W, H);

    let newSnake =  new Snake;

    // this means wall on right
    let state = []
    let a = 3

    for (let i = 0; i < 27;i++) {
        state[i] = 0;
    }
    state[26] = 1;

    let reward = newSnake.getReward(state, a)
    console.log('---------------')
    console.log('reward', reward);
    console.log('test passed: ', -1000 == reward)
    console.log('---------------')
}

function draw() {
}


