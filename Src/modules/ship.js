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

/**
 * Is the function that uses the constructor for the class of Ship
 * @param {string} name 
 * @param {number} num 
 */
function newShip(name, num) {
  const shipName = name;
  const hitPoints = num;
  const newShip = new Ship(shipName, hitPoints);
  playerShips.push(newShip);
  computerShips.push(newShip);
}

newShip('Carrier', 5);
newShip('Battleship', 4);
newShip('Cruiser', 3);
newShip('Submarine', 3);
newShip('Patrol boat', 2);

console.log(playerShips);
console.log(computerShips);
