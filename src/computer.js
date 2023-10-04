// Makes random placements and firing coordinates
// Makes the boardcoordinates and set the to false when they are not hit
const computer = (function Computer() {
  // Plays already made by the computer

  const plays = []

  const COORDINATES_LENGTH = 10

  const create = (() => {
    for (let y = 0; y < COORDINATES_LENGTH; y++) {
      for (let x = 0; x < COORDINATES_LENGTH; x++) {
        plays.push({ x: x, y: y })
      }
    }
  })()

  const random = (length) => {
    return Math.floor(Math.random() * length)
  }

  const fire = () => {
    const pointer = random(plays.length)
    const choice = plays.splice(pointer, 1)[0]
    return choice
  }

  return {
    fire,
  }
})()

module.exports = computer
