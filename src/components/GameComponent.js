import Game from "../Game"
import Player from "../Player"
import { PlayerType } from "../PlayerType"

export default function GameComponent() {
  let game = null

  const getPlayerName = () => {
    const form = document.createElement("form")
    form.classList.add("player-form")
    const title = document.createElement("h1")
    title.textContent = "What is your name captain?"
    const input = document.createElement("input")
    input.setAttribute("required", "")
    input.name = "name"
    const button = document.createElement("button")
    button.textContent = "SUBMIT"

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      const name = data.name
      game = Game(Player(name, PlayerType.HUMAN))
      console.log(game)
      e.target.remove()
    })

    form.append(title, input, button)
    document.body.appendChild(form)
  }

  const start = (() => {
    getPlayerName()
  })()
}
