import Player from "./Player"
// Maybe be able to run functions in the constructor
export default function Game() {

  // What will be display to the user interface
  const Notifications = {
          MODE_SELECTION: 0,
          MODE_GET_PLAYER_ID:1,
          MODE_PLACE_SHIP:2
  }

  // Mode for versus selection
  const GameModes = {
      PLAYER: "Player",
      COMPUTER: "Computer"
  }

  let playerOne = null
  let playerTwo = null
  let isSinglePlayerGame = null

  const Notifier = {
    // Function to notify the ui
    notify: null
  }

  const init = () => {
    if(playerOne === null && playerTwo === null) {
      Notifier.notify(Notifications.MODE_SELECTION)
    }
  }
  
  const setGameMode = (mode) => {
    if(mode === GameModes.COMPUTER) {
      isSinglePlayerGame = true
      Notifier.notify(Notifications.MODE_GET_PLAYER_ID)
    }
  }
  
  const setPlayer = (name) => {
    if(isSinglePlayerGame) {
      playerOne = Player(name, true)
      playerTwo = Player("AI", false)
      Notifier.notify(Notifications.MODE_PLACE_SHIP)
      return;
    }

    // TODO: Here goes the logic to make a second player if needed for the future update
  }


  //TODO: HANDLE THE LOGIC FOR PLACING SHIPS AND RENDERING THEIR OUTLINES
  // Get the current player board 
  // TODO: Make the logic to change the board when the current ship place his ships
  const getCurrentBoardToDropShips =  () => {
    if(isSinglePlayerGame) {
      return playerOne.getBoard()
    }
  }
  // Get the current board to place ships coordinates
  const getCurrentBoardCoordinates = () => {
    const board = getCurrentBoardToDropShips()
    const coordinates = board.getCoordinates()

    return coordinates
  }
  // Gets the current player outlines for placing ships
  const getCurrentBoardOutlines = (x, y) => {
    const board = getCurrentBoardToDropShips()
    return board
  }

  // Changes the current board ship orientation to place ships
  const changeCurrentBoardShipOrientation = () => {
      const board = getCurrentBoardToDropShips()
      return board.updateShipOrientation()
  }

  const setShipInCurrentBoard = (x,y) => {
    const board = getCurrentBoardToDropShips()
    // TODO  CHANGE THE IMPLEMENTATION TO NOFITY USER HERE
    return board.placeShip(x,y)
  }

  // TODO Maybe rename and set the logic for the firing of the boards
  const fireAttackOnCurrentBoard = () => {

  }

  return {
    Notifier,
    GameModes,
    Notifications,
    init,
    getCurrentBoardCoordinates,
    getCurrentBoardToDropShips,
    getCurrentBoardOutlines,
    changeCurrentBoardShipOrientation,
    setPlayer,
    setGameMode,
  }
}
