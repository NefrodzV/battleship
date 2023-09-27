/** TODOS:
 * 1 - Should be placeable  to place ships in a board coordinate
 * 2 - Have a attack function  that determines whether a ship was hit or not.
 * 3 - have the correct ship be attacked when hit or marked the coordinates as already shot
 * 4 - Keep track of the missed shots so tehy can be properly rendered
 * 5 - Report whether  all the ships have been sunked or not
 */
const Ship = require("./Ship")
function Gameboard(observer) {
  const COLS = 10
  const ROWS = 10

  const INCORRECT_PLACEMENT_MESSAGE = "Not a valid placement coordinate"
  const SHIP_ALREADY_IN_PLACE_MESSAGE = "Ship already in place"

  // Class that has the orientation parameters of  how the ships will be placed
  const Orientation = {
    VERTICAL: "Vertical", // Sets the board array to columns
    HORIZONTAL: "Horizontal", // Sets the board array to be rows
  }
  // Available ships to place length
  const availableShips = [2, 3, 3, 4, 5]
  const ships = []

  // let coordinatesOrientation = Orientation.HORIZONTAL
  let coordinates = []

  // By default the board will be done with Horizontal
  const createCoordinates = (() => {
    for (let y = 0; y < ROWS; y++) {
      // Setting empty array for each row
      coordinates.push([])
      for (let x = 0; x < COLS; x++) {
        coordinates[y].push({ x, y, ship: null })
      }
    }
  })()

  const areEqual = (shipOrientation, correctOrientation) => {
    return shipOrientation === correctOrientation
  }

  const isShipInPlace = (x, y, shipOrientation) => {
    const length = availableShips.at(0)
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
    const length = availableShips.at(0) // The first one

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

  return {
    getCoordinates() {
      return coordinates
    },

    Orientation,

    placeShip(x, y, shipOrientation) {
      // If the placement goes out of bounds stop and notify user
      if (!isValidPlacement(x, y, shipOrientation)) {
        errorObserver.notify(INCORRECT_PLACEMENT_MESSAGE)
        return
      }

      // If there is a ship already in place stop and notify user
      if (isShipInPlace(x, y, shipOrientation)) {
        errorObserver.notify(SHIP_ALREADY_IN_PLACE_MESSAGE)
        return
      }

      // If any of the flag code before does not run we place the ship
      const length = availableShips.splice(0, 1)
      const ship = Ship(length)
      ships.push(ship)
      const shipPointer = ships.length - 1

      // When Y is always the same but X isnt. Sets the ship in the x coordinates
      if (shipOrientation === Orientation.HORIZONTAL) {
        for (let i = 0; i < length; i++) {
          coordinates[y][x + i].ship = shipPointer
        }
      }
      // When X is always the same but Y isnt. Sets the ship in the y coordinates
      if (shipOrientation === Orientation.VERTICAL) {
        for (let i = 0; i < length; i++) {
          coordinates[y + i][x].ship = shipPointer
        }
      }
    },
  }
}

module.exports = Gameboard
