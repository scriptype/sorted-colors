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
    let state = initialState

    const setState = newState  => {
      Object.assign(state, newState)
      onChange(state)
    }

    return {
      state,
      setState,
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
    keyCodes,
    getKeyCode
  }
})(window.modules)
