window.modules.Utils = (() => {
  const { floor, random } = Math

  const randomFrom = array => array[floor(random() * array.length)]

  const getNumbers = n => [...Array(n).keys()]

  const wait = duration => new Promise(resolve => {
    setTimeout(resolve, duration)
  })

  const query = (selector, parent = document) =>
    parent.querySelector(selector)

  const queryAll = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector))

  const queryId = document.getElementById.bind(document)

  const keyCodes = {
    27: 'escape'
  }

  const getKeyCode = event => keyCodes[event.which] || keyCodes[event.keyCode]

  return {
    randomFrom,
    getNumbers,
    wait,
    query,
    queryAll,
    queryId,
    keyCodes,
    getKeyCode
  }
})(window.modules)
