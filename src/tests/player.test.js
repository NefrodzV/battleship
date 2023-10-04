const Player = require("../Player")
const PlayerType = require("../PlayerType")
const computer = require("../computer")

test("Player with PlayerType.COMPUTER should return the object the computer module ", () => {
  const player = Player("Willy", PlayerType.COMPUTER)

  expect(player).toEqual({
    name: "Willy",
    type: PlayerType.COMPUTER,
    computer,
  })
})
