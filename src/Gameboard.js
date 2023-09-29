/** TODOS:
 * 1 - Should be placeable  to place ships in a board coordinate
 * 2 - Have a attack function  that determines whether a ship was hit or not.
 * 3 - have the correct ship be attacked when hit or marked the coordinates as already shot
 * 4 - Keep track of the missed shots so tehy can be properly rendered
 * 5 - Report whether  all the ships have been sunked or not
 */
const Ship = require("./Ship")

function Gameboard(messageObserver, messages) {
  const COLS = 10
  const ROWS = 10

  // const messages = {
  //   INCORRECT_PLACEMENT_MESSAGE: {
  //     type: "Error",
  //     message: "Not a valid placement coordinate",
  //   },
  // }

  const SHIP_ALREADY_IN_PLACE_MESSAGE = "Ship already in place"
  const ALREADY_FIRED_COORDINATE_MESSAGE =
    "Already fired there please select another"
  const MISS_MESSAGE = "The attack was a miss!"
  const HIT_MESSAGE = "We've hit an enemy ship"
  const SUNKEN_SHIP_MESSAGE = "We've sunken a ship!"

  // Class that has the orientation parameters of  how the ships will be placed
  const Orientation = {
    VERTICAL: "Vertical",
    HORIZONTAL: "Horizontal",
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

  const isShipInPlace = (x, y, shipOrientation) => {
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
  const isValidPlacement = (x, y, shipOrientation) => {
    const length = availableShips.at(0).length // The first one

    if (areEqual(shipOrientation, Orientation.HORIZONTAL)) {
      const futurePosition = x + length
      if (futurePosition < 10) return true
      return false
    }

    if (areEqual(shipOrientation, Orientation.VERTICAL)) {
      const futurePosition = y + length
      if (futurePosition < 10) return true
      return false
    }
  }

  const registerShipHit = (pointer) => {
    const ship = ships[pointer]
    ship.hit()

    if (ship.isSunk()) {
      messageObserver.notify(messages.SUNKEN_SHIP_MESSAGE(ship.getName()))
    }
  }

  return {
    getCoordinates() {
      return coordinates
    },

    Orientation,

    placeShip(x, y, shipOrientation) {
      // If the placement goes out of bounds stop and notify user
      if (!isValidPlacement(x, y, shipOrientation)) {
        messageObserver.notify(messages.INCORRECT_PLACEMENT_MESSAGE)
        return
      }

      // If there is a ship already in place stop and notify user
      if (isShipInPlace(x, y, shipOrientation)) {
        messageObserver.notify(messages.SHIP_ALREADY_IN_PLACE_MESSAGE)
        return
      }

      // If any of the flag code before does not run we place the ship
      const obj = availableShips.splice(0, 1)[0]
      const ship = Ship(obj.name, obj.length)
      ships.push(ship)
      const shipPointer = ships.length - 1
      console.log(obj)

      // When Y is always the same but X isnt. Sets the ship in the x coordinates
      if (shipOrientation === Orientation.HORIZONTAL) {
        for (let i = 0; i < obj.length; i++) {
          coordinates[y][x + i].ship = shipPointer
        }
      }
      // When X is always the same but Y isnt. Sets the ship in the y coordinates
      if (shipOrientation === Orientation.VERTICAL) {
        for (let i = 0; i < obj.length; i++) {
          coordinates[y + i][x].ship = shipPointer
        }
      }
    },

    recieveAttack(x, y) {
      const coordinate = coordinates[y][x]
      // If this property is not null there is either a hit or miss COORDINATE HAS ALREADY BEEN ATTACKED
      if (coordinate.miss !== null) {
        messageObserver.notify(messages.ALREADY_FIRED_COORDINATE_MESSAGE)
        return
      }
      if (coordinate.ship === null) {
        // Need to update to send updates to the ui right here when a miss occurs
        coordinate.miss = true
        messageObserver.notify(messages.MISS_MESSAGE)
        return
      }
      // Need to send updates to the ui right here when a hit occurs
      coordinate.miss = false
      messageObserver.notify(messages.HIT_MESSAGE)
      registerShipHit(coordinate.ship)
    },
  }
}

module.exports = Gameboard
