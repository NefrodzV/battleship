import { computer } from "./computer"
import Board from "./Board"
export default function Player(name, isHuman) {
  const board = Board()

  

  const getBoard = () => {
    return board
  }
  if (!isHuman) { 
  board.placeShip(0,0)
  board.placeShip(0,1)
  board.placeShip(0,2)
  board.placeShip(0,3)
  board.placeShip(0,4)
    return {
      name,
      isHuman,
      computer,
      getBoard
    }
  }

  return {
    name,
    isHuman,
    getBoard,
  }
}
