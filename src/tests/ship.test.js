import Ship from "../models/Ship"

test("Ship not sunken when hits arent equal to length", () => {
  const ship = Ship("Cruiser", 3)
  expect(ship.isSunk()).toBe(false)
})
test("Ship is sunk when hit are equal or greater than length", () => {
  const ship = Ship("D", 5)
  ship.hit()
  ship.hit()
  ship.hit()
  ship.hit()
  ship.hit()
  ship.hit()

  expect(ship.isSunk()).toBe(true)
})
test("Returns 1 hits", () => {
  const ship = Ship("Destroyer", 2)
  expect(ship.hit()).toBe(1)
})
