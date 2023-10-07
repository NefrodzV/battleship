import Board from "../Board"
import { messages } from "../messages"
import { PlayerType } from "../PlayerType"
import Player from "../Player"
const messageObserver = jest.fn(() => {
  return {
    notify: jest.fn(),
  }
})()

const hitObserver = jest.fn(() => {
  return {
    notify: jest.fn(),
  }
})()

const placementObserver = jest.fn(() => {
  return {
    notify: jest.fn(),
  }
})()

const sunkenObserver = jest.fn(() => {
  return {
    notify: jest.fn(),
  }
})()

const player = Player("AI", PlayerType.COMPUTER)

afterEach(() => jest.clearAllMocks())

test("Get the outline with depending on the ship length and orientation", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver,
    sunkenObserver
  )
  expect(gameboard.getOutline(0, 0, gameboard.Orientation.HORIZONTAL)).toEqual({
    coordinates: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 1,
        y: 0,
      },
    ],
    clr: "black",
  })
})

test("Notify the user when all ships are sunk and declare the winner", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver,
    sunkenObserver
  )
  gameboard.placeShip(0, 0, gameboard.Orientation.HORIZONTAL)
  gameboard.recieveAttack(0, 0)
  gameboard.recieveAttack(1, 0)

  expect(messageObserver.notify).toHaveBeenNthCalledWith(4, {
    type: "Player",
    message: "Enemy neutralized! We won captain!",
  })
})

test("Notify the user when a ship has sunken", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver,
    sunkenObserver
  )
  gameboard.placeShip(0, 0)
  gameboard.recieveAttack(0, 0)
  gameboard.recieveAttack(1, 0)

  // attack observer should be called twice for successful attack and another one for the sunken ship
  expect(messageObserver.notify).toHaveBeenCalledWith({
    message: "We've sunken the enemy Destroyer captain!",
    type: "Player",
  })
  expect(sunkenObserver.notify).toBeCalled()
})
test("Observer notifies when a coordinate has already been attacked", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver
  )
  gameboard.recieveAttack(0, 0) // make the first attack
  gameboard.recieveAttack(0, 0) // repeat the attack in the same coordinate

  expect(messageObserver.notify).toBeCalled()
  // Should be called once only when the first attack is made
  expect(messageObserver.notify).toHaveBeenCalledWith({
    message: "Already fired there, please select another coordinate!",
    type: "Error",
  })
})

test.only("Register a ship hit and observer notifies the user a ship has been hit", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver
  )
  gameboard.placeShip(0, 0)
  expect(gameboard.recieveAttack(0, 0)).toEqual({})
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: 0,
    miss: false,
  })

  // expect(messageObserver.notify).toHaveBeenCalledWith({
  //   message: "We've hit an enemy ship captain!",
  //   type: "Player",
  // })
  // expect(hitObserver.notify).toBeCalled()
})

test("Register a miss in the board coordinate", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver
  )
  expect(gameboard.recieveAttack(0, 0)).toEqual({})
  expect(gameboard.getCoordinates()[0][0]).toEqual({
    x: 0,
    y: 0,
    ship: null,
    miss: true,
  })
  // expect(messageObserver.notify).toHaveBeenCalledWith({
  //   message: "The attack was a MISS captain!",
  //   type: "Player",
  // })
})

test(
  "Each placement returns a array of coordinates to render in ui and makes sure they are register" +
    " in the data board as well",
  () => {
    const gameboard = Board(
      player,
      messages,
      messageObserver,
      placementObserver,
      hitObserver
    )
    // Change the ship to be place to vertical position
    gameboard.updateShipOrientation()
    expect(gameboard.placeShip(0, 1)).toEqual([
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ])
    gameboard.updateShipOrientation()

    expect(gameboard.placeShip(0, 0)).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ])

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
    // expect(placementObserver.notify).toBeCalled()
    // expect(messageObserver.notify).not.toBeCalled()
  }
)

test("Returns error object when ship is already in the coordinate", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver
  )
  gameboard.placeShip(0, 0)
  expect(gameboard.placeShip(1, 0)).toEqual({
    msg: "Ship already in place",
    status: false,
    type: "error",
  }) // expect(messageObserver.notify).toBeCalled()
  // expect(messageObserver.notify).toHaveBeenCalledWith({
  //   type: "Error",
  //   message: "Ship already in place!",
  // })
})

test("Returns error object when a ship will be place out of bounds", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver
  )
  expect(gameboard.placeShip(9, 0)).toEqual({
    msg: "Invalid placement",
    status: false,
    type: "error",
  })
  // expect(messageObserver.notify).toBeCalled()
  // expect(messageObserver.notify).toHaveBeenCalledWith({
  //   type: "Error",
  //   message: "Not a valid placement coordinate",
  // })
})

test("Place a ship and checking its equal to the its length in the board", () => {
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver
  )
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
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver
  )

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
  const gameboard = Board(
    player,
    messages,
    messageObserver,
    placementObserver,
    hitObserver
  )
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
      player,
      messages,
      messageObserver,
      placementObserver,
      hitObserver,
      sunkenObserver
    ).getCoordinates().length
  ).toBe(10)
  expect(
    Board(
      player,
      messages,
      messageObserver,
      placementObserver,
      hitObserver,
      sunkenObserver
    ).getCoordinates()[0].length
  ).toBe(10)
})
