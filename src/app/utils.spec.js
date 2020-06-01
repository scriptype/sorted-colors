const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

test('Utils.randomFrom', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules

  const collect = storage => {
    for (let i = 0; i < 100; i++) {
      storage.push(Utils.randomFrom(inputArray))
      const missingItem = inputArray.find(e => !storage.includes(e))
      if (!missingItem) {
        t.pass('It eventually returns every item')
        break
      }
    }
  }

  const inputArray = ['a', 'b', 'c']

  const samples = []

  for (let i = 0; i < 10; i++) {
    const sample = []
    samples.push(sample)
    collect(sample)
  }

  const areSamplesDifferent = samples.some(sampleResults => {
    return samples.find(sample => {
      return JSON.stringify(sample) !== JSON.stringify(sampleResults)
    })
  })

  t.true(areSamplesDifferent, 'Outputs different results')
})

test('Utils.getNumbers', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules

  const count = 5

  t.deepLooseEqual(
    Utils.getNumbers(count),
    [0, 1, 2, 3, 4],
    'It creates an array of numbers starting from 0 until the given number [0, number)'
  )
})

test('Utils.wait', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules

  const duration = 300
  const timeStart = Date.now()
  const result = Utils.wait(duration)

  t.true(result.then, 'Returns a Promise')

  await result

  const timeEnd = Date.now()
  const difference = timeEnd - timeStart
  const tolerableDelay = 30

  t.true(
    difference >= duration && difference - duration <= tolerableDelay,
    'It resolves after (with a tolerable delay) given duration'
  )
})

test('Utils.query', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules

  t.same(
    Utils.query('body'),
    dom.window.document.body,
    'Retrieves an element'
  )

  const container = dom.window.document.createElement('div')
  const element = dom.window.document.createElement('p')
  element.id = 'test-element'
  container.appendChild(element)

  t.same(
    Utils.query('#test-element', container),
    element,
    'If provided, it queries within a parent dom element'
  )
})

/*

test('Utils.queryAll', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules
  t.end()
})

test('Utils.queryId', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules
  t.end()
})

test('Utils.createState', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules
  t.end()
})

test('Utils.getKeyCode', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules
  t.end()
})

*/
