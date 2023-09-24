const Gameboard = require("../Gameboard")

test("place ship at the end x is 9", () => {
  const gameboard = Gameboard()
  gameboard.placeShip(9, 0, gameboard.Orientation.HORIZONTAL)
  expect(gameboard.getCoordinates()[0][9]).toEqual({ x: 9, y: 0, ship: 0 })
})

test("Place ship in gameboard in vertical position and the y is 0", () => {
  const gameboard = Gameboard()
  gameboard.placeShip(0, 0, gameboard.Orientation.VERTICAL)

  expect(gameboard.getCoordinates()[0][0]).toEqual({ x: 0, y: 0, ship: 0 })
  expect(gameboard.getCoordinates()[0][1]).toEqual({ x: 0, y: 1, ship: 0 })
})

test("Place ship in gameboard when the x is 0 and horizontal", () => {
  const gameboard = Gameboard()
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)

  expect(gameboard.getCoordinates()[0][0]).toEqual({ x: 0, y: 0, ship: 0 })
  expect(gameboard.getCoordinates()[0][1]).toEqual({ x: 1, y: 0, ship: 0 })
})

test("Gameboard coordinates are 10 in length", () => {
  expect(Gameboard().getCoordinates().length).toBe(10)
})
