import Board from "../Board"

afterEach(() => jest.clearAllMocks())

test("Get the outline with depending on the ship length and orientation  and returns error codes when" +
"the outline goes out of bounds and it renders the outline in a ships place", () => {
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

test("Notify the user when all ships are sunk and declare the winner", () => {
  const gameboard = Board()
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.recieveAttack(0, 0)
  gameboard.recieveAttack(1, 0)

expect(gameboard.allShipsAreSunk()).toBe(true)

})

test("Notify the user when a ship has sunken", () => {
  const gameboard = Board()
  gameboard.placeShip(0, 0)
  gameboard.recieveAttack(0, 0)
  expect(gameboard.recieveAttack(1, 0)).toEqual(gameboard.AttackCodes.SUNK_SHIP)
})
test("Observer notifies when a coordinate has already been attacked", () => {
  const gameboard = Board()
  gameboard.recieveAttack(0, 0) // make the first attack
  expect(gameboard.recieveAttack(0, 0)).toEqual(gameboard.AttackCodes.COORDINATE_ALREADY_FIRED)
})

test("Register a ship hit and observer notifies the user a ship has been hit", () => {
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
  "Each placement returns a array of coordinates to render in ui and makes sure they are register" +
    " in the data board as well",
  () => {
    const gameboard = Board(player)
    // Change the ship to be place to vertical position
    gameboard.updateShipOrientation()
    expect(gameboard.placeShip(0, 1)).toEqual([{"x": 0, "y": 1}, {"x": 0, "y": 2}])
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
  expect(
    Board(
      player
      
    ).getCoordinates().length
  ).toBe(10)
  expect(
    Board(
      player
    ).getCoordinates()[0].length
  ).toBe(10)
})
