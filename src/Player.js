import { PlayerType } from "./PlayerType"
import { computer } from "./computer"

export default function Player(name, type) {
  const isHuman = () => {
    if (type === PlayerType.COMPUTER) return false
    return true
  }

  if (type === PlayerType.COMPUTER) {
    return {
      name,
      type,
      computer,
      isHuman,
    }
  }
  return {
    name,
    type,
    isHuman,
  }
}
