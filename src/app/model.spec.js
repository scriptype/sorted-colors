const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

test('Model.setColorsData', async t => {
  const dom = await loadDOM()
  const { Model } = dom.window.modules

  const isColor = thing => {
    return thing.type && thing.name && thing.hsl && thing.rgb && thing.hex
  }

  const hasDifferentName = (thing, things) => {
    return !things.find(otherThing => otherThing.name === thing.name)
  }

  const storage = {}

  Model.setColorsData('colorsTable', storage)

  t.is(storage.colorsData.length, 139,
    'Correct number of items are retrieved')

  t.true(storage.colorsData.every(isColor),
    'Retrieved items are really colors')

  storage.colorsData.every(color => {
    const otherColors = storage.colorsData.filter(c => c.hex !== color.hex)
    t.is(otherColors.length, storage.colorsData.length - 1,
      '# of colors with a different hex is exactly: AllColors - 1')

    t.true(hasDifferentName(color, otherColors),
      'Every color has a different name')
  })
})
