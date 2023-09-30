MessageType = {
  ERROR: "Error",
  ENEMY: "Enemy",
  PLAYER: "Player",
}
const messages = {
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
    message: "Already fired there, please select another coordinate!",
  },

  PLAYER_MISS_MESSAGE: {
    type: MessageType.PLAYER,
    message: "The attack was a MISS captain!",
  },

  PLAYER_HIT_MESSAGE: {
    type: MessageType.PLAYER,
    message: "We've hit an enemy ship captain!",
  },

  ENEMY_HIT_MESSAGE: {
    type: MessageType.PLAYER,
    message: "The enemy has hit one of our ships captain!",
  },

  // When the playter sinks an enemy ship
  ENEMY_SUNKEN_PLAYER_SHIP_MESSAGE: (shipName) => {
    return {
      type: MessageType.ENEMY,
      message: `The enemy has sunken our ${shipName} captain!`,
    }
  },

  PLAYER_SUNKEN_ENEMY_SHIP_MESSAGE: (shipName) => {
    return {
      type: MessageType.PLAYER,
      message: `We've sunken the enemy ${shipName} captain!`,
    }
  },

  // When the player ships are all sunken
  PLAYER_WINS_MESSAGE: {
    type: MessageType.PLAYER,
    message: "Enemy neutralized! We won captain!",
  },

  COMPUTER_WINS_MESSAGE: {
    type: MessageType.ENEMY,
    message:
      "Mayday! Mayday! We've lost out last ship! We've lost our friendly waters! RETREAT!!!",
  },
}

module.exports = messages
