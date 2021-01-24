const grid = document.querySelector('.grid');
const width = 10;
const scoreDisplay = document.querySelector('#score');
const linesDisplay = document.querySelector('#lines');
const startBtn = document.querySelector('#start-btn');
const resetBtn = document.querySelector('#reset-btn');
const modal = document.querySelector('#pop-up');
const closeSpan = document.querySelector('.close');

let squares = Array.from(document.querySelectorAll('.grid div'));
let nextRandom = 0;
let timerId;
let score = 0;
let lines = 0;

const colors = [
    'coral',
    'green',
    'purple',
    'red',
    'blue'
]

const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [width*2, 1, width+1, width*2+1],
    [width, width*2, width*2+1, width*2+2]
];

const zTetromino = [
    [width*2, width+1, width*2+1, width+2],
    [0, width, width+1, width*2+1],
    [width*2, width+1, width*2+1, width+2],
    [0, width, width+1, width*2+1]
];

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width*2+1, width+2],
    [width, width+1, width*2+1, width+2],
    [width, 1, width+1, width*2+1]
];

const oTetromino = [
    [0, width, 1, width+1],
    [0, width, 1, width+1],
    [0, width, 1, width+1],
    [0, width, 1, width+1]
];

const iTetromino = [
    [1, width+1, width*2 +1, width*3 +1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let random = Math.floor(Math.random()*theTetrominoes.length);
let currentRotation = 0;

let currentPosition = 4;
let current = theTetrominoes[random][currentRotation];

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    })
}

function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
    })
}

//timerId = setInterval(moveDown, 1000);

function moveDown() {
    if(timerId) {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
}

function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('fix'));
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        random = nextRandom;
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

function control(e) {
    if(e.keyCode === 37) {
        moveLeft();
    } else if(e.keyCode === 38){
        rotate();
    } else if(e.keyCode === 39) {
        moveRight();
    } else if(e.keyCode === 40) {
        moveDown();
        downPoint();
    }
}

document.addEventListener('keyup', control)

function moveLeft() {
    if(timerId) {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if(!isAtLeftEdge) {
            currentPosition -= 1;
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }
}

function moveRight() {
    if(timerId) {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);

        if(!isAtRightEdge) {
            currentPosition += 1;
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }

        draw();
    }
}

function rotate() {
    if(timerId) {
        undraw();
        currentRotation += 1;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }

        current = theTetrominoes[random][currentRotation];
        draw();
    }
}

const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
const displayIndex = 0;

const upNext = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2 +1, displayWidth*3 +1]
];

function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = '';
    })

    upNext[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    })
}

startBtn.addEventListener('click', () => {
    if(timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        displayShape();
    }
})

resetBtn.addEventListener('click', () => {
    window.location.reload(true);
})

function addScore() {
    for(let i =0; i<199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 100;
            lines += 1;
            scoreDisplay.innerHTML = score;
            linesDisplay.innerHTML = lines;
            modalScore.innerHTML = score;
            modalLines.innerHTML = lines;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        modal.style.display = 'block';
        clearInterval(timerId);
        timerId = null;
        startBtn.disabled = true;
    }
}

closeSpan.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(e) {
    if(e.target === modal) {
        modal.style.display = "none";
    }
}

function downPoint() {
    if(!startBtn.disabled)
    {
        score += 1;
        scoreDisplay.innerHTML = score;
        modalScore.innerHTML = score;
    }
}