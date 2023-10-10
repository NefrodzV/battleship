import Game from "../Game"
import BoardComponent from "./BoardComponent"

export default function BattleShipComponent() {
  const STYLE = "battleship"
  const BOARD_CONTAINER_STYLE = "board-container"
  const container = document.createElement("div")
  container.classList.add(STYLE)
  const title = document.createElement("h1")
  title.textContent = "BATTLESHIP"
  container.appendChild(title)

  let playerOneBoardComponent = null
  let playerTwoBoardComponent = null

  
  // Renders the elements to get the game mode
  const makeModeSelection = (game) => {
    const modeContainer = document.createElement("div")
    modeContainer.classList.add("mode-selection")
    const title = document.createElement("h1");
    title.textContent = "Select the game mode"

    const subtitle = document.createElement("h2")
    subtitle.textContent = "Versus:"
    const computerModeButton = document.createElement("button")
    computerModeButton.textContent = game.GameModes.COMPUTER
    computerModeButton.type = "button"
    computerModeButton.addEventListener("click", (e) => {
      modeContainer.remove()
      game.setGameMode(e.target.textContent)
    })
    const playerModeButton = document.createElement("button")
    playerModeButton.textContent =  game.GameModes.PLAYER
    playerModeButton.type = "button"
    playerModeButton.addEventListener("click", (e) => {
      
      game.setGameMode(e.target.textContent)
    })

    modeContainer.append(title, subtitle,computerModeButton,playerModeButton)
    container.appendChild(modeContainer)

  }
   
  // Renders the container to get the player name
  const makePlayerForm = (game) => {
      const form = document.createElement("form")
      form.classList.add("mode-selection")
      const formTitle = document.createElement("h1")
      formTitle.textContent = "What is your name captain?"
      const input = document.createElement("input")
      input.setAttribute("required", "")
      input.name = "name"
      const button = document.createElement("button")
      button.textContent = "SUBMIT"
  
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target))
        const name = data.name
        game.setPlayer(name)
        e.target.remove()
      })
  
      form.append(formTitle,input, button)
      container.appendChild(form)
  }
  
 
  const makePlacementCompononent = (game) => {
    const placementContainer =  document.createElement("div")
    placementContainer.classList.add("mode-selection")
    const title = document.createElement("h1")
    title.textContent = "Place your ships captain!"
    const subtitle = document.createElement("h2")
    const shipOrientationButton = document.createElement("button")
    shipOrientationButton.textContent = game.changeCurrentBoardShipOrientation()
    playerOneBoardComponent = BoardComponent(game)
    playerOneBoardComponent.style.width  = "100%"
    placementContainer.append(title, subtitle, shipOrientationButton, playerOneBoardComponent)
    container.appendChild(placementContainer)
    
  }
  const game = Game()

  const notificationHandler = (code, data) => {
    
    switch(code) {
      case game.Notifications.MODE_SELECTION:
        makeModeSelection(game)
      break

      case game.Notifications.MODE_GET_PLAYER_ID:
        makePlayerForm(game)
      break

      case game.Notifications.MODE_PLACE_SHIP: 
        makePlacementCompononent(game)
      break
      default:
        console.log("[ERROR] Notification Handler failed")
        console.log("[ERROR] Code: "+ code)
    }
  }
  game.Notifier.notify = notificationHandler

  game.init()

   
  

  

  
  
  // function createModeSelection() {
  //  console.log(game)
  // }
  // TODO: Place the ships only passing the game module to render the ships for players
  // TODO: Render the outlines via the game module 
  const placeShips = () => {
    playerOneBoardComponent = BoardComponent(game,game.getPlayerOneBoard())
    document.body.append(playerOneBoardComponent)
  }
  
    // const create = (() => {
    //   const battleShipContainer = document.createElement("div")
    //   battleShipContainer.classList.add(STYLE)
    //   const title = document.createElement("h1")
    //   title.textContent = "Battleship"
    //   const boardsContainer = document.createElement("div")
    //   boardsContainer.classList.add(BOARD_CONTAINER_STYLE)
    //   playerTwoBoard = BoardComponent(game.getBoards()[1])
    //   boardsContainer.append(playerOneBoard, playerTwoBoard)
    //   battleShipContainer.append(title, boardsContainer)
    //   document.body.appendChild(battleShipContainer)
    // })
  
// 
//   const start = (() => {
//     const title = document.createElement("h1")
//     title.textContent = `Place your ships Captain ${game.getPlayers()[0].name}!`
//     title.style.alignSelf = "center"
//     playerOneBoard = BoardComponent(game.getBoards()[0], function callback(flowId, style, message){
//       messageComponent.show(style, message)
// 
//       /** Logic for number:
//        * 1- Sends a message to user interface
//        * 2- Removes the board from the user interface
//        */
//       switch(flowId)  {
//          case 1:
//           messageComponent.show(style, message)
//           break
//         
//           case 2:
//             // Not returning element but undefined
//             playerOneBoard.remove()
//             create()
//             break
//           default: 
//           console.log("[BoardComponent] callback error")
//       }
//      
// 
//       // Example of how we could remove the  board after placing 
//       // the ships or notifying the winner for message
//       
//       
//     })
//     playerOneBoard.style.alignSelf = "center"
//     document.body.append(title,playerOneBoard)
//   })()


// Invoques a form for the player to enter their name
//   const start = (() => {
//     console.log("Starting game!....")
//       const form = document.createElement("form")
//       form.classList.add("player-form")
// 
//       const formTitle = document.createElement("h1")
//       formTitle.textContent = "What is your name captain?"
//       const input = document.createElement("input")
//       input.setAttribute("required", "")
//       input.name = "name"
//       const button = document.createElement("button")
//       button.textContent = "SUBMIT"
//   
//       form.addEventListener("submit", (e) => {
//         e.preventDefault()
//         const data = Object.fromEntries(new FormData(e.target))
//         const name = data.name
//         const player = Player(name, PlayerType.HUMAN)
//         game = Game(player)
//         placeShips()
//         e.target.remove()
//       })
//   
//       form.append(formTitle,input, button)
//       document.body.appendChild(form)
//   })

  
  document.body.appendChild(container)
}
