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

test.skip('Should be able to build a ship using the constructor for the class.', () => {

})

describe.skip('hit', () => {
    it('Should increase the number of hits when the function it called by one.', () => {
        
    })
})