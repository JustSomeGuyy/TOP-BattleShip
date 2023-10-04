/* eslint-disable no-undef */
const Ship = require('./ship');

describe('ship', () => {
  it('Should build a ship based on the constructor function', () => {
    const shipDetails = new Ship('Destroyer', 5);

    expect(shipDetails.name).toBe('Destroyer');
    expect(shipDetails.hitPoints).toBe(5);
    expect(shipDetails.hits).toBe(0);
    expect(shipDetails.isSunk).toBe(false);
  });
});

const { gotHit } = require('./ship');

describe('gotHit', () => {
  let playerShips;

  beforeEach(() => {
    // Initialize or reset playerShips before each test
    playerShips = [
      { hits: 0, hitPoints: 3, isSunk: false },
      { hits: 0, hitPoints: 2, isSunk: false },
    ];
  });

  it('should increment hits when hits are less than hit points', () => {
    gotHit(0);
    expect(playerShips[0].hits).toBe(1);
  });

  it('should sink the ship when hits match hit points', () => {
    gotHit(1); // Ship with 0 hits and 2 hit points
    gotHit(1); // Ship with 1 hit and 2 hit points
    expect(playerShips[1].isSunk).toBe(true);
  });

  it('should not increment hits when hits exceed hit points', () => {
    gotHit(0); // Ship with 0 hits and 3 hit points
    gotHit(0); // Ship with 1 hit and 3 hit points
    gotHit(0); // Ship with 2 hits and 3 hit points
    gotHit(0); // Ship with 3 hits and 3 hit points
    gotHit(0); // Attempt to hit again (should not increment hits)
    expect(playerShips[0].hits).toBe(3);
  });
});
