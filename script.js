/*Todo

1. color ✔️
2. game over
3. previos var updates
4. won

*/
var score = 0;
var blockValues = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

var previousScore = score;
var previousBlockValues = JSON.parse(JSON.stringify(blockValues));

const board = document.getElementById('board');

window.onload = async function() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let card = document.createElement('div');
            card.className = 'card';
            board.appendChild(card);
        }
    }
};

async function isFull() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (blockValues[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

async function placeCards() {
    const scoreCard = document.getElementById('score');
    scoreCard.textContent = score;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const card = board.children[i * 4 + j];
            const value = blockValues[i][j];
            card.textContent = value === 0 ? '' : value;

            card.className = 'card';

            if (value !== 0) {
                card.classList.add(`x${value}`);
            } else {
                card.classList.add('x0');
            }
        }
    }
}

async function placeRandom() {
    if (await isFull()) {
        await placeCards();
        if (await isGameOver()) {
            window.alert("Game Over!");
        }
    } else {
        placed = false;
        while (!placed) {
            let row = Math.floor(Math.random() * 4);
            let column = Math.floor(Math.random() * 4);
            if (blockValues[row][column] == 0 && !([2, 1].includes(row) && [2, 1].includes(column))) {
                blockValues[row][column] = Math.random() < 0.9 ? 2 : 4;
                placed = true;
            }
        }
    }
}

async function previousState() {
    score = previousScore;
    blockValues = JSON.parse(JSON.stringify(previousBlockValues));
    await placeCards();
}

function continueGame() {
    const won = document.querySelectorAll('.new-game')[2];
    won.style.display = 'none';
}

async function newGame() {
    const gameBoard = document.querySelectorAll('.game-board')[0];
    const startDiv = document.querySelectorAll('.new-game')[0];
    const gameOver = document.querySelectorAll('.new-game')[1];
    const won = document.querySelectorAll('.new-game')[2];  

    gameBoard.style.display = 'block';
    startDiv.style.display = 'none';
    gameOver.style.display = 'none';
    won.style.display = 'none';

    score = 0;
    blockValues = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    await placeRandom();
    await placeRandom();
    await placeCards();
}

async function isGameOver() {
    let gameOver = true;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (blockValues[i][j] == 0) {
                gameOver = false;
                break;
            }
        }
    }

    if (gameOver) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i < 3 && blockValues[i][j] == blockValues[i + 1][j]) {
                    gameOver = false;
                    break;
                }
                if (j < 3 && blockValues[i][j] == blockValues[i][j + 1]) {
                    gameOver = false;
                    break;
                }
            }
        }
    }

    return gameOver;
}

// For Key events
document.addEventListener("keyup", async function(event) {
    let isBlocksMoved = false;
    previousBlockValues = JSON.parse(JSON.stringify(blockValues));
    previousScore = score;
    
    if (event.key == 'w' || event.key == 'ArrowUp') {
        isBlocksMoved = await moveUp();
    } else if (event.key == 's' || event.key == 'ArrowDown') {
        isBlocksMoved = await moveDown();
    } else if (event.key == 'a' || event.key == 'ArrowLeft') {
        isBlocksMoved = await moveLeft();
    } else if (event.key == 'd' || event.key == 'ArrowRight') {
        isBlocksMoved = await moveRight();
    }

    if (isBlocksMoved) {
        await placeRandom();
        await placeCards();
    }
});

// For Touch events
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
document.addEventListener("touchstart", async function(event) {
    touchstartX = event.touches[0].clientX;
    touchstartY = event.touches[0].clientY;
});

document.addEventListener("touchend", async function(event) {
    touchendX = event.changedTouches[0].clientX;
    touchendY = event.changedTouches[0].clientY;
    await handleSwipe();
});

async function handleSwipe() {
    const deltaX = touchendX - touchstartX;
    const deltaY = touchendY - touchstartY;
    let isBlocksMoved = false;
    previousBlockValues = JSON.parse(JSON.stringify(blockValues));
    previousScore = score;

    if (Math.abs(deltaX) < 40 && Math.abs(deltaY) < 40) {
        return;
    } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 40) {
            isBlocksMoved = await moveRight();
        } else if (deltaX < -40) {
            isBlocksMoved = await moveLeft();
        }
    } else {
        if (deltaY > 40) {
            isBlocksMoved = await moveDown();
        } else if (deltaY < -40) {
            isBlocksMoved = await moveUp();
        }
    }

    if (isBlocksMoved) {
        await placeRandom();
        await placeCards();
    }
}

async function move(row) {
    let copyRow = [...row];
    let movement = false;
    row = row.filter(val => val !== 0);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] = row[i] * 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = row.filter(val => val !== 0);
    while (row.length < 4) {
        row.push(0);
    }

    if (JSON.stringify(copyRow) != JSON.stringify(row)) {
        movement = true;
    }
    return [row, movement];
}

async function moveUp() {
    let movement = false;
    let moveTemp = false;
    for (let column = 0; column < 4; column++) {
        let row = [blockValues[0][column], blockValues[1][column], blockValues[2][column], blockValues[3][column]];
        [row, moveTemp] = await move(row);
        movement = movement || moveTemp;
        blockValues[0][column] = row[0];
        blockValues[1][column] = row[1];
        blockValues[2][column] = row[2];
        blockValues[3][column] = row[3];
    }
    return movement;
}

async function moveDown() {
    let movement = false;
    let moveTemp = false;
    for (let column = 0; column < 4; column++) {
        let row = [blockValues[0][column], blockValues[1][column], blockValues[2][column], blockValues[3][column]];
        row.reverse();
        [row, moveTemp] = await move(row);
        movement = movement || moveTemp;
        blockValues[0][column] = row[3];
        blockValues[1][column] = row[2];
        blockValues[2][column] = row[1];
        blockValues[3][column] = row[0];
    }
    return movement;
}

async function moveLeft() {
    let movement = false;
    let moveTemp = false;
    for (let row = 0; row < 4; row++) {
        [blockValues[row], moveTemp] = await move(blockValues[row]);
        movement = movement || moveTemp;
    }
    return movement;
}

async function moveRight() {
    let movement = false;
    let moveTemp = false;
    for (let row = 0; row < 4; row++) {
        blockValues[row].reverse();
        [blockValues[row], moveTemp] = await move(blockValues[row]);
        movement = movement || moveTemp;
        blockValues[row].reverse();
    }
    return movement;
}
