export default function BoardComponent(game, callback) {
  const STYLE = "board"

  const board = document.createElement("div")
  board.classList.add(STYLE)
  const coordinatesMap = new Map()

  // Handles the orientation of ships to be placed only when the player is human
  // const orientationButton = document.createElement("button")
  // orientationButton.textContent = "Horizontal"
  // orientationButton.addEventListener("click", (e) => {
  //   e.target.textContent = boardObject.updateShipOrientation()
  // })

  // if (boardObject.hasShipsAvailable()) {
  //   board.append(orientationButton)
  // }

  // Renders the outline when the board is in the placing phase
  function showOutline(x, y) {

    const outlineObj = game.getCurrentBoardOutlines(x, y)
    outlineObj.arr.forEach((coordinate) => {
      const key = `${coordinate.x}${coordinate.y}`
      const element = coordinatesMap.get(key)
      element.changeColor(outlineObj.clr)
    })
  }
  // Removes the outline when the board is in the placing phase after mouseout event registers
  const removeOutline = (x, y) => {
    const outlineObj = game.getCurrentBoardOutlines(x, y)
    outlineObj.arr.forEach((coordinate) => {
      const key = `${coordinate.x}${coordinate.y}`
      const element = coordinatesMap.get(key)
      element.changeColor()
    })
  }
  
  const createCoordinates = (() => {
    const coordinates = game.getCurrentBoardCoordinates()
    console.log(coordinates[0].length)
    for (let y = coordinates.length - 1; y >= 0; y--) {
      for (let x = 0; x < coordinates[y].length; x++) {
        let hasShip = false
        if(coordinates[y][x].ship !== null) {
            hasShip = true
        }
          // console.log(coordinates[y][x]
        // Makes the  square elements for the coordinates  that are in the object board module
        const coordinate = CoordinateComponent(x, y, hasShip)
        coordinatesMap.set(`${x}${y}`, coordinate)
        board.appendChild(coordinate.coordinateElement)
      }
    }
  })()

  // Sets the ship in the board
//   const setShip = (x, y) => {
//     const result = object.placeShip(x, y)
// 
//     // If the board object returns an error result inform
//     if (!result.status) {
//       // callback(1,result.type, result.msg)
//       return 
//     }
// 
//     result.coordinates.forEach((coordinate) => {
//       const key = `${coordinate.x}${coordinate.y}`
//       const element = coordinatesMap.get(key)
//       element.updateHasShip()
//       element.changeColor()
//       
//     })

    
    /** TODO: Remove the board from the ui and  set the listeners to be placed to register
     * in the battleship component there is way to remove and re load the same board componenent*/ 
    // If all the ships have been placed remove the listener for placement
  //   if(!object.hasShipsAvailable()) {
  //     coordinatesMap.forEach(coordinate => {
  //       // We remove the logic to place ships and add the listener to register hits
  //       coordinate.removeMouseOut()
  //       coordinate.removeMouseOver()
  //       coordinate.removeSetShip()
  //       // Only add this listener if the opponent is not human aka the enemy
  //       // if(!object.getPlayer().isHuman())
  //       // coordinate.addHitListener()
  //     })
  //     
  //     // Removes the button
  //     orientationButton.remove()
  //     // callback(2)
  //   }
  // }

  // if(!object.getPlayer().isHuman()) {
  //   setShip(0,0)
  // playerTwoBoard.placeShip(1,0)
  // playerTwoBoard.placeShip(2,0)
  // playerTwoBoard.placeShip(3,0)
  // playerTwoBoard.placeShip(4,0)
  // playerTwoBoard.placeShip(5,0)
  // }
  // Marks a hit in the board
  // const updateHit = (x, y) => {
  //   console.log("[HIT] coodinates: x:" + x + "y: " +y)
  // }

  // updates when a shit has been sunk
  const updateShipStatus = () => {}

  // Class to make the coordinate element with its event handlers
  function CoordinateComponent(x, y, shipId = null) {
    const SHIP_CLR = "gray"
    const STYLE = "coordinate"
    const coordinateElement = document.createElement("div")
    coordinateElement.classList.add(STYLE)
    
    const changeColor = (clr = "aqua") => {
      if (shipId) {
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
      // setShip(x, y)
      
    }

    const hitHandler = () => {
      // updateHit(x,y)
    }
    

//     const removeMouseOver = () => {
//       coordinateElement.removeEventListener("mouseover", mouseOverHandler)
//     }
// 
//     const removeMouseOut = () => {
//       coordinateElement.removeEventListener("mouseout", mouseOutHandler)
//     }
// 
//     const removeSetShip = () => {
//       coordinateElement.removeEventListener("click", setShipHandler)
//     }

    
    // If the coordinate has a ship already change the color this is mostly for computer render
    if(shipId) {
      changeColor(SHIP_CLR)
    }

    //Event listeners only added when the player is human and ships are being placed
    if (game.getCurrentBoardHasShipsAvailable()) {
      // coordinateElement.addEventListener("click", setShipHandler)
      coordinateElement.addEventListener("mouseover", mouseOverHandler)
      coordinateElement.addEventListener("mouseout", mouseOutHandler)
    }

    return {
      coordinateElement, 
      changeColor
    }
    // if(!object.getPlayer().isHuman()) {
    //     coordinateElement.addEventListener("click", hitHandler)
    // }
    // return {
    //   coordinateElement,
    //   changeColor,
    //   removeMouseOut,
    //   removeMouseOver,
    //   removeSetShip,
    //   addHitListener() {
    //     coordinateElement.addEventListener("click", hitHandler)
    //   },
    //   updateHasShip() {
    //     hasShip = true
    //   },
    // }
  }

  return board
}
