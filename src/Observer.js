function Observer() {
  let observers = []
  return {
    subscribe(func) {
      observers.push()
    },
    unsubscribe(func) {
      observers = observers.filter((observer) => observer !== func)
    },
    notify(data) {
      observers.forEach((observer) => observer(data))
    },
  }
}

module.exports = Observer
