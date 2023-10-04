class Ship {
  constructor(name, hitPoints) {
    this.name = name;
    this.hitPoints = hitPoints;
    this.hits = 0;
    this.isSunk = false;
  }
}

const playerShips = [];
const computerShips = [];

module.exports = Ship;

const shipNames = ['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Patrol boat'];
const shipLengths = [5, 4, 3, 3, 2];

/** This for loop is for creating the for the game and adding it to both the player and computer */
for (let i = 0; i < shipNames.length; i += 1) {
  const buildShip = new Ship(shipNames[i], shipLengths[i]);
  playerShips.push(buildShip);
  computerShips.push(buildShip);
}

function gotHit(num) {
  if (playerShips[num].hits <= playerShips[num].hitPoints) {
    playerShips[num].hits ++;
    if (playerShips[num].hits === playerShips[num].hitPoints) {
      playerShips[num].isSunk = true;
    }
  }
}

module.exports = gotHit();
