const messageComponent = (function Message() {
    const message = document.createElement("div")
    message.classList.add("msg")
    document.body.append(message)

    return {
      show(style, msg) {
        message.classList.add(style)
        message.textContent = msg
        message.toggleAttribute("show")

        setTimeout(() => {
          message.toggleAttribute("show")
          message.textContent = ""
        }, 2000)
      },
    }
  })()

export {messageComponent}