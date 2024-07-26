/*Todo

1. color ✔️
2. game over✔️
3. previous var updates ✔️
4. won ✔️
5. Sound
6. Animation
*/
var score = 0;
var scoreTemp = 0;
var won = false;
var blockValues = Array.from({ length: 4 }, () => Array(4).fill(0));
var previousScore = score;
var previousBlockValues = JSON.parse(JSON.stringify(blockValues));

const board = document.getElementById("board");
const gameBoard = document.querySelector(".game-board");
const startDiv = document.querySelector(".new-game.start");
const gameOverDiv = document.querySelector(".result.over");
const wonDiv = document.querySelector(".result.won");

window.onload = async function () {
  for (let i = 0; i < 16; i++) {
    let card = document.createElement("div");
    card.className = "card";
    board.appendChild(card);
  }
};

function isFull() {
  return blockValues.flat().every((val) => val !== 0);
}

function canMove() {
  let i = 0;
  let j = 0;
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      if (i !== 3 && blockValues[i][j] === blockValues[i + 1][j]) return true;
      if (j !== 3 && blockValues[i][j] === blockValues[i][j + 1]) return true;
    }
  }
  return false;
}

async function setTile(row, col, value) {
  const card = board.children[row * 4 + col];
  card.textContent = value === 0 ? "" : value;
  card.className = "card";
  card.classList.add(`x${value}`);
}

async function placeCards() {
  const scoreCard = document.getElementById("score");
  scoreCard.textContent = score;

  let isWon = false;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      await setTile(i, j, blockValues[i][j]);
      if (blockValues[i][j] === 2048) isWon = true;
    }
  }

  if (isWon && !won) {
    wonDiv.style.display = "flex";
    won = true;
  }
}

async function placeRandom() {
  let placed = false;
  while (!placed) {
    let row = Math.floor(Math.random() * 4);
    let column = Math.floor(Math.random() * 4);
    if (
      blockValues[row][column] == 0 &&
      !([2, 1].includes(row) && [2, 1].includes(column))
    ) {
      blockValues[row][column] = Math.random() < 0.9 ? 2 : 4;
      setTile(row, column, blockValues[row][column]);
      placed = true;
    }
  }

  if (isFull() && !canMove()) {
    gameOverDiv.style.display = "flex";
  }
}

async function newGame() {
  gameBoard.style.display = "block";
  startDiv.style.display = "none";
  gameOverDiv.style.display = "none";
  wonDiv.style.display = "none";

  score = 0;
  blockValues = Array.from({ length: 4 }, () => Array(4).fill(0));

  await placeRandom();
  await placeRandom();
  await placeCards();
}

function continueGame() {
  wonDiv.style.display = "none";
}

async function previousState() {
  gameOverDiv.style.display = "none";
  wonDiv.style.display = "none";
  score = previousScore;
  blockValues = JSON.parse(JSON.stringify(previousBlockValues));
  await placeCards();
}

function move(row) {
  row = row.filter((val) => val !== 0);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      scoreTemp += row[i];
    }
  }
  row = row.filter((val) => val !== 0);
  while (row.length < 4) row.push(0);
  return row;
}

function moveUp(blockValuesTemp) {
  for (let col = 0; col < 4; col++) {
    let colArray = [
      blockValuesTemp[0][col],
      blockValuesTemp[1][col],
      blockValuesTemp[2][col],
      blockValuesTemp[3][col],
    ];
    colArray = move(colArray);
    for (let row = 0; row < 4; row++) {
      blockValuesTemp[row][col] = colArray[row];
    }
  }
  return blockValuesTemp;
}

function moveDown(blockValuesTemp) {
  for (let col = 0; col < 4; col++) {
    let colArray = [
      blockValuesTemp[0][col],
      blockValuesTemp[1][col],
      blockValuesTemp[2][col],
      blockValuesTemp[3][col],
    ].reverse();
    colArray = move(colArray);
    for (let row = 0; row < 4; row++) {
      blockValuesTemp[row][col] = colArray[3 - row];
    }
  }
  return blockValuesTemp;
}

function moveLeft(blockValuesTemp) {
  for (let row = 0; row < 4; row++) {
    blockValuesTemp[row] = move(blockValuesTemp[row]);
  }
  return blockValuesTemp;
}

function moveRight(blockValuesTemp) {
  for (let row = 0; row < 4; row++) {
    blockValuesTemp[row] = move(blockValuesTemp[row].reverse()).reverse();
  }
  return blockValuesTemp;
}

function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

document.addEventListener("keyup", async function (event) {
  let newBlockValues = JSON.parse(JSON.stringify(blockValues));
  scoreTemp = score;

  switch (event.key) {
    case "w":
    case "ArrowUp":
      newBlockValues = moveUp(newBlockValues);
      break;
    case "s":
    case "ArrowDown":
      newBlockValues = moveDown(newBlockValues);
      break;
    case "a":
    case "ArrowLeft":
      newBlockValues = moveLeft(newBlockValues);
      break;
    case "d":
    case "ArrowRight":
      newBlockValues = moveRight(newBlockValues);
      break;
  }

  if (!arraysEqual(newBlockValues, blockValues)) {
    previousBlockValues = JSON.parse(JSON.stringify(blockValues));
    previousScore = score;
    score = scoreTemp;
    blockValues = JSON.parse(JSON.stringify(newBlockValues));
    await placeRandom();
    await placeCards();
  }
});

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

document.addEventListener("touchstart", function (event) {
  touchstartX = event.touches[0].clientX;
  touchstartY = event.touches[0].clientY;
});

document.addEventListener("touchend", async function (event) {
  touchendX = event.changedTouches[0].clientX;
  touchendY = event.changedTouches[0].clientY;
  await handleSwipe();
});

async function handleSwipe() {
  const deltaX = touchendX - touchstartX;
  const deltaY = touchendY - touchstartY;

  scoreTemp = score;

  if (Math.abs(deltaX) < 40 && Math.abs(deltaY) < 40) return;

  let newBlockValues = JSON.parse(JSON.stringify(blockValues));

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    newBlockValues =
      deltaX > 40 ? moveRight(newBlockValues) : moveLeft(newBlockValues);
  } else {
    newBlockValues =
      deltaY > 40 ? moveDown(newBlockValues) : moveUp(newBlockValues);
  }

  if (!arraysEqual(newBlockValues, blockValues)) {
    previousBlockValues = JSON.parse(JSON.stringify(blockValues));
    previousScore = score;
    score = scoreTemp;
    blockValues = JSON.parse(JSON.stringify(newBlockValues));
    await placeRandom();
    await placeCards();
  }
}
