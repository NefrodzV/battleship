// Maybe be able to run functions in the constructor
export default function Game() {

  // What will be display to the user interface
  const Notifications = {
          MODE_SELECTION: 0
  }

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

  
  // Needs to run after the object is initialized
  const init = () => {
    if(playerOne === null && playerTwo === null) {
      Notifier.notify(Notifications.MODE_SELECTION)
      // But this code is running before the object instance
      
    }
  }
  
  const setGameMode = (mode) => {
    console.log(mode)
  }
  
 
  return {
    setGameMode,
    Notifier,
    init,
    GameModes,
    Notifications,
  }
}
