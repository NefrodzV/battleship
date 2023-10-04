/** TODOS:
 * 1 - Should be placeable  to place ships in a board coordinate
 * 2 - Have a attack function  that determines whether a ship was hit or not.
 * 3 - have the correct ship be attacked when hit or marked the coordinates as already shot
 * 4 - Keep track of the missed shots so tehy can be properly rendered
 * 5 - Report whether  all the ships have been sunked or not
 */
import { PlayerType } from "./PlayerType"
import Ship from "./Ship"

export default function Gameboard(
  playerType,
  messages,
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

  const allShipsAreSunk = () => {
    const areSunk = ships.every((ship) => ship.isSunk() === true)

    if (areSunk) {
      if (playerType === PlayerType.COMPUTER) {
        messageObserver.notify(messages.PLAYER_WINS_MESSAGE)
      } else {
        messageObserver.notify(messages.COMPUTER_WINS_MESSAGE)
      }
    }
  }

  const registerShipHit = (pointer) => {
    const ship = ships[pointer]
    ship.hit()

    if (ship.isSunk()) {
      // If this is the computer board
      if (playerType === PlayerType.COMPUTER) {
        messageObserver.notify(
          messages.PLAYER_SUNKEN_ENEMY_SHIP_MESSAGE(ship.getName())
        )
      } else {
        messageObserver.notify(
          messages.ENEMY_SUNKEN_PLAYER_SHIP_MESSAGE(ship.getName())
        )
      }
      sunkenObserver.notify(pointer)
      allShipsAreSunk()
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

      // DONT KNOW WHAT TO PASS HERE TO RENDER THE SHIP PLACEMENT THIS NEEDS
      // TO VBE VERIFIED LATER ON
      placementObserver.notify({ x, y, shipOrientation })
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
        if (playerType === PlayerType.COMPUTER) {
          messageObserver.notify(messages.PLAYER_MISS_MESSAGE)
        }
        return
      }
      // Need to send updates to the ui right here when a hit occurs
      coordinate.miss = false

      if (playerType === PlayerType.COMPUTER) {
        messageObserver.notify(messages.PLAYER_HIT_MESSAGE)
      } else {
        messageObserver.notify(messages.ENEMY_HIT_MESSAGE)
      }
      hitObserver.notify({ x, y })
      registerShipHit(coordinate.ship)
    },
  }
}
