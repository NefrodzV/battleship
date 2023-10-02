// Makes random placements and firing coordinates
const computer = (function Computer() {
  // Plays already made by the computer
  const plays = []

  const random = () => {
    return Math.floor(Math.random() * 9)
  }

  const fire = () => {
    let x = random()
    let y = random()

    while (plays.some((i) => i.x === x && i.y === y)) {
      x = random()
      y = random()
    }
    const current = { x: x, y: y }
    plays.push(current)
    return current
  }

  return {
    fire,
  }
})()

module.exports = computer
