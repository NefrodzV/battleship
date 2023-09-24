/** TODOS:
 * 1 - Should be placeable  to place ships in a board coordinate
 * 2 - Have a attack function  that determines whether a ship was hit or not.
 * 3 - have the correct ship be attacked when hit or marked the coordinates as already shot
 * 4 - Keep track of the missed shots so tehy can be properly rendered
 * 5 - Report whether  all the ships have been sunked or not
 */
const Ship = require("./Ship")
function Gameboard() {
  // Class that has the orientation parameters of  how the ships will be placed
  const Orientation = {
    VERTICAL: "Vertical", // Sets the board array to columns
    HORIZONTAL: "Horizontal", // Sets the board array to be rows
  }
  // Available ships to place length
  const availableShips = [2, 3, 3, 4, 5]
  const ships = []

  let coordinatesOrientation = Orientation.HORIZONTAL
  let coordinates = []

  // By default the board will be done with Horizontal
  const createCoordinates = (() => {
    for (let y = 0; y < 10; y++) {
      // Setting empty array for each row
      coordinates.push([])
      for (let x = 0; x < 10; x++) {
        coordinates[y].push({ x, y, ship: null })
      }
    }
    // console.log(coordinates)
  })()

  const transponse = (orientation) => {
    const arrayTransposed = []
    switch (orientation) {
      case Orientation.VERTICAL:
        for (let x = 0; x < 10; x++) {
          arrayTransposed.push([])
          for (let y = 0; y < 10; y++) {
            arrayTransposed[x].push(coordinates[y][x])
          }
        }
        coordinatesOrientation = Orientation.VERTICAL
        break

      default:
        console.log("Set a correct orientation")
    }

    // console.log(arrayTransposed)
    // Deleting current elements and adding the new ones
    coordinates = arrayTransposed

    // coordinates.length = 0
    // for (let i = 0; i < arrayTransposed.length; i++) {
    //   coordinates.push(arrayTransposed[i])
    // }
  }

  return {
    getCoordinates() {
      return coordinates
    },

    Orientation,

    placeShip(x, y, orientation) {
      const length = availableShips.splice(0, 1)
      const ship = Ship(length)
      ships.push(ship)

      // When Y is always the same but X isnt
      if (orientation === Orientation.HORIZONTAL) {
        if (coordinatesOrientation !== Orientation.HORIZONTAL)
          transponse(Orientation.HORIZONTAL)
        if (x === 0) {
          for (let i = 0; i < length; i++) {
            coordinates[y][x + i].ship = ships.length - 1
          }
        }

        if (x === 9) {
          for (let i = 0; i < length; i++) {
            coordinates[y][x - i].ship = ships.length - 1
          }
        }
      }
      // When X is always the same but Y isnt
      if (orientation === Orientation.VERTICAL) {
        if (coordinatesOrientation !== Orientation.VERTICAL)
          transponse(Orientation.VERTICAL)
        if (y === 0) {
          for (let i = 0; i < length; i++) {
            coordinates[x][y + i].ship = ships.length - 1
          }
        }

        if (y === 9) {
          for (let i = 0; i < length; i++) {
            coordinates[x][y - i].ship = ships.length - 1
          }
        }
      }
    },
  }
}

module.exports = Gameboard
