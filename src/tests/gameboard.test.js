const Gameboard = require("../Gameboard")
const messages = require("../messages")

const messageObserver = jest.fn(() => {
  return {
    notify: jest.fn(),
  }
})()

// const messages = jest.fn(() => {
//   return {
//     notify: jest.fn(),
//   }
// })()

afterEach(() => jest.clearAllMocks())

//TODO: MAKE TEST TO SEND MESSAGE TO UI TO REGISTER HITS AND MAKE TEST FOR THE HITS OF SHIPS
/**HITS OF SHIPS LOGIC
 * 1- THE UI SENDS A FIRE TO THE OPPOSITE SIDE DONE!
 * 2- WE RUN THE FUNCTION AND CHECK IF THE COORDINATE IS ALREADY HIT DONE!
 * 3- WE MARK THE GRID ALREADY HIT/FIRED DONE!
 * 4- WHEN SHIP IS SUNK WE NOTIFY THE USER
 * 5- WHEN ALL SHIPS ARE SUNKED WE NOTIFY IS WE HAVE WON OR LOST
 */

test("Notify the user when all ships are sunk and declare the winner", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.recieveAttack(0, 0)
  gameboard.recieveAttack(1, 0)

  expect(messageObserver.notify).toHaveBeenNthCalledWith(4, {
    type: "Player",
    message: "Enemy neutralized! We won captain!",
  })
})

test("Notify the user when a ship has sunken", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.recieveAttack(0, 0)
  gameboard.recieveAttack(1, 0)

  // attack observer should be called twice for successful attack and another one for the sunken ship
  expect(messageObserver.notify).toHaveBeenCalledWith({
    message: "We've sunken the enemy Destroyer captain!",
    type: "Player",
  })
})
test("Observer notifies when a coordinate has already been attacked", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.recieveAttack(0, 0) // make the first attack
  gameboard.recieveAttack(0, 0) // repeat the attack in the same coordinate

  expect(messageObserver.notify).toBeCalled()
  // Should be called once only when the first attack is made
  expect(messageObserver.notify).toHaveBeenCalledWith({
    message: "Already fired there please select another coordinate!",
    type: "Error",
  })
})

test("Register a ship hit and observer notifies the user a ship has been hit", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.recieveAttack(0, 0)
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: 0,
    miss: false,
  })

  expect(messageObserver.notify).toHaveBeenCalledWith({
    message: "We've hit an enemy ship captain!",
    type: "Player",
  })
})

test("Register a miss in the board coordinate", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.recieveAttack(0, 0)
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: null,
    miss: true,
  })
  expect(messageObserver.notify).toHaveBeenCalledWith({
    message: "The attack was a MISS captain!",
    type: "Player",
  })
})

test("Place a ship in vertical and horizontal position", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(0, 1, gameboard.Orientation.VERTICAL)
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)

  // First ship position
  expect(gameboard.getCoordinates()[1][0]).toEqual({
    x: 0,
    y: 1,
    ship: 0,
    miss: null,
  })
  expect(gameboard.getCoordinates()[2][0]).toEqual({
    x: 0,
    y: 2,
    ship: 0,
    miss: null,
  })
  // Second ship position
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: 1,
    miss: null,
  })
  expect(gameboard.getCoordinates()[0][1]).toEqual({
    x: 1,
    y: 0,
    ship: 1,
    miss: null,
  })
  expect(gameboard.getCoordinates()[0][2]).toEqual({
    x: 2,
    y: 0,
    ship: 1,
    miss: null,
  })

  expect(messageObserver.notify).not.toBeCalled()
})

test("Check if errorObserver.notify gets called when a ship is already in the board coordinate", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.placeShip(1, 0, gameboard.Orientation.HORIZONTAL)
  expect(messageObserver.notify).toBeCalled()
  expect(messageObserver.notify).toHaveBeenCalledWith({
    type: "Error",
    message: "Ship already in place!",
  })
})

test("place ship at the end x is 9 and observer errorObserver.notify function gets called", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(9, 0, gameboard.Orientation.HORIZONTAL)
  expect(messageObserver.notify).toBeCalled()
  expect(messageObserver.notify).toHaveBeenCalledWith({
    type: "Error",
    message: "Not a valid placement coordinate",
  })
})

test("Place a ship and checking its equal to the its length in the board", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(2, 0, gameboard.Orientation.HORIZONTAL)
  expect(gameboard.getCoordinates()[0][4]).toEqual({
    x: 4,
    y: 0,
    ship: null,
    miss: null,
  })
  expect(gameboard.getCoordinates()[0][3]).toEqual({
    x: 3,
    y: 0,
    ship: 0,
    miss: null,
  })
  expect(gameboard.getCoordinates()[0][2]).toEqual({
    x: 2,
    y: 0,
    ship: 0,
    miss: null,
  })
  expect(gameboard.getCoordinates()[0][1]).toEqual({
    x: 1,
    y: 0,
    ship: null,
    miss: null,
  })
})

test("Place ship in gameboard in vertical position and the y is 0", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(0, 0, gameboard.Orientation.VERTICAL)
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: 0,
    miss: null,
  })
  expect(gameboard.getCoordinates()[1][0]).toEqual({
    x: 0,
    y: 1,
    ship: 0,
    miss: null,
  })
})

test("Place ship in gameboard when the x is 0 and horizontal", () => {
  const gameboard = Gameboard(messageObserver, messages)
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: 0,
    miss: null,
  })
  expect(gameboard.getCoordinates()[0][1]).toEqual({
    x: 1,
    y: 0,
    ship: 0,
    miss: null,
  })
})

test("Gameboard coordinates are 10 in length", () => {
  expect(Gameboard(messageObserver, messages).getCoordinates().length).toBe(10)
  expect(Gameboard(messageObserver, messages).getCoordinates()[0].length).toBe(
    10
  )
})
