const MessageType = {
  ERROR: "Error",
  ENEMY: "Enemy",
  PLAYER: "Player",
}

const playerMessages = {
  INCORRECT_PLACEMENT_MESSAGE: {
    type: MessageType.ERROR,
    message: "Not a valid placement coordinate",
  },

  SHIP_ALREADY_IN_PLACE_MESSAGE: {
    type: MessageType.ERROR,
    message: "Ship already in place!",
  },
  ALREADY_FIRED_COORDINATE_MESSAGE: {
    type: MessageType.ERROR,
    message: "Already fired there please select another coordinate!",
  },

  MISS_MESSAGE: {
    type: MessageType.PLAYER,
    message: "The attack was a MISS captain!",
  },
  HIT_MESSAGE: {
    type: MessageType.PLAYER,
    message: "We've hit an enemy ship captain!",
  },
  SUNKEN_SHIP_MESSAGE: (name) => {
    return {
      type: MessageType.PLAYER,
      message: `We've sunken the enemy ${name} captain!`,
    }
  },
}

module.exports = playerMessages
