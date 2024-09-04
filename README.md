# Self-Learning Snake AI using Neural Network

This project implements a self-learning Snake AI game using HTML, Sketch.js (or p5.js), and TensorFlow.js for the neural network. The AI-controlled snake learns to navigate the game environment by avoiding walls and optimizing its movements to achieve higher scores over time.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
  - [Game Mechanics](#game-mechanics)
  - [Neural Network Architecture](#neural-network-architecture)
  - [Learning Process](#learning-process)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Game](#running-the-game)
- [Customization](#customization)
  - [Adjusting Game Parameters](#adjusting-game-parameters)
  - [Modifying the Neural Network](#modifying-the-neural-network)
- [Demo](#demo) 
- [Contributing](#contributing)
- [License](#license)

## Features

- **HTML5 Canvas & Sketch.js**: Renders the game in the browser for smooth animations.
- **TensorFlow.js Neural Network**: Implements a neural network using TensorFlow.js for real-time learning.
- **Self-Learning AI**: The snake learns to avoid walls and optimize its path through reinforcement learning.
- **Interactive Controls**: Pause, step through, and observe the learning process.
- **Visualization of Neural Network**: Real-time rendering of the neural network's decision-making process.

## How It Works

### Game Mechanics

- **Snake Movement**: The snake moves on a grid, consuming food to grow longer.
- **Collision Detection**: The snake must avoid colliding with walls or its own body.
- **Scoring System**: Points are awarded for each piece of food consumed.

### Neural Network Architecture

- **Inputs**: The neural network takes a state vector of four elements representing:
  - **Wall Up**: Whether there's a wall above the snake.
  - **Wall Down**: Whether there's a wall below the snake.
  - **Wall Right**: Whether there's a wall to the right of the snake.
  - **Wall Left**: Whether there's a wall to the left of the snake.
- **Hidden Layer**: Consists of 4 neurons with ReLU activation.
- **Outputs**: A vector of four probabilities corresponding to the actions:
  - **Move Up**
  - **Move Down**
  - **Move Left**
  - **Move Right**

### Learning Process

- **State Evaluation**: The snake assesses its environment using the state vector.
- **Action Selection**: The neural network predicts the best action based on the current state.
- **Reward System**: The snake receives rewards or penalties:
  - **Positive Reward**: For moving without hitting a wall.
  - **Negative Reward**: For colliding with a wall (-1).
- **Q-Learning Algorithm**: Updates the neural network using temporal difference learning.

## Getting Started

### Prerequisites

- **Web Browser**: A modern browser like Google Chrome or Firefox.
- **Local Server (Optional)**: For improved performance, especially with TensorFlow.js.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sharik709/snake-game.git
   ```
2. **Navigate to the Project Directory**
   ```bash
   cd snake-game
   ```
3. **View Game**
   - open index.html in moderm browser.

### Running the Game

- **Without a Server**: Open `index.html` in your browser.
- **With a Server**: Navigate to `http://localhost:8000` (or the port you specified).

## Customization

### Adjusting Game Parameters

- **Frame Rate (`FR`)**: Controls the speed of the game.
  ```javascript
  var FR = 100; // Higher value speeds up the game
  ```
- **Exploration Rate (`EXPLORATION`)**: Balances exploration and exploitation.
  ```javascript
  var EXPLORATION = 0.1; // Lower value reduces random actions
  ```
- **Learning Rate (`LEARNING_RATE`)**: Affects how quickly the AI learns.
  ```javascript
  const LEARNING_RATE = 0.01; // Increase for faster learning
  ```
- **Gamma (`GAMMA`)**: The discount factor for future rewards.
  ```javascript
  const GAMMA = 0.9; // Closer to 1 considers future rewards more
  ```

### Modifying the Neural Network

- **Change Input Size**: Modify if you add more environmental factors.
  ```javascript
  this.inputs = 4; // Number of input neurons
  ```
- **Adjust Hidden Layers**: Increase or decrease complexity.
  ```javascript
  this.hidden = 4; // Number of neurons in the hidden layer
  ```
- **Alter Activation Functions**: Experiment with different activation functions.
  ```javascript
  activation: 'relu', // Options: 'sigmoid', 'tanh', etc.
  ```

## Demo

Unavailable. Please clone this repository and open index.html in modern browser.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m "Add Your Feature"
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Note**: Make sure to replace placeholders like `your-username` and demo links with your actual information.
