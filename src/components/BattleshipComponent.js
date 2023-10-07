import { PlayerType } from "../PlayerType"
import BoardComponent from "./BoardComponent"

export default function BattleShipComponent(game) {
  const STYLE = "battleship"
  const BOARD_CONTAINER_STYLE = "board-container"

  let playerOneBoard = null

  //   const create = (() => {
  //     const battleShipContainer = document.createElement("div")
  //     battleShipContainer.classList.add(STYLE)
  //     const title = document.createElement("h1")
  //     title.textContent = "Battleship"
  //     const boardsContainer = document.createElement("div")
  //     boardsContainer.classList.add(BOARD_CONTAINER_STYLE)
  //
  //     const playerOneBoard = BoardComponent(game.getPlayers()[0])
  //     const playerTwoBoard = BoardComponent(game.getPlayers()[1])
  //
  //     boardsContainer.append(playerOneBoard, playerTwoBoard)
  //     battleShipContainer.append(title, boardsContainer)
  //     document.body.appendChild(battleShipContainer)
  //   })()
  const messageComponent = (function Message() {
    const message = document.createElement("div")
    message.classList.add("msg")
    document.body.append(message)

    return {
      show(style, msg) {
        message.classList.add(style)
        message.textContent = msg
        message.toggleAttribute("show")

        setTimeout(() => {
          message.toggleAttribute("show")
        }, 2000)
      },
    }
  })()

  const start = (() => {
    const title = document.createElement("h1")
    title.textContent = `Place your ships Captain ${game.getPlayers()[0].name}!`
    title.style.alignSelf = "center"
    const board = BoardComponent(game.getBoards()[0], (style, message) => {
      console.log(message)
      messageComponent.show(style, message)
    })
    board.style.alignSelf = "center"
    document.body.append(title, board)
  })()

  // Message module to show messages when the board send messages on error
}
