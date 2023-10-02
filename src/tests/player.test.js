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

test("Implementing the while logic in here from the computer to see if it runs as expected", () => {
  const plays = [
    {
      x: 0,
      y: 0,
    },
  ]

  const x = 0
  const y = 0

  const itHas = plays.some((i) => i.x === 0 && i.y === y)

  expect(itHas).toBe(true)
})
