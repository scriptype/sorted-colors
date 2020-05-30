window.modules.Utils = (() => {
  const { floor, random } = Math

  const randomFrom = array => array[floor(random() * array.length)]

  const getNumbers = n => [...Array(n).keys()]

  const wait = duration => new Promise(resolve => {
    setTimeout(resolve, duration)
  })

  const query = (selector, parent = document) =>
    parent.querySelector.call(parent, selector)

  const queryAll = (selector, parent = document) =>
    Array.from(parent.querySelectorAll.call(parent, selector))

  const queryId = document.getElementById.bind(document)

  const createState = (initialState, onChange) => {
    return {
      state: initialState,
      setState(newState) {
        this.state = Object.assign({}, this.state, newState)
        onChange(this.state)
      }
    }
  }

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
    createState,
    getKeyCode
  }
})(window.modules)
