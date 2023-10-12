import Game from "../models/Game"
import BoardComponent from "./BoardComponent"
import { messageComponent } from "../components/MessageComponent"
export default function BattleShipComponent() {
  const STYLE = "battleship"
  const BOARD_CONTAINER_STYLE = "board-container"
  const container = document.createElement("div")
  container.classList.add(STYLE)
  const title = document.createElement("h1")
  title.textContent = "BATTLESHIP"
  title.style.color = "white"
  container.appendChild(title)
  const playerInTurnText = document.createElement("h2")

  const boardComponents = []

  const Message = messageComponent

  const clean = () => {
    while(container.firstChild) {
      container.removeChild(container.firstChild)
    }
  }
  
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
  
      form.append(formTitle, input, button)
      container.appendChild(form)
  }
  
 

  // Right now this function only updates the first player board component needs to be updated to handle two players
  const makePlacementComponent = (game, id) => {
    const placementContainer =  document.createElement("div")
    placementContainer.classList.add("mode-selection")
    placementContainer.style.height = "100%"
    const title = document.createElement("h2")
    title.textContent = `Place your ships captain ${id}!`
    const subtitle = document.createElement("h3")
    subtitle.textContent = "The next ship to place is: " + game.getNextShipName(id)
    const shipOrientationButton = document.createElement("button")
    shipOrientationButton.textContent = game.changeShipOrientation(id)
    shipOrientationButton.onclick = (e) => {
      e.target.textContent = game.changeShipOrientation(id)
    }
    const board = BoardComponent(id, game,(string) => {
        subtitle.textContent = "The next ship to place is: " + string
    })
    board.style.width  = "100%"
    boardComponents.push(board)
    placementContainer.append(title, subtitle, shipOrientationButton, board)
    container.appendChild(placementContainer)
  }

  const createGame = () => {
    const boardsContainer = document.createElement("div")
    boardsContainer.classList.add(BOARD_CONTAINER_STYLE)
    container.appendChild(title)
    container.appendChild(boardsContainer)
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
        makePlacementComponent(game, data)
      break

      case game.Notifications.MODE_SEND_MESSAGE:
        Message.show(data.style, data.msg)
      break

      
      case game.Notifications.MODE_SET_COMPUTER_UI:

      break
      case game.Notifications.MODE_GAME_START: 
      clean()
      createGame()
      break
      default:
        console.log("[ERROR] Notification Handler failed")
        console.log("[ERROR] Code: "+ code)
    }
  }
  game.Notifier.notify = notificationHandler

  game.init()

  document.body.appendChild(container)
}
