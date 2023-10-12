import Player from "./Player"
// Maybe be able to run functions in the constructor
export default function Game() {

  // What will be display to the user interface
  const Notifications = {
          MODE_SELECTION: 0,
          MODE_GET_PLAYER_ID:1,
          MODE_PLACE_SHIP:2,
          MODE_SEND_MESSAGE:3,
          MODE_SET_COMPUTER_UI:4,
          MODE_GAME_START:5, 
          MODE_ADD_PLACEMENT_LOGIC:6,
          MODE_REMOVE_PLACEMENT_LOGIC:7,
          MODE_ADD_HIT_LISTENER:8,
          MODE_REMOVE_HIT_LISTENER:9
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

  const gameReadyToStart = () => {
      if(playerOne.getBoard().hasShipsAvailable()) {
        Notifier.notify(Notifications.MODE_PLACE_SHIP, playerOne.name)
        return
      }
      // if(!isSinglePlayerGame) {
      //   if(playerTwo.getBoard().hasShipsAvailable()) {
      //     return
      //   }
      // }
      // Starts the game
      Notifier.notify(Notifications.MODE_SET_COMPUTER_UI)
      Notifier.notify(Notifications.MODE_GAME_START)
  }
  
  const setPlayer = (name) => {
    if(isSinglePlayerGame) {
      playerOne = Player(name, true)
      playerTwo = Player("AI", false)
      // We notify the ui to make the board for the computer and for 
      //render the mode for placement in the second
      // playerInAction = playerOne
      Notifier.notify(Notifications.MODE_SET_COMPUTER_UI, playerTwo.getBoard())
      Notifier.notify(Notifications.MODE_PLACE_SHIP, playerOne.name)
      return;
    }

    // TODO: Here goes the logic to make a second player if needed for the future update
  }

  // Returns the current player board for action to be perform to it
  const identifyBoard = (name) => {
    if(name === playerOne.name) {
      return playerOne.getBoard()
    }
    return playerTwo.getBoard()
  }
  const setShip = (name, x, y) => {
    const board = identifyBoard(name)
    const data = board.placeShip(x,y)
   
    if(data === board.ErrorCodes.INVALID_PLACEMENT) {
      Notifier.notify(Notifications.MODE_SEND_MESSAGE, {style: "error" , msg: "INVALID PLACEMENT!"})
      return
    }
    if(data === board.ErrorCodes.SHIP_ALREADY_IN_PLACE) {
      Notifier.notify(Notifications.MODE_SEND_MESSAGE, {style: "error", msg:"SHIP ALREADY IN PLACE SELECT ANOTHER COORDINATE!"})
      return
    }
    // Will change the board when the first player palces all their ships
    return data
  }

  
  const enableSetListeners = (id) => {
    if(id === playerOne.name && playerOne.isHuman) {
      return true
    }

    return false
  }
  const getCoordinates = (id) => {
    const board = identifyBoard(id)
    return board.getCoordinates()
  }

  const getOutlines = (id, x, y) => {
    const board = identifyBoard(id)
    let data = board.getOutline(x,y)
    if(data.errorCode === board.ErrorCodes.INVALID_PLACEMENT) {
      return {arr: data.arr, clr: "red"}
    }
    return {arr: data , clr: "black"}
  }

  const changeShipOrientation = (id) => {
    const board = identifyBoard(id)
    return board.updateShipOrientation()
  }

  const getNextShipName = (id) => {
    const board = identifyBoard(id)
    return board.getNextShipToPlace()
  }

  const hasShipsAvailable = (id) => {
    const board = identifyBoard(id)
    if(!board.hasShipsAvailable()) gameReadyToStart()
    return board.hasShipsAvailable()
  }

  
  // TODO Maybe rename and set the logic for the firing of the boards
  const fireAttackOnCurrentBoard = () => {

  }

  return {
    Notifier,
    GameModes,
    Notifications,
    init,
    setShip,
    getCoordinates,
    getOutlines,
    changeShipOrientation,
    getNextShipName,
    hasShipsAvailable,
    enableSetListeners,
    // getCurrentBoardCoordinates,
    // getCurrentBoardToDropShips,
    // getCurrentBoardOutlines,
    // getCurrentBoardShipNameToPlace,
    // changeCurrentBoardShipOrientation,
    // setShipInCurrentBoard,
    setPlayer,
    setGameMode,
  }
}
