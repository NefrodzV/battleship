const Gameboard = require("../Gameboard")

test("Place ship in gameboard", () => {
  const gameboard = Gameboard()
  gameboard.placeShip(0, 0)

  expect(gameboard.getCoordinates()[0][0]).toEqual({ x: 0, y: 0, ship: 0 })
  expect(gameboard.getCoordinates()[0][1]).toEqual({ x: 1, y: 0, ship: 0 })
})

test("Gameboard coordinates are 10 in length", () => {
  expect(Gameboard().getCoordinates().length).toBe(10)
})
