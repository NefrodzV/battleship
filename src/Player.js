import { PlayerType } from "./PlayerType"
import { computer } from "./computer"

export default function Player(name, type) {
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
