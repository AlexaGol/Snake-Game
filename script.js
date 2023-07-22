const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10;
const rows = canvas.height / gridSize;
const columns = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = 'right';
let food = spawnFood();
let isGameOver = false;
let score = 0;
let applesEaten = 0;
let gameSpeed = 100; // initial speed, in milliseconds
let gameLoop;

//food appears in random location
function spawnFood() {
    const x = Math.floor(Math.random() * columns) * gridSize;
    const y = Math.floor(Math.random() * rows) * gridSize;
    return { x, y };
}

function drawSnake() {
    ctx.fillStyle = 'black';
    snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }
    snake.unshift(head);
}

function checkCollision() {
    const head = snake[0];

    // Wrap the snake around the edges
    if (head.x < 0) {
        head.x = canvas.width - gridSize;
    } else if (head.x >= canvas.width) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = canvas.height - gridSize;
    } else if (head.y >= canvas.height) {
        head.y = 0;
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            isGameOver = true;
            break;
        }
    }

    // Check collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        applesEaten++;
        food = spawnFood();

        // Increase speed after eating 10 apples
        if (applesEaten % 10 === 0) {
            gameSpeed -= 10;
        }
    } else {
        snake.pop();
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Orbitron';
    ctx.fillText('Score: ' + score, 10, 30);
}

function updateGameArea() {
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Orbitron';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    drawScore();

    // Control the game speed using setTimeout and recursion
    gameLoop = setTimeout(updateGameArea, gameSpeed);
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
});

// Start the game
updateGameArea();