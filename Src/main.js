/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-return-assign */
const gamesBoardContainer = document.querySelector('#gamesboard-space');
const option = document.querySelector('.options');
const flipButton = document.querySelector('#flip-button');
const startButton = document.querySelector('#start-button');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn-display');

let angle = 0;
function flip() {
  const optionShips = Array.from(option.children);
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach((optionShip) => optionShip.style.transform = `rotate(${angle}deg)`);
}

flipButton.addEventListener('click', flip);

// Creating Boards
const width = 10;
const height = 10;

function createBoard(color, user) {
  const gameBoardContainer = document.createElement('div');
  gameBoardContainer.classList.add('game-board');
  gameBoardContainer.style.backgroundColor = color;
  gameBoardContainer.id = user;

  for (let i = 0; i < width * height; i += 1) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.id = i;
    gameBoardContainer.append(block);
  }

  gamesBoardContainer.append(gameBoardContainer);
}
createBoard('#301934', 'player');
createBoard('#191970', 'computer');

// Creating Ships
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];
let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  const validStart = isHorizontal ? startIndex <= width * height - ship.length ? startIndex : width * height - ship.length : startIndex <= width * height - width * ship.length ? startIndex : startIndex - ship.length * width + height;

  const shipBlocks = [];

  for (let i = 0; i < ship.length; i += 1) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

  let valid;

  if (isHorizontal) {
    shipBlocks.every((_shipBlock, index) => valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)));
  } else {
    shipBlocks.every((_shipBlock, index) => valid = shipBlocks[0].id < 90 + (width * index + 1));
  }

  const notTaken = shipBlocks.every((shipBlock) => !shipBlock.classList.contains('taken'));

  return { shipBlocks, valid, notTaken };
}

function addShipPiece(user, ship, startId) {
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);
  const randomBoolean = Math.random() < 0.5;
  const isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
  const randomStartIndex = Math.floor(Math.random() * width * height);

  const startIndex = startId ? startId : randomStartIndex;

  const { shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add('taken');
    });
  } else {
    if (user === 'computer') {
      addShipPiece(user, ship, startId);
    }
    if (user === 'player') {
      notDropped = true;
    }
  }
}
ships.forEach((ship) => addShipPiece('computer', ship));

// Drag player ships
let draggedShip;
const optionShips = Array.from(option.children);
optionShips.forEach((optionShip) => optionShip.addEventListener('dragstart', dragStart));

const allPlayerBlocks = document.querySelectorAll('#player div');
allPlayerBlocks.forEach((playerblock) => {
  playerblock.addEventListener('dragover', dragOver);
  playerblock.addEventListener('drop', dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
  const ship = ships[draggedShip.id];
  highlightArea(e.target.id, ship);
}

function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  addShipPiece('player', ship, startId);
  if (!notDropped) {
    draggedShip.remove();
  }
}

// Add highlight
function highlightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll('#player div');
  const isHorizontal = angle === 0;

  const { shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add('hover');
      setTimeout(() => shipBlock.classList.remove('hover'), 500);
    });
  }
}

// Game Logic
let gameOver = false;
let playerTurn;

// Start Game
function startGame() {
  if (playerTurn === undefined) {
    if (option.children.length !== 0) {
      infoDisplay.textContent = 'Please place all your pieces.';
    } else {
      const boardBlocks = document.querySelectorAll('#computer div');
      boardBlocks.forEach((block) => block.addEventListener('click', handleClick));
      playerTurn = true;
      turnDisplay.textContent = 'Your Turn!';
      infoDisplay.textContent = 'The game has started!';
    }
  }
}

startButton.addEventListener('click', startGame);

let playerHits = [];
let computerHits = [];

const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
  if (!gameOver) {
    if (e.target.classList.contains('taken')) {
      e.target.classList.add('boom');
      infoDisplay.textContent = 'You hit the enemies ship!';
      let classes = Array.from(e.target.classList);
      classes = classes.filter((className) => className !== 'block');
      classes = classes.filter((className) => className !== 'boom');
      classes = classes.filter((className) => className !== 'taken');
      playerHits.push(...classes);
      checkScore('player', playerHits, playerSunkShips);
    }
    if (!e.target.classList.contains('taken')) {
      infoDisplay.textContent = 'You missed!';
      e.target.classList.add('empty');
    }
    playerTurn = false;
    const allBoardBlocks = document.querySelectorAll('#computer div');
    allBoardBlocks.forEach((block) => block.replaceWith(block.cloneNode(true)));
    setTimeout(computerGo, 3000);
  }
}

// Creating computers turns
function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = 'Now it\'s the computer\'s turn!';
    infoDisplay.textContent = 'The computer is thinking ...';

    setTimeout(() => {
      const randomChoice = Math.floor(Math.random() * width * height);
      const allBoardBlocks = document.querySelectorAll('#player div');

      if (allBoardBlocks[randomChoice].classList.contains('taken')
      && allBoardBlocks[randomChoice].classList.contains('boom')
      ) {
        computerGo();
      } else if (
        allBoardBlocks[randomChoice].classList.contains('taken')
        && !allBoardBlocks[randomChoice].classList.contains('boom')
      ) {
        allBoardBlocks[randomChoice].classList.add('boom');
        infoDisplay.textContent = 'The computer hit your ship!';
        let classes = Array.from(allBoardBlocks[randomChoice].classList);
        classes = classes.filter((className) => className !== 'block');
        classes = classes.filter((className) => className !== 'boom');
        classes = classes.filter((className) => className !== 'taken');
        computerHits.push(...classes);
        checkScore('computer', computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = 'Nothing was hit this time!';
        allBoardBlocks[randomChoice].classList.add('empty');
      }
    }, 3000);

    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = 'Your turn!';
      infoDisplay.textContent = 'Please take your turn';
      const allBoardBlocks = document.querySelectorAll('#computer div');
      allBoardBlocks.forEach((block) => block.addEventListener('click', handleClick));
    }, 6000);
  }
}

// Check the score
function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((storedShipName) => storedShipName === shipName).length === shipLength
    ) {
      infoDisplay.textContent = `you sunk the their ${shipName}`;
      if (user === 'player') {
        playerHits = userHits.filter((storedShipName) => storedShipName !== shipName);
      }
      if (user === 'computer') {
        computerHits = userHits.filter((storedShipName) => storedShipName !== shipName);
      }
      userSunkShips.push(shipName);
    }
  }

  checkShip('destroyer', 2);
  checkShip('submarine', 3);
  checkShip('cruiser', 3);
  checkShip('battleship', 4);
  checkShip('carrier', 5);

  if (playerSunkShips.length === 5) {
    infoDisplay.textContent = 'You sunk all of the emeny\'s!! You WON!';
    gameOver = true;
  }
  if (computerSunkShips.length === 5) {
    infoDisplay.textContent = 'The enemy sunk all of your ships!! YOU LOST!';
    gameOver = true;
  }
}
