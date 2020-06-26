const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

test('EventEmitter.listen', async t => {
  const dom = await loadDOM()
  const { EventEmitter: createEventEmitter } = dom.window.modules

  t.plan(1)

  const myEventEmitter = createEventEmitter()

  const testPayload = { test: 'pass' }

  myEventEmitter.listen('change', payload => {
    t.is(payload, testPayload, 'Listener is called with correct payload')
  })

  myEventEmitter.emit('change', testPayload)
})

test('EventEmitter.emit', async t => {
  const dom = await loadDOM()
  const { EventEmitter: createEventEmitter } = dom.window.modules

  t.plan(2)

  const testPayload = { test: 'pass' }

  const listeners = {
    meh: [
      () => t.fail("This listener shouldn't have been called at all")
    ],

    blabla: [
      payload => t.is(payload, testPayload, 'Listeners is called with correct payload when the correct event is emitted'),

      payload => t.is(payload, testPayload, 'Listeners is called with correct payload when the correct event is emitted')
    ]
  }

  const myEventEmitter = createEventEmitter(listeners)

  myEventEmitter.emit('blabla', testPayload)
})
