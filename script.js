/*Todo

1. color
2. game over
3. animation

*/

const newValues = [2,2,2,2,2,2,2,2,2,2,4]

var score = 0;
var addScore = 0;
var blockValues = [ [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0] ];

var previousBlockValues = blockValues;

const board = document.getElementById('board');

window.onload = function() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let card = document.createElement('div');
            card.className = 'card';
            board.appendChild(card);
        }
    }
}

function isFull() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (blockValues[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

function placeCards() {

    const scoreCard = document.getElementById('score');
    scoreCard.textContent = score;

    for ( let i = 0; i < 4; i++ ) {
        for ( let j = 0; j < 4; j++ ) {
            if ( blockValues[i][j] == 0 ) {
                board.children[i*4+j].textContent = '';
            } else {
                board.children[i*4+j].textContent = blockValues[i][j];
            }
        }
    }
}

function placeRandom() {
    if(isFull()) {        
        placeCards();
    }else{
        placed = false;
        while (!placed){
            let row = Math.floor(Math.random() * 4);
            let column = Math.floor(Math.random() * 4);
            if (blockValues[row][column] == 0 && !([2,1].includes(row) && [2,1].includes(column)) ) {
                blockValues[row][column] = newValues[Math.floor(Math.random() * newValues.length)];
                placed = true;
            }
        }
    }
}

function previousState() {
    score -= addScore;
    blockValues = previousBlockValues;
    placeCards();
}

function newGame() {
    const gameBoard = document.querySelectorAll('.game-board')[0];
    const startDiv = document.querySelectorAll('.new-game')[0];

    gameBoard.style.display = 'block';
    startDiv.style.display = 'none';

    score = 0;
    blockValues = [ [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0] ];
                    
    placeRandom();
    placeCards();

}

//For Key events
document.addEventListener("keyup", function(event) {
    let isBlocksMoved = false;
    previousBlockValues = blockValues.map(inner => inner.slice());
    if (event.key == 'w' || event.key == 'ArrowUp') {
        isBlocksMoved = moveUp();
    } else if (event.key == 's'  || event.key == 'ArrowDown') {
        isBlocksMoved = moveDown();
    } else if (event.key == 'a' || event.key == 'ArrowLeft') {
        isBlocksMoved = moveLeft();
    } else if (event.key == 'd' || event.key == 'ArrowRight') {
        isBlocksMoved = moveRight();
    }

    if (isBlocksMoved){
        placeRandom();
        placeCards();
    }
});

//For Touch events
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
document.addEventListener("touchstart", function(event) {
    touchstartX = event.touches[0].clientX;
    touchstartY = event.touches[0].clientY;
});

document.addEventListener("touchend", function(event) {
    touchendX = event.changedTouches[0].clientX;
    touchendY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchendX - touchstartX;
    const deltaY = touchendY - touchstartY;
    let isBlocksMoved = false;
    previousBlockValues = blockValues.map(inner => inner.slice());

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            isBlocksMoved = moveRight();
        } else {
            isBlocksMoved = moveLeft();
        }
    } else {
        if (deltaY > 0) {
            isBlocksMoved = moveDown();
        } else {
            isBlocksMoved = moveUp();
        }
    }

    if (isBlocksMoved) {
        placeRandom();
        placeCards();
    }
}

function move(row) { 
    addScore = 0;
    copyRow = row;
    let movement = false;
    row = row.filter(val => val !== 0);
    for (let i = 0; i < row.length-1; i++) {
        if (row[i] == row[i+1]) {
            row[i] = row[i] * 2;
            row[i+1] = 0;
            addScore += row[i];
        }
    }

    row = row.filter(val => val !== 0);
    console.log(row);
    while (row.length < 4) {
        row.push(0);
    }

    if (JSON.stringify(copyRow) != JSON.stringify(row)) {
        movement = true;
    }
    score += addScore;
    return [row,movement];
}

function moveUp() { 
    let movement = false; 
    let moveTemp = false;
    for (let column=0; column<4; column++) {
        row = [blockValues[0][column], blockValues[1][column], blockValues[2][column], blockValues[3][column]];
        [row, moveTemp] = move(row);
        movement = movement || moveTemp;
        blockValues[0][column] = row[0];
        blockValues[1][column] = row[1];
        blockValues[2][column] = row[2];
        blockValues[3][column] = row[3];
    }   
    
    return movement;
}

function moveDown() {
    let movement = false;
    let moveTemp = false;
    for (let column=0; column<4; column++) {
        row = [blockValues[0][column], blockValues[1][column], blockValues[2][column], blockValues[3][column]];
        row.reverse();
        [row, moveTemp] = move(row);
        movement = movement || moveTemp;
        blockValues[0][column] = row[3];
        blockValues[1][column] = row[2];
        blockValues[2][column] = row[1];
        blockValues[3][column] = row[0];
    }  
    return movement;  
}

function moveLeft() {
    let movement = false;
    let moveTemp = false;
    for (let row=0; row<4; row++) {
        [blockValues[row], moveTemp] = move(blockValues[row]);
        movement = movement || moveTemp;
    }
    return movement;
}

function moveRight() {
    let movement = false;
    let moveTemp = false;
    for (let row=0; row<4; row++) {
        blockValues[row].reverse();
        [blockValues[row], moveTemp]  = move(blockValues[row]);
        movement = movement || moveTemp;
        blockValues[row].reverse();
    }
    return movement;
}
