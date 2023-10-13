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
          MODE_REMOVE_HIT_LISTENER:9,
          MODE_UPDATE_TURN: 10,
          MODE_DECLARE_WINNER: 11,
          MODE_COMPUTER_ATTACK:12
  }

  // const ComputerNotifier = {
  //   notify: null
  // }
  // Mode for versus selection
  const GameModes = {
      PLAYER: "Player",
      COMPUTER: "Computer"
  }

  let playerOne = null
  let playerTwo = null

  let turn = 0
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
      Notifier.notify(Notifications.MODE_SET_COMPUTER_UI, playerTwo.name)
      Notifier.notify(Notifications.MODE_GAME_START, 
        {playerOneName: playerOne.name, playerTwoName: playerTwo.name}
      )
  }
  
  const setPlayer = (name) => {
    if(isSinglePlayerGame) {
      playerOne = Player(name, true)
      playerTwo = Player("AI", false)
      
      // Notifier.notify(Notifications.MODE_SET_COMPUTER_UI, playerTwo.name)
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

  // Game loop logic
  // Functions enable the click listeners for firing when needed
  const enableFireListener = (id) => {
    if(isSinglePlayerGame) {
      if(id === playerTwo.name) {
        return true
      }
    }
    return false
  }

  const executeAIAttack = () => {
    const computerAttack = playerTwo.computer.fire()
    console.log(computerAttack)
    const board = playerOne.getBoard()
    const data = board.recieveAttack(computerAttack.x, computerAttack.y)
    if(data === board.AttackCodes.COORDINATE_ALREADY_FIRED) {
      Notifier.notify(Notifications.MODE_SEND_MESSAGE, {style: "error", msg: "Coodinate already fired!"})
      return
    }

    // If the attack missed return the color orange
    if(data === board.AttackCodes.MISSED_ATTACK) {
      Notifier.notify(Notifications.MODE_COMPUTER_ATTACK, {clr: "orange", computerAttack})
    }

    //If the attack was successful return the color red
    if(data === board.AttackCodes.HIT) {
      Notifier.notify(Notifications.MODE_COMPUTER_ATTACK, {clr: "red", computerAttack})
    }

    if(data === board.AttackCodes.SUNK_SHIP) {
      Notifier.notify(Notifications.MODE_COMPUTER_ATTACK, {clr: "sunk", computerAttack})
    }
  }

  const updateCurrentTurn = () => {

  }
  // Logic to handle the fire logic when the game starts
  const fireBoard = (id, x, y) => {
    if(isSinglePlayerGame) {
      const board = identifyBoard(id)
      const data = board.recieveAttack(x,y)

      
      if(data === board.AttackCodes.COORDINATE_ALREADY_FIRED) {
        Notifier.notify(Notifications.MODE_SEND_MESSAGE, {style: "error", msg: "Coodinate already fired!"})
        return
      }
      if(id === playerTwo.name) { executeAIAttack() }
      // If the attack missed return the color orange
      if(data === board.AttackCodes.MISSED_ATTACK) {
        return "orange"
      }

      //If the attack was successful return the color red
      if(data === board.AttackCodes.HIT) {
        return "red"
      }

      if(data === board.AttackCodes.SUNK_SHIP) {
        console.log(data)
        console.log("ship has sunk")
        return "sunk"
      }

      // Need to make the case of sunk ship
    }
  }

  const enableShipsVisibility = (id) => {
    if(id === playerTwo.name) {
      return true
    }
    return false
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
    setPlayer,
    setGameMode,
    enableFireListener,
    fireBoard,
    enableShipsVisibility
  }
}
