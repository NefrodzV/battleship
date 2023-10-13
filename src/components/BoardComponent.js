export default function BoardComponent(id, game, callback) {
  const STYLE = "board"
  const board = document.createElement("div")
  board.classList.add(STYLE)
  const coordinatesMap = new Map()

  // Renders the outline when the board is in the placing phase
  function showOutline(x, y) {

    const outlineObj = game.getOutlines(id, x, y)
    outlineObj.arr.forEach((coordinate) => {
      const key = `${coordinate.x}${coordinate.y}`
      const element = coordinatesMap.get(key)
      element.changeColor(outlineObj.clr)
    })
  }
  // Removes the outline when the board is in the placing phase after mouseout event registers
  const removeOutline = (x, y) => {
    const outlineObj = game.getOutlines(id, x, y)
    outlineObj.arr.forEach((coordinate) => {
      const key = `${coordinate.x}${coordinate.y}`
      const element = coordinatesMap.get(key)
      element.changeColor()
    })
  }
  
  const createCoordinates = (() => {
    const coordinates = game.getCoordinates(id)
    console.log(coordinates[0].length)
    for (let y = coordinates.length - 1; y >= 0; y--) {
      for (let x = 0; x < coordinates[y].length; x++) {
        const ship = coordinates[y][x].ship        
        const coordinate = CoordinateComponent(x, y, ship)
        if(game.enableSetListeners(id)) {
          coordinate.addMouseOutListener()
          coordinate.addMouseOverListener()
          coordinate.addSetShipListener()
        }
// console.log(game.enableFireListener(id))
        if(game.enableFireListener(id)) {
          
          coordinate.addFireListener()
        }
        coordinatesMap.set(`${x}${y}`, coordinate)
        board.appendChild(coordinate.coordinateElement)
      }
    }
  })()

  // Sets the ship in the board
  const setShip = (x, y) => {
    const data = game.setShip(id, x, y)
    if(data === null || data === undefined) return
    // If the board object returns an error result inform
    data.arr.forEach((object) => {
      const key = `${object.x}${object.y}`
      const coordinate = coordinatesMap.get(key)
      coordinate.setShipId(data.shipId)
      coordinate.changeColor()
    })

    if(!game.hasShipsAvailable(id)) {
        coordinatesMap.forEach(coordinate => {
          coordinate.removeMouseOutListener()
          coordinate.removeMouseOverListener()
          coordinate.removeSetShipListener()
        })
      }
    
    const nextShipInLine = game.getNextShipName(id)
    callback(nextShipInLine)
  }
  // updates when a shit has been sunk
  const renderShipSunk = (pointer) => {
    
      coordinatesMap.forEach(coordinate => {
        if(coordinate.getId() === pointer) {
          console.log("found ship sunked")
          coordinate.coordinateElement.style.backgroundColor= ""
          coordinate.coordinateElement.classList.add("sunk")
        }
      })
  }

  const handleComputerAttack = (x,y) => {
    coordinatesMap.forEach(coordinate => {

    })
  }

  const computerMove = (x,y) => {

  }
  // Class to make the coordinate element with its event handlers
  function CoordinateComponent(x, y, shipId = null) {
    const SHIP_CLR = "gray"
    const STYLE = "coordinate"
    const coordinateElement = document.createElement("div")
    coordinateElement.classList.add(STYLE)
    let hit = false;

    const changeColor = (clr = "aqua") => {
      if(hit) {
        coordinateElement.style.backgroundColor = clr
        return
      }
      if (typeof(shipId) === "number") {
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
      console.log(id)
      setShip(x, y)
    }

    const hitHandler = () => {
      const data = game.fireBoard(id, x,y)
      if(data === "orange") {
        changeColor(data)
      }

      if(data === "red") {
        hit = true
        changeColor(data)
      }

      if(data === "sunk") {
        console.log("ship sunk coordinate")
        renderShipSunk(shipId)
      }
    }

    // This will run whe the computer fires the op
//     game.ComputerNotifier.notify = (name, xCoordinate, yCoordinate) => {
//       
//       if(name === id) {
//         console.log("running computer notify")
//         const data = game.fireBoard(id, xCoordinate, yCoordinate)
//         if(data === "orange") {
//         changeColor(data)
//          }
// 
//         if(data === "red") {
//           hit = true
//           changeColor(data)
//         }
// 
//         if(data === "sunk") {
//           console.log("ship sunk coordinate")
//           renderShipSunk(shipId)
//         }
//       }
//       
//       
//       
//     }

    const renderComputerMove = (type, x,y) => {
      
    }

    const setShipId = (id) => {
        shipId = id
    }
    // Enforce the ship color in some cases
    changeColor()
    
    const addMouseOverListener = () => {
      coordinateElement.addEventListener("mouseover", mouseOverHandler)
    }
    const addMouseOutListener = () => {
      coordinateElement.addEventListener("mouseout", mouseOutHandler)
    }

    const addSetShipListener = () => {
      coordinateElement.addEventListener("click", setShipHandler)
    }

    const removeMouseOverListener = () => {
      coordinateElement.removeEventListener("mouseover", mouseOverHandler)
    }

    const removeMouseOutListener = () => {
      coordinateElement.removeEventListener("mouseout", mouseOutHandler)
    }

    const removeSetShipListener = () => {
      coordinateElement.removeEventListener("click", setShipHandler)
    }

    const addFireListener = ()=> {
      coordinateElement.addEventListener("click", hitHandler)
    }

    // If the coordinate has a ship already change the color this is mostly for computer render
    if(shipId) {
      changeColor(SHIP_CLR)
    }

    const getId = () => {
      return shipId
    }
    return {
      coordinateElement, 
      getId,
      changeColor, 
      setShipId, 
      addMouseOutListener,
      addMouseOverListener,
      addSetShipListener,
      addFireListener,
      removeMouseOutListener,
      removeMouseOverListener,
      removeSetShipListener,
    }
  }

  return {
    board
  }
}
