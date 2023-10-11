import Ship from "./Ship"

export default function Board() {
  const COLS = 10
  const ROWS = 10

  // Class that has the orientation parameters of  how the ships will be placed
  const Orientation = {
    VERTICAL: "Vertical",
    HORIZONTAL: "Horizontal",
  }
  // Errors codes for placement
  const ErrorCodes = {
    INVALID_PLACEMENT: 0,
    SHIP_ALREADY_IN_PLACE:1,
    ALL_SHIPS_PLACED : 2
  }

  // Codes for attack responses
  const AttackCodes = {
    COORDINATE_ALREADY_FIRED:0,
    MISSED_ATTACK:1,
    SUNK_SHIP:2,
    HIT:3
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
    return areSunk
  }

  return {
    AttackCodes,
    Orientation,
    ErrorCodes,
    getCoordinates() {
      return coordinates
    },

    placeShip(x, y) {
      // If the placement goes out of bounds stop and notify user
      if (!isValidPlacement(x, y)) {
        return ErrorCodes.INVALID_PLACEMENT
      }

      // If there is a ship already in place stop and notify user
      if (isShipInPlace(x, y)) {
        return ErrorCodes.SHIP_ALREADY_IN_PLACE
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

      return {arr: squares, shipId: shipPointer}
    },

    recieveAttack(x, y) {
      const coordinate = coordinates[y][x]
      // If this property is not null there is either a hit or miss COORDINATE HAS ALREADY BEEN ATTACKED
      if (coordinate.miss !== null) {
        return AttackCodes.COORDINATE_ALREADY_FIRED
      }
      if (coordinate.ship === null) {
        coordinate.miss = true
        return AttackCodes.MISSED_ATTACK
      }
      // Set the this property to mark the hit coordinate
      coordinate.miss = false
      const ship = ships[coordinate.ship]
      ship.hit()
      if (ship.isSunk()) {
        return AttackCodes.SUNK_SHIP
      }
      return AttackCodes.HIT
    },

    getOutline(x, y) {
      const MAX = 9
      let invalid = false
      const shipLength = availableShips.at(0).length
      const squares = []
      if (shipOrientation === Orientation.HORIZONTAL) {
        for (let i = 0; i < shipLength; i++) {
          const currentX = x + i
          if (currentX > 9) {
            invalid = true
            break
          }
          if (coordinates[y][currentX].ship !== null) invalid = true
          squares.push({ x: currentX, y: y })
        }
      } else if (shipOrientation === Orientation.VERTICAL) {
        for (let i = 0; i < shipLength; i++) {
          const currentY = y + i
          if (currentY > MAX) {
            invalid = true
            break
          }
          if (coordinates[currentY][x].ship !== null) invalid = true
          squares.push({ x: x, y: currentY })
        }
      }

      // If the outline has a ship in place or goes out of bounds 
      if(invalid) {
        return { arr: squares, errorCode: ErrorCodes.INVALID_PLACEMENT }
      }
      return squares
    },

    hasShipsAvailable() {
      // Returns if the ships are all placed or not
      if(availableShips.length > 0) return true
      return false
    },

    getNextShipToPlace() {
      if(availableShips.length === 0) {
        return ErrorCodes.ALL_SHIPS_PLACED
      }

      const object= availableShips.at(0)
      return object.name
    },

    updateShipOrientation() {
      if (shipOrientation === Orientation.HORIZONTAL) {
        shipOrientation = Orientation.VERTICAL
        return shipOrientation
      }
      shipOrientation = Orientation.HORIZONTAL
      return shipOrientation
    },
    allShipsAreSunk
  }
}
