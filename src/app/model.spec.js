const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

test('Model.setColorsData', async t => {
  const dom = await loadDOM
  const { Model } = dom.window.modules

  const isColor = thing => {
    return thing.type && thing.name && thing.hsl && thing.rgb && thing.hex
  }

  const storage = {}

  Model.setColorsData('colorsTable', storage)

  t.is(storage.colorsData.length, 139, 'Correct number of items are retrieved to storage')

  t.true(storage.colorsData.every(isColor), 'Retrieved items are really colors')
})
