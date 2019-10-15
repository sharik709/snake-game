

const FOOD_EAT_SCORE = 1
const DIE_SCORE = -1

const H_NODES = 16
const LAYERS = 2

const MUTATION_RATE = 0.5




class Population {

    constructor(pop_size) {
        this.pop = []
        this.foods = []
        this.highscore = 0
        this.evolution = createVector(0,0);
        this.gen = 0
        for (let i = 0;i < pop_size;i++) {
            this.pop[i] = new Snake()
        }
        this.bestSnake = {}
        this.bestSnakeFitness = 0;
        this.bestSnakeScore = 0
        this.fitnessSum = 0
    }


    handleFrame() {

        if (this.allDead()) {
            this.calculateFitness();
            this.naturalSelection();
            this.highscore = this.bestSnake.score;
        } else {
            this.moveSnakes()
        }

    }

    calculateFitness() {
        for (let i =0;i < this.pop.length;i++) {
            this.pop[i].fitness = 1.0/(this.pop[i].score*this.pop[i].score)
        }
    }

    calculateFitnessSum() {
        let sum = 0
        for (let i =0;i < this.pop.length;i++) {
            this.sum += this.pop[i].fitness
        }
        return sum
    }

    setBestSnake() {
        let max = 0;
        let maxIndex = 0;
        for(let i = 0; i < this.pop.length; i++) {
           if(this.pop[i].fitness > max) {
              max = this.pop[i].fitness;
              maxIndex = i;
           }
        }
        if(max > this.bestFitness) {
          this.bestSnakeFitness = max;
          this.bestSnake = this.pop[maxIndex].cloneForReplay();
          this.bestSnakeScore = this.pop[maxIndex].score;
        } else {
            if (this.bestSnake) {
                this.bestSnake = this.bestSnake
            } else {
                this.bestSnake = this.pop[0]
            }
        }
    }

    selectParent() {
        let rand = random(this.fitnessSum);
        let summation = 0;
        for(let i = 0; i < this.pop.length; i++) {
           summation += this.pop[i].fitness;
           if(summation > rand) {
             return this.pop[i];
           }
        }
        return this.pop[0];
    }

    naturalSelection() {
        let newSnakes = []
      
        this.setBestSnake();
        this.fitnessSum = this.calculateFitnessSum();
        if (!this.bestSnake.x) {
            this.bestSnake = this.pop[0]
        }
        newSnakes[0] = this.bestSnake.clone();  //add the best snake of the prior generation into the new generation
        for(let i = 1; i < this.pop.length; i++) {
           let child = this.selectParent().crossover(this.selectParent());
           child.mutate();
           newSnakes[i] = child;
        }
        this.pop = []
        for ( let i =0; i <newSnakes.length-1;i++) {
            this.pop[i] = newSnakes[i].clone();
        }
        this.evolution.add(this.bestSnakeScore);
        this.gen+=1;
    }

    allDead() {
        for (let i =0;i < this.pop.length;i++) {
            if (!this.pop[i].dead) {
                return false;
            }
        }
        return true;
    }

    moveSnakes() {
        for (let i =0;i < this.pop.length;i++) {
            let s = this.pop[i]
            s.update()
            s.show()

            if (s.eat()) {
                s.score += FOOD_EAT_SCORE
            }
            if (s.death()) {
                s.score -= DIE_SCORE
            }
            let state = s.getState()
            let action = s.takeAction(state)
            

        }
    }


    showFood() {
        for (let i =0;i < this.foods.length;i++) {
            this.foods[i].show()
        }
    }


    reset() {

    }




}