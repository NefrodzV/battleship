const computer = require("../computer")

test("Fire function must not return duplicate objects", () => {
  const values = []
  let hasDuplicate = false
  for (let i = 0; i < 100; i++) {
    const value = computer.fire()
    if (values.some((i) => i.x === value.x && i.y === value.y)) {
      hasDuplicate = true
      break
    }
    values.push(value)
  }

  expect(hasDuplicate).toBe(false)
})
