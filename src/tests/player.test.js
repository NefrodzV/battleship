import { PlayerType } from "../PlayerType"
import Player from "../Player"
import { computer } from "../computer"

test("Player with PlayerType.COMPUTER should return the object the computer module ", () => {
  const player = Player("Willy", PlayerType.COMPUTER)

  expect(player).toEqual({
    name: "Willy",
    type: PlayerType.COMPUTER,
    computer,
  })
})
