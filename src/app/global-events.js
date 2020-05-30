window.modules.GlobalEvents = (({
  Utils: { getKeyCode }
}) => {
  const onKeyUp = (humanKeyCode, eventListener) => {
    window.addEventListener('keyup', event => {
      if (getKeyCode(event) === humanKeyCode) {
        eventListener(event)
      }
    })
  }

  return {
    onKeyUp
  }
})(window.modules)
