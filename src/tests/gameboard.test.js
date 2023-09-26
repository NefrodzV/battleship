const Gameboard = require("../Gameboard")

const subscribe = jest.fn()
const notify = jest.fn()

const mockObserver = jest.fn(() => {
  return {
    subscribe,
    notify,
  }
})

test("Place a ship and checking its equal to the its length in the board", () => {
  const gameboard = Gameboard(mockObserver())
  gameboard.placeShip(2, 0, gameboard.Orientation.HORIZONTAL)
  expect(gameboard.getCoordinates()[0][4]).toEqual({ x: 4, y: 0, ship: null })
  expect(gameboard.getCoordinates()[0][3]).toEqual({ x: 3, y: 0, ship: 0 })
  expect(gameboard.getCoordinates()[0][2]).toEqual({ x: 2, y: 0, ship: 0 })
  expect(gameboard.getCoordinates()[0][1]).toEqual({ x: 1, y: 0, ship: null })
})
test("Place a ship when its not in the edge of the board", () => {
  const gameboard = Gameboard(mockObserver())
  gameboard.placeShip(1, 0, gameboard.Orientation.HORIZONTAL)
  expect(gameboard.getCoordinates()[0][1]).toEqual({ x: 1, y: 0, ship: 0 })
  expect(gameboard.getCoordinates()[0][2]).toEqual({ x: 2, y: 0, ship: 0 })
})

test("place ship at the end x is 9 and observer notify function gets called", () => {
  const gameboard = Gameboard(mockObserver())
  gameboard.placeShip(9, 0, gameboard.Orientation.HORIZONTAL)
  expect(notify).toBeCalled()
})

test("Place ship in gameboard in vertical position and the y is 0", () => {
  const gameboard = Gameboard(mockObserver())
  gameboard.placeShip(0, 0, gameboard.Orientation.VERTICAL)

  expect(gameboard.getCoordinates()[0][0]).toEqual({ x: 0, y: 0, ship: 0 })
  expect(gameboard.getCoordinates()[0][1]).toEqual({ x: 0, y: 1, ship: 0 })
})

test("Place ship in gameboard when the x is 0 and horizontal", () => {
  const gameboard = Gameboard(mockObserver())
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)

  expect(gameboard.getCoordinates()[0][0]).toEqual({ x: 0, y: 0, ship: 0 })
  expect(gameboard.getCoordinates()[0][1]).toEqual({ x: 1, y: 0, ship: 0 })
})

test("Gameboard coordinates are 10 in length", () => {
  expect(Gameboard(mockObserver()).getCoordinates().length).toBe(10)
})
