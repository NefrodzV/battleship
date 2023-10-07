import { PlayerType } from "../PlayerType"

export default function BoardComponent(object, callback) {
  const STYLE = "board"

  const board = document.createElement("div")
  board.classList.add(STYLE)
  const coordinatesMap = new Map()

  // Handles the orientation of ships to be placed only when the player is human
  const orientationButton = document.createElement("button")
  orientationButton.textContent = object.Orientation.HORIZONTAL
  orientationButton.addEventListener("click", (e) => {
    e.target.textContent = object.updateShipOrientation()
    if (!object.isPlacingShips()) {
      e.target.remove()
    }
  })

  if (object.isPlacingShips()) {
    board.append(orientationButton)
  }

  // Renders the outline when the board is in the placing phase
  function showOutline(x, y) {
    console.log(x, y)
    const outlineObject = object.getOutline(x, y)
    outlineObject.coordinates.forEach((coordinate) => {
      const key = `${coordinate.x}${coordinate.y}`
      const element = coordinatesMap.get(key)
      element.changeColor(outlineObject.clr)
    })
  }
  // Removes the outline when the board is in the placing phase after mouseout event registers
  const removeOutline = (x, y) => {
    const outlineObject = object.getOutline(x, y)
    outlineObject.coordinates.forEach((coordinate) => {
      const key = `${coordinate.x}${coordinate.y}`
      const element = coordinatesMap.get(key)
      element.changeColor()
    })
  }

  const createCoordinates = (() => {
    const coordinates = object.getCoordinates()
    console.log(coordinates[0].length)
    for (let y = coordinates.length - 1; y >= 0; y--) {
      for (let x = 0; x < coordinates[y].length; x++) {
        // Makes the  square elements for the coordinates  that are in the object board module
        const coordinate = CoordinateComponent(x, y)
        coordinatesMap.set(`${x}${y}`, coordinate)
        board.appendChild(coordinate.coordinateElement)
      }
    }
  })()

  // Sets the ship in the board
  const setShip = (x, y) => {
    const result = object.placeShip(x, y)

    // If the board object
    if (!result.status) {
      callback(result.type, result.msg)
      return
    }
  }

  // Marks a hit in the board
  const updateHit = (x, y) => {}

  // updates when a shit has been sunk
  const updateShipStatus = () => {}

  // board.addEventListener("mouseover", (e) => {
  //   console.log(e.target)
  // })

  // Class to make the coordinate element with its event handler
  function CoordinateComponent(x, y, pointer = null) {
    const STYLE = "coordinate"
    const coordinateElement = document.createElement("div")
    coordinateElement.classList.add(STYLE)

    const mouseOverHandler = () => {
      showOutline(x, y)
    }

    const mouseOutHandler = () => {
      removeOutline(x, y)
    }

    const setShipHandler = () => {
      setShip(x, y)
    }

    const hitShipHandler = () => {}
    // Event listeners only added when the player is human
    if (object.isPlacingShips()) {
      coordinateElement.addEventListener("click", setShipHandler)

      coordinateElement.addEventListener("mouseover", mouseOverHandler)

      coordinateElement.addEventListener("mouseout", mouseOutHandler)
    }

    const changeColor = (clr = "aqua") => {
      coordinateElement.style.backgroundColor = clr
    }

    const updatePointer = (int) => {
      pointer = int
    }

    return {
      coordinateElement,
      changeColor,
      updatePointer,
    }
  }

  return board
}
