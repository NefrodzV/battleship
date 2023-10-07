import { PlayerType } from "./PlayerType"
import Ship from "./Ship"

// TODO  Remove parameters that are unneed messages and all the observers
export default function Board(
  player,
  messageObserver,
  placementObserver,
  hitObserver,
  sunkenObserver
) {
  const COLS = 10
  const ROWS = 10

  // Class that has the orientation parameters of  how the ships will be placed
  const Orientation = {
    VERTICAL: "Vertical",
    HORIZONTAL: "Horizontal",
  }

  const Status = {
    ERROR: false,
    OK: true,
  }

  const MessageType = {
    ERROR: "error",
    OK: "ok",
  }
  // Available ships to place length
  const availableShips = [
    { name: "Destroyer", length: 2 },
    { name: "Submarine", length: 3 },
    { name: "Cruiser", length: 3 },
    { name: "Battleship", length: 4 },
    { name: "Carrier", length: 5 },
  ]
  const ships = []

  let coordinates = []

  let isDropping = player.isHuman() ? true : false
  let shipOrientation = Orientation.HORIZONTAL

  // By default the board will be done with Horizontal
  const createCoordinates = (() => {
    for (let y = 0; y < ROWS; y++) {
      // Setting empty array for each row
      coordinates.push([])
      for (let x = 0; x < COLS; x++) {
        coordinates[y].push({ x, y, ship: null, miss: null })
      }
    }
  })()

  const areEqual = (shipOrientation, correctOrientation) => {
    return shipOrientation === correctOrientation
  }

  const isShipInPlace = (x, y) => {
    const length = availableShips.at(0).length
    let spaceTaken = null

    switch (shipOrientation) {
      case Orientation.HORIZONTAL:
        for (let i = 0; i < length; i++) {
          const shipPointer = coordinates[y][x + i].ship
          if (shipPointer !== null) {
            spaceTaken = true
            break
          }
        }
        break

      case Orientation.VERTICAL:
        for (let i = 0; i < length; i++) {
          const shipPointer = coordinates[y + i][x].ship
          if (shipPointer !== null) {
            spaceTaken = true
            break
          }
        }
        break

      default:
        console.log(
          "UH OH something went wrong checking the space of ship in place"
        )
    }

    return spaceTaken
  }
  const isValidPlacement = (x, y) => {
    const length = availableShips.at(0).length // The first one

    if (areEqual(shipOrientation, Orientation.HORIZONTAL)) {
      const futurePosition = x + length - 1
      console.log(futurePosition)
      if (futurePosition < 10) return true
      return false
    }

    if (areEqual(shipOrientation, Orientation.VERTICAL)) {
      const futurePosition = y + length - 1
      console.log(futurePosition)
      if (futurePosition < 10) return true
      return false
    }
  }

  const allShipsAreSunk = () => {
    const areSunk = ships.every((ship) => ship.isSunk() === true)

    if (areSunk) {
      if (player.type === PlayerType.COMPUTER) {
        messageObserver.notify(messages.PLAYER_WINS_MESSAGE)
      } else {
        messageObserver.notify(messages.COMPUTER_WINS_MESSAGE)
      }
    }
  }

  const registerShipHit = (pointer) => {
    const ship = ships[pointer]
    ship.hit()

    // if (ship.isSunk()) {
    //   // If this is the computer board
    //   if (player.type === PlayerType.COMPUTER) {
    //     // messageObserver.notify(
    //     //   messages.PLAYER_SUNKEN_ENEMY_SHIP_MESSAGE(ship.getName())
    //     // )
    //   } else {
    //     // messageObserver.notify(
    //     //   messages.ENEMY_SUNKEN_PLAYER_SHIP_MESSAGE(ship.getName())
    //     // )
    //   }
    //   // sunkenObserver.notify(pointer)
    //   allShipsAreSunk()
    // }
  }

  return {
    getCoordinates() {
      return coordinates
    },

    Orientation,

    placeShip(x, y) {
      // If the placement goes out of bounds stop and notify user
      if (!isValidPlacement(x, y)) {
        return {
          status: Status.ERROR,
          type: MessageType.ERROR,
          msg: "Invalid placement",
        }
      }

      // If there is a ship already in place stop and notify user
      if (isShipInPlace(x, y)) {
        return {
          status: Status.ERROR,
          type: MessageType.ERROR,
          msg: "Ship already in place",
        }
      }

      // If any of the flag code before does not run we place the ship
      const obj = availableShips.splice(0, 1)[0]
      const ship = Ship(obj.name, obj.length)
      ships.push(ship)
      const shipPointer = ships.length - 1

      // Coordinates to return to render in the ui
      const squares = []

      // When Y is always the same but X isnt. Sets the ship in the x coordinates
      if (shipOrientation === Orientation.HORIZONTAL) {
        for (let i = 0; i < obj.length; i++) {
          const currentX = x + i
          coordinates[y][currentX].ship = shipPointer
          squares.push({ x: currentX, y: y })
        }
      }
      // When X is always the same but Y isnt. Sets the ship in the y coordinates
      if (shipOrientation === Orientation.VERTICAL) {
        for (let i = 0; i < obj.length; i++) {
          const currentY = y + i
          coordinates[currentY][x].ship = shipPointer
          squares.push({ x: x, y: currentY })
        }
      }
      return { status: Status.OK, squares }
    },

    recieveAttack(x, y) {
      const MISS_CLR = "miss"
      const HIT_CLR = "hit"
      const SUNKEN_CLR = "sunk"

      const coordinate = coordinates[y][x]
      // If this property is not null there is either a hit or miss COORDINATE HAS ALREADY BEEN ATTACKED
      if (coordinate.miss !== null) {
        // messageObserver.notify(messages.ALREADY_FIRED_COORDINATE_MESSAGE)
        return {
          status: Status.ERROR,
          type: MessageType.ERROR,
          msg: "Coordinate already fired!",
        }
      }
      if (coordinate.ship === null) {
        // Need to update to send updates to the ui right here when a miss occurs
        coordinate.miss = true
        // if (player.type === PlayerType.COMPUTER) {
        //   // messageObserver.notify(messages.PLAYER_MISS_MESSAGE)
        // }
        // TODO : Implement what so send to the ui when ship is not in the coordinate
        return { status: Status.OK, render: MISS_CLR }
      }
      // Need to send updates to the ui right here when a hit occurs
      coordinate.miss = false

      // TODO: Implement the data to be returned to the ui when a ship is hit
      const ship = ships[pointer]
      ship.hit()
      if (ship.isSunk()) {
        return { status: Status.OK, render: SUNKEN_CLR }
      }
      registerShipHit(coordinate.ship)

      // {status: Status.OK , render: HIT_CLR}

      // hitObserver.notify({ x, y })
    },
    getPlayer() {
      return player
    },

    getOutline(x, y) {
      const MAX = 9
      const ERROR_CLR = "red"
      const OUTLINE_CLR = "black"

      let currentColor = OUTLINE_CLR
      const shipLength = availableShips.at(0).length
      const squares = []
      if (shipOrientation === Orientation.HORIZONTAL) {
        for (let i = 0; i < shipLength; i++) {
          const currentX = x + i
          if (currentX > 9) {
            currentColor = ERROR_CLR
            break
          }
          squares.push({ x: currentX, y: y })
        }
      } else if (shipOrientation === Orientation.VERTICAL) {
        for (let i = 0; i < shipLength; i++) {
          const currentY = y + i
          if (currentY > MAX) {
            currentColor = ERROR_CLR
            break
          }
          squares.push({ x: x, y: currentY })
        }
      }

      return { coordinates: squares, clr: currentColor }
    },

    isPlacingShips() {
      return isDropping
    },

    updateShipOrientation() {
      if (shipOrientation === Orientation.HORIZONTAL) {
        shipOrientation = Orientation.VERTICAL
        return shipOrientation
      }
      shipOrientation = Orientation.HORIZONTAL
      return shipOrientation
    },
    shipHasSunk(ship) {
      if (ship.isSunk()) {
        return
      }

      return null
    },
  }
}
