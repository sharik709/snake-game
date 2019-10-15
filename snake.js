class Snake {

  constructor() {
    let food = new Food();
    food.pickLocation()
    this.x = W / 2;
    this.y = H / 2;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 1;
    this.tail = [];
    this.food = food;
    this.dead = false
    this.fitness = 0
    this.q_table = {}
    this.hide = false;

    this.brain = new NeuralNet(4, 4, 4)
  }

  eat() {
    let pos = this.food.food
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.food.pickLocation()
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  dir(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  death() {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.dead = true;
      }
    }
  }

  bodyCollide(pos) {
    for (let i = 0; i < this.tail.length - 1; i++) {
      if (pos.x == this.tail[i].x && pos.y == this.tail[i].y) {
        return true;
      }
    }
    return false;
  }

  wallCollide(pos) {
    return (pos.x > W - scl || pos.x < 0 || pos.y > H - scl || pos.y < 0)
  }

  update() {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    if (this.total >= 1) {
      this.tail[this.total - 1] = createVector(this.x, this.y);
    }

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  }

  show() {
    if (this.dead) return;
    fill(255);
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    rect(this.x, this.y, scl, scl);
  }

  getState() {
    let head = createVector(this.x, this.y);
    let pos = head.copy();
    let state = [0, 0, 0, 0]
    state[0] = this.wallCollide(pos.copy().add(0, -1)) ? 1 : 0;
    state[1] = this.wallCollide(pos.copy().add(0, 1)) ? 1 : 0;
    state[2] = this.wallCollide(pos.copy().add(1, 0)) ? 1 : 0;
    state[3] = this.wallCollide(pos.copy().add(-1, 0)) ? 1 : 0;

    /**
     * State[0] = wall up
     * state[1] = wall down
     * state[2] = wall right
     * state[3] = wall left
     */
    return state;
  }

  getAndSetQValue(state, action, newState, reward) {
    let target = this.dead ? -1 : 0;
    let td = this.getTemporalDifference(state, action, newState, target);
    target = this.getQ(state, action) + (LEARNING_RATE * td)
    this.setQ(state, action, target)
  }

  // Eq. reward + (gmma/discount factor * max[A]Q(s1, a1)-Q(s, a))
  getTemporalDifference(s, a, s1, r) {
    let futurePredict = this.brain.predict(s1)
    let proximalFutureState = futurePredict[this.amax(futurePredict)]
    let preQV = this.getQ(s, a)
    return r + (GAMMA * (proximalFutureState - preQV))
  }
  getQ(state, a = null) {
    let predict = this.brain.predict(state);
    if (a !== null) {
      return predict[a]
    }
    return predict
  }

  async setQ(s, a, qValue) {
    let predict = this.brain.predict(s);
    predict[a] = qValue;
    this.brain.train(s, predict)
  }

  getAction(s) {
    let predict = this.brain.predict(s)
    return this.amax(predict);
  }

  foodCollide(snake) {
    let pos = this.food.food
    var d = dist(snake.x, snake.y, pos.x, pos.y);
    return d < 1
  }

  takeAction(a) {
    switch (a) {
      case 0:
        this.moveDown();
        break;
      case 1:
        this.moveUp();
        break;
      case 2:
        this.moveLeft();
        break;
      case 3:
        this.moveRight();
        break;
    }
  }

  getReward(s, a) {
    /**
     * State[0] = wall up
     * state[1] = wall down
     * state[2] = wall right
     * state[3] = wall left
     */
    let reward = 0;
    if (s[0] == 1 && a == 0) {
      reward = -1;
    } else if (s[1] == 1 && a == 1) {
      reward = -1;
    } else if (s[2] == 1 && a == 3) {
      reward = -1;
    } else if (s[3] == 1 && a == 2) {
      reward = -1;
    }
    return reward;
  }

  moveUp() {
    if (this.yspeed != -1) {
      this.dir(0, 1)
      // this.xspeed = 0;
      // this.yspeed = 1;
    }
  }

  moveDown() {
    if (this.yspeed != 1) {
      this.dir(0, -1)
      // this.xspeed = 0;
      // this.yspeed = -1;
    }
  }

  moveLeft() {
    if (this.xspeed != 1) {
      this.dir(-1, 0)
      // this.xspeed = -1;
      // this.yspeed = 0;
    }
  }

  moveRight() {
    if (this.xspeed != -1) {
      this.dir(1, 0)
      // this.xspeed = 1;
      // this.yspeed= 0
    }
  }

  cloneForReplay() {  //clone a version of the snake that will be used for a replay
    let clone = new Snake(new Food);
    clone.brain = brain.clone();
    return clone;
  }

  clone() {  //clone the snake
    let clone = new Snake();
    clone.brain = this.brain.clone();
    return clone;
  }

  crossover(parent) {  //crossover the snake with another snake
    let child = new Snake();
    child.brain = this.brain.crossover(parent.brain);
    return child;
  }

  mutate() {  //mutate the snakes brain
    this.brain.mutate(MUTATION_RATE);
  }

  amax(val) {
    let maxVal = 0;
    let maxValI = 0;
    for (let i =0;i < val.length;i++) {
      if (maxVal < val[i]) {
        maxVal = val[i]
        maxValI = i
      }
    }
    return maxValI;
  }

  dump() {
    console.log('---------------')
    console.log('state', snake.getState())
    let predict = snake.brain.predict(snake.getState());
    console.log('up', predict[0])
    console.log('down', predict[1])
    console.log('right', predict[3])
    console.log('left', predict[2])
    console.log('---------------')
  }

}
