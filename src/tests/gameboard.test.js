const Gameboard = require("../Gameboard")

const subscribe = jest.fn()
const notify = jest.fn()

const mockErrorObserver = jest.fn(() => {
  return {
    subscribe,
    notify,
  }
})

//TODO: MAKE TEST TO SEND MESSAGE TO UI TO REGISTER HITS AND MAKE TEST FOR THE HITS OF SHIPS
/**HITS OF SHIPS LOGIC
 * 1- THE UI SENDS A FIRE FROM THE OPPOSITE SIDE
 * 2- WE RUN THE FUNCTION AND CHECK IF THE COORDINATE IS ALREADY HIT
 * 3- WE MARK THE GRID ALREADY HIT/FIRED
 * 4- WE CHECK IF A SHIP IS HIT.
 * 5- WE CHECK IF THERE ARE STILL SHIPS STANDING IF NOT WE CAN CONTINUE REGISTERING HITS OR DECLARE THE WINNER
 */

test("Register a ship hit", () => {
  const gameboard = Gameboard(mockErrorObserver())
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.recieveAttack(0, 0)
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: 0,
    miss: false,
  })
})

test("Register a miss in the board coordinate", () => {
  const gameboard = Gameboard(mockErrorObserver())
  gameboard.recieveAttack(0, 0)
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: null,
    miss: true,
  })
})

test("Place a ship in vertical and horizontal position", () => {
  const gameboard = Gameboard(mockErrorObserver())
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

  expect(notify).not.toBeCalled()
})

test("Check if notify gets called when a ship is already in the board coordinate", () => {
  const gameboard = Gameboard(mockErrorObserver())
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.placeShip(1, 0, gameboard.Orientation.HORIZONTAL)
  expect(notify).toBeCalled()
})

test("place ship at the end x is 9 and observer notify function gets called", () => {
  const gameboard = Gameboard(mockErrorObserver())
  gameboard.placeShip(9, 0, gameboard.Orientation.HORIZONTAL)
  expect(notify).toBeCalled()
})

test("Place a ship and checking its equal to the its length in the board", () => {
  const gameboard = Gameboard(mockErrorObserver())
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
  const gameboard = Gameboard(mockErrorObserver())
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
  const gameboard = Gameboard(mockErrorObserver())
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
  expect(Gameboard(mockErrorObserver()).getCoordinates().length).toBe(10)
  expect(Gameboard(mockErrorObserver()).getCoordinates()[0].length).toBe(10)
})
