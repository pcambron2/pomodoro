let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const applySettingsButton = document.getElementById('apply-settings');
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');

let WORK_TIME = 60 * 60; // 60 minutes in seconds
let BREAK_TIME = 5 * 60;  // 5 minutes in seconds

workTimeInput.value = WORK_TIME / 60; // Convert seconds to minutes for input display
breakTimeInput.value = BREAK_TIME / 60;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    updateDisplay();
}

function startTimer() {
    if (timerId === null) {
        if (timeLeft === undefined) {
            timeLeft = WORK_TIME;
        }
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                switchMode();
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    modeText.textContent = 'Work Time';
    updateDisplay();
}

function applySettings() {
    const newWorkTime = workTimeInput.value * 60;
    const newBreakTime = breakTimeInput.value * 60;
    
    WORK_TIME = newWorkTime;
    BREAK_TIME = newBreakTime;
    
    resetTimer();
}

function setWorkMode() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    modeText.textContent = 'Work Time';
    updateDisplay();
}

function setRestMode() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = false;
    timeLeft = BREAK_TIME;
    modeText.textContent = 'Break Time';
    updateDisplay();
}

function togglePlayPause() {
    if (startButton.style.display === 'none') {
        startButton.style.display = 'block';
        pauseButton.style.display = 'none';
    } else {
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
    }
}

startButton.addEventListener('click', () => {
    togglePlayPause();
    startTimer();
});

pauseButton.addEventListener('click', () => {
    togglePlayPause();
    pauseTimer();
});

resetButton.addEventListener('click', resetTimer);
applySettingsButton.addEventListener('click', applySettings);
document.getElementById('work-mode').addEventListener('click', setWorkMode);
document.getElementById('rest-mode').addEventListener('click', setRestMode);

settingsToggle.addEventListener('click', () => {
    const isVisible = settingsPanel.style.display === 'block';
    settingsPanel.style.display = isVisible ? 'none' : 'block';
});

// Initialize the display
resetTimer(); 

// Snake Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('snake-game');
const scoreElement = document.getElementById('score');
const startGameBtn = document.getElementById('startGame');

let snake = [];
let food = {};
let direction = 'right';
let gameLoop = null;
let score = 0;
const gridSize = 15;
const tileSize = canvas.width / gridSize;

function initGame() {
    snake = [
        { x: 7, y: 7 },
        { x: 6, y: 7 },
        { x: 5, y: 7 }
    ];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    createFood();
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };
    // Make sure food doesn't appear on snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        createFood();
    }
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        const x = segment.x * tileSize;
        const y = segment.y * tileSize;
        const size = tileSize - 1;

        ctx.fillStyle = index === 0 
            ? '#ff0000' // Bright red for head
            : '#cc0000'; // Darker red for body

        // Draw rounded rectangle for each segment
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 5);
        ctx.fill();

        // Add eyes if it's the head
        if (index === 0) {
            ctx.fillStyle = 'white';
            
            // Position eyes based on direction
            let leftEye, rightEye;
            switch(direction) {
                case 'right':
                    leftEye = { x: x + size - 6, y: y + 4 };
                    rightEye = { x: x + size - 6, y: y + size - 8 };
                    break;
                case 'left':
                    leftEye = { x: x + 4, y: y + 4 };
                    rightEye = { x: x + 4, y: y + size - 8 };
                    break;
                case 'up':
                    leftEye = { x: x + 4, y: y + 4 };
                    rightEye = { x: x + size - 8, y: y + 4 };
                    break;
                case 'down':
                    leftEye = { x: x + 4, y: y + size - 6 };
                    rightEye = { x: x + size - 8, y: y + size - 6 };
                    break;
            }

            // Draw eyes
            ctx.beginPath();
            ctx.arc(leftEye.x, leftEye.y, 2, 0, Math.PI * 2);
            ctx.arc(rightEye.x, rightEye.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add slight shading to create 3D effect
        if (index > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, size - 4, size - 4, 3);
            ctx.fill();
        }
    });

    // Draw food
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--success-color').trim();
    const foodX = food.x * tileSize;
    const foodY = food.y * tileSize;
    const foodSize = tileSize - 1;
    
    // Draw rounded food
    ctx.beginPath();
    ctx.roundRect(foodX, foodY, foodSize, foodSize, 5);
    ctx.fill();
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check for collisions
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        stopGame();
        return;
    }

    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function gameStep() {
    moveSnake();
    drawGame();
}

function startGame() {
    if (gameLoop) stopGame();
    initGame();
    gameLoop = setInterval(gameStep, 100);
}

function stopGame() {
    clearInterval(gameLoop);
    gameLoop = null;
}

// Event listeners
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

startGameBtn.addEventListener('click', startGame);

// Show game during break time
function updateGameVisibility(isWorkTime) {
    gameContainer.style.display = isWorkTime ? 'none' : 'block';
    if (!isWorkTime) {
        startGame();
    } else {
        stopGame();
    }
}

// Add this to your mode switching logic
document.getElementById('work-mode').addEventListener('click', () => {
    updateGameVisibility(true);
});

document.getElementById('rest-mode').addEventListener('click', () => {
    updateGameVisibility(false);
}); 