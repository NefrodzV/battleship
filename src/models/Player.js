import { computer } from "./computer"
import Board from "./Board"
export default function Player(name, isHuman) {
  const board = Board()

  const getBoard = () => {
    return board
  }
  if (!isHuman) {
    return {
      name,
      computer,
      getBoard
    }
  }

  return {
    name,
    getBoard,
  }
}
