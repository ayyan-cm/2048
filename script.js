/*Todo

1. No movement no new random
2. inside square no new random check 
3. check move down
2. backward
3. reset
4. timout check
4. score
5. game over
6. color
7. animation

*/

const newValues = [2,2,2,2,2,2,4]

var blockValues = [ [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0] ];

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
    for ( let i = 0; i < 4; i++ ) {
        for ( let j = 0; j < 4; j++ ) {
            if ( blockValues[i][j] == 0 ) {
                board.children[i*4+j].textContent = '';
                board.children[i*4+j].style.backgroundColor = 'hsla(9, 14%, 90%, 0.714)';
            } else {
                board.children[i*4+j].textContent = blockValues[i][j];
                //board.children[i*4+j].className = 'card card-'+blockValues[i][j];
                board.children[i*4+j].style.backgroundColor = 'white';
                board.children[i*4+j].style.color = 'black';
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
            if (blockValues[row][column] == 0 && !([2,3].includes(row) && [2,3].includes(column)) ) {
                blockValues[row][column] = newValues[Math.floor(Math.random() * newValues.length)];
                placed = true;
            }
        }
    }
}

function newGame() {
    const gameBoard = document.querySelectorAll('.game-board')[0];
    const startDiv = document.querySelectorAll('.new-game')[0];

    gameBoard.style.display = 'block';
    startDiv.style.display = 'none';

    blockValues = [ [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0] ];
    placeRandom();
    placeCards();

}

document.addEventListener("keyup", function(event) {
    let isBlocksMoved = false;
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

function move(row) { 
    row = row.filter(val => val !== 0);
    movement = false;
    for (let i = 0; i < row.length-1; i++) {
        if (row[i] == row[i+1]) {
            movement = true;
            row[i] = row[i] * 2;
            row[i+1] = 0;
        }
    }

    row.filter(val => val !== 0)
    while (row.length < 4) {
        row.push(0);
    }
    return row,movement;
}

function moveUp() {  
    for (let column=0; column<4; column++) {
        row = [blockValues[0][column], blockValues[1][column], blockValues[2][column], blockValues[3][column]];
        row = move(row);
        blockValues[0][column] = row[0];
        blockValues[1][column] = row[1];
        blockValues[2][column] = row[2];
        blockValues[3][column] = row[3];
    }   
    return movement;
}

function moveDown() {
    for (let column=0; column<4; column++) {
        row = [blockValues[0][column], blockValues[1][column], blockValues[2][column], blockValues[3][column]];
        row.reverse();
        row = move(row);
        blockValues[0][column] = row[3];
        blockValues[1][column] = row[2];
        blockValues[2][column] = row[1];
        blockValues[3][column] = row[0];
    }  
    return movement;  
}

function moveLeft() {
    for (let row=0; row<4; row++) {
        blockValues[row] = move(blockValues[row]);
    }
    return movement;
}

function moveRight() {
    for (let row=0; row<4; row++) {
        blockValues[row].reverse();
        blockValues[row] = move(blockValues[row]);
        blockValues[row].reverse();
    }
    return movement;
}
