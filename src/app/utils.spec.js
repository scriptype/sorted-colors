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

/*

test('Utils.getNumbers', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules
  t.end()
})

test('Utils.wait', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules
  t.end()
})

test('Utils.query', async t => {
  const dom = await loadDOM
  const { Utils } = dom.window.modules
  t.end()
})

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
