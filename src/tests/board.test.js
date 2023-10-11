import Board from "../models/Board"

afterEach(() => jest.clearAllMocks())

test("Returns the outline coordinates and notifies error if the placement will be out of bounds or "+ 
"a ship is already in the way ", () => {
  const gameboard = Board()

  // Returns the outline when there is no ship in place
  expect(gameboard.getOutline(0, 0)).toEqual([{"x": 0, "y": 0}, {"x": 1, "y": 0}])

  // After placing a ship it should return error object it return the outline
  gameboard.placeShip(2,0)
  expect(gameboard.getOutline(2,0)).toEqual({
       errorCode: gameboard.ErrorCodes.INVALID_PLACEMENT,
       arr: [
          {
           "x": 2,
           "y": 0,
         },
          {
           "x": 3,
           "y": 0,
         },
          {
           "x": 4,
           "y": 0,
         },
       ],
     })
  
})

test("Notifies when all ships in a board have sunk", () => {
  const gameboard = Board()
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.recieveAttack(0, 0)
  gameboard.recieveAttack(1, 0)

expect(gameboard.allShipsAreSunk()).toBe(true)

})

test("Notifies when a ship has sunk", () => {
  const gameboard = Board()
  gameboard.placeShip(0, 0)
  gameboard.recieveAttack(0, 0)
  expect(gameboard.recieveAttack(1, 0)).toEqual(gameboard.AttackCodes.SUNK_SHIP)
})
test("ONotifies when a coordinate has already been attacked", () => {
  const gameboard = Board()
  gameboard.recieveAttack(0, 0) // make the first attack
  expect(gameboard.recieveAttack(0, 0)).toEqual(gameboard.AttackCodes.COORDINATE_ALREADY_FIRED)
})

test("Notifies whe a ship is hit", () => {
  const gameboard = Board()
  gameboard.placeShip(0, 0)
  expect(gameboard.recieveAttack(0, 0)).toEqual(gameboard.AttackCodes.HIT)
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: 0,
    miss: false,
  })
})

test("Register a miss in the board coordinate", () => {
  const gameboard = Board()
  expect(gameboard.recieveAttack(0, 0)).toEqual(gameboard.AttackCodes.MISSED_ATTACK)
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: null,
    miss: true,
  })
})



test(
  "Returns the coordinates for the ship to be placed and the next ship in line to be placed",
  () => {
    const gameboard = Board()
    // Change the ship to be place to vertical position
    gameboard.updateShipOrientation()
    // Check it return the next ship to be placed correctly
    expect(gameboard.getNextShipToPlace()).toBe("Destroyer")
    expect(gameboard.placeShip(0, 1)).toEqual([{"x": 0, "y": 1}, {"x": 0, "y": 2}])
    expect(gameboard.getNextShipToPlace()).toBe("Submarine")
    gameboard.updateShipOrientation()

    expect(gameboard.placeShip(0, 0)).toEqual([{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}])

    // First ship position in the board
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
    // Second ship position in the board
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
  }
)

test("Returns error object when ship is already in the coordinate", () => {
  const gameboard = Board()
  gameboard.placeShip(0, 0)
  expect(gameboard.placeShip(1, 0)).toEqual(gameboard.ErrorCodes.SHIP_ALREADY_IN_PLACE) 
  
})

test("Returns error object when a ship will be place out of bounds", () => {
  const gameboard = Board()
  expect(gameboard.placeShip(9, 0)).toEqual(gameboard.ErrorCodes.INVALID_PLACEMENT)
  
})

test("Place a ship and checking its equal to the its length in the board", () => {
  const gameboard = Board()
  gameboard.placeShip(2, 0)
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
  const gameboard = Board()

  gameboard.updateShipOrientation()
  gameboard.placeShip(0, 0)

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
  const gameboard = Board()
  gameboard.placeShip(0, 0)
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
  expect(Board().getCoordinates().length).toBe(10)
  expect(Board().getCoordinates()[0].length).toBe(10)
})
