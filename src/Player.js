const PlayerType = require("./PlayerType")
const computer = require("./computer")

function Player(name, type) {
  if (type === PlayerType.COMPUTER) {
    return {
      name,
      type,
      computer,
    }
  }
  return {
    name,
    type,
  }
}

module.exports = Player
