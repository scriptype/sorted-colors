const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

test('GlobalEvents.onKeyUp', async t => {
  const dom = await loadDOM
  const { GlobalEvents, Utils } = dom.window.modules

  const eventListener = event => {
    t.ok(event, 'eventListener is called; event object is passed')
  }

  const keyCode = 27 // This is the only keyCode mapped in Utils.
  const humanKeyCode = Utils.getKeyCode(keyCode)
  GlobalEvents.onKeyUp(humanKeyCode, eventListener)

  const event = dom.window.document.createEvent('KeyboardEvent')
  event.initEvent('keyup', true, true)
  event.keyCode = keyCode
  dom.window.document.dispatchEvent(event)

  t.plan(1)
})
