/** TODOS:
 * 1 - Should be place to place ships in a board coordinate
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
  const coordinates = []

  // By default the board will be done with Horizontal
  const createCoordinates = (() => {
    for (let y = 0; y < 10; y++) {
      // Setting empty array for each row
      coordinates.push([])
      for (let x = 0; x < 10; x++) {
        coordinates[0].push({ x, y, ship: null })
      }
    }
  })()

  return {
    getCoordinates() {
      return coordinates
    },

    Orientation,

    placeShip(x, y) {
      // Gets the available ships to place and removes them
      const length = availableShips.splice(0, 1)
      const ship = Ship(length)
      ships.push(ship)
      coordinates[0][0].ship = ships.length - 1
      coordinates[0][1].ship = ships.length - 1
    },
  }
}

module.exports = Gameboard
