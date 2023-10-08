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
  })

  if (object.hasShipsAvailable()) {
    board.append(orientationButton)
  }

  // Renders the outline when the board is in the placing phase
  function showOutline(x, y) {
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

    // If the board object returns an error result inform
    if (!result.status) {
      callback(result.type, result.msg)
      return 
    }

    result.coordinates.forEach((coordinate) => {
      const key = `${coordinate.x}${coordinate.y}`
      const element = coordinatesMap.get(key)
      element.updateHasShip()
      element.changeColor()
      
    })

    // If all the ships have been placed remove the listener for placement
    if(!object.hasShipsAvailable()) {
      coordinatesMap.forEach(coordinate => {
        coordinate.removeMouseOut()
        coordinate.removeMouseOver()
        coordinate.removeSetShip()
      })

      // Removes the button
      orientationButton.remove()
    }
  }

  // Marks a hit in the board
  const updateHit = (x, y) => {}

  // updates when a shit has been sunk
  const updateShipStatus = () => {}

  // Class to make the coordinate element with its event handlers
  function CoordinateComponent(x, y, hasShip = false) {
    const SHIP_CLR = "gray"
    const STYLE = "coordinate"
    const coordinateElement = document.createElement("div")
    coordinateElement.classList.add(STYLE)
    
    
    const changeColor = (clr = "aqua") => {
      if (hasShip) {
        coordinateElement.style.backgroundColor = SHIP_CLR
        return
      }
      coordinateElement.style.backgroundColor = clr
    }

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
    // Event listeners only added when the player is human and ships are being placed
    if (object.hasShipsAvailable()) {
      coordinateElement.addEventListener("click", setShipHandler)
      coordinateElement.addEventListener("mouseover", mouseOverHandler)
      coordinateElement.addEventListener("mouseout", mouseOutHandler)
    }

    const removeMouseOver = () => {
      coordinateElement.removeEventListener("mouseover", mouseOverHandler)
    }

    const removeMouseOut = () => {
      coordinateElement.removeEventListener("mouseout", mouseOutHandler)
    }

    const removeSetShip = () => {
      coordinateElement.removeEventListener("click", setShipHandler)
    }

    return {
      coordinateElement,
      changeColor,
      removeMouseOut,
      removeMouseOver,
      removeSetShip,
      addHitListener() {
        coordinateElement.addEventListener("click", )
      },
      updateHasShip() {
        hasShip = true
      },
    }
  }

  return board
}
