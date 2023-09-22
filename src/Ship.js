function Ship(length) {
  let hit_points = 0

  const hit = () => {
    hit_points++
    return hit_points
  }

  const isSunk = () => {
    if (hit_points >= length) return true
    return false
  }
  return {
    hit,
    isSunk,
  }
}

module.exports = Ship
