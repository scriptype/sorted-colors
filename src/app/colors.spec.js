const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

test('Colors.parseColorStrings', async t => {
  const dom = await loadDOM
  const { Colors } = dom.window.modules

  t.deepLooseEqual(
    Colors.parseColorStrings({
      rgb: 'rgb(255,0,12)',
      hsl: 'hsl(51,0%,30%)'
    }),
    {
      rgb: [255, 0, 12],
      hsl: [51, 0, 30]
    },
    'Parses rgb and hsl values correctly'
  )

  t.end()
})

test('Colors.isMonochrome', async t => {
  const dom = await loadDOM
  const { Colors } = dom.window.modules

  const monochromeColor = {
    hsl: [120, 0, 50]
  }

  const nonMonochromeColor = {
    hsl: [0, 1, 0]
  }

  t.true(
    Colors.isMonochrome(monochromeColor),
    'When saturation is 0, it should be monochrome'
  )

  t.false(
    Colors.isMonochrome(nonMonochromeColor),
    "It's not monochrome when saturation is not 0"
  )

  t.end()
})

test('Colors.isNonMonochrome', async t => {
  const dom = await loadDOM
  const { Colors } = dom.window.modules

  const nonMonochromeColor = {
    hsl: [24, 16, 0]
  }

  const monochromeColor = {
    hsl: [55, 0, 3]
  }

  t.true(
    Colors.isNonMonochrome(nonMonochromeColor),
    "When saturation is not 0, it's not monochrome"
  )

  t.false(
    Colors.isNonMonochrome(monochromeColor),
    "It's monochrome When saturation is 0"
  )

  t.end()
})

/*

test('Colors.filterColorsByHue', t => {
  t.end()
})

test('Colors.groupColorsByLightness', t => {
  t.end()
})

test('Colors.groupColors', t => {
  t.end()
})

test('Colors.formatRGB', t => {
  t.end()
})

test('Colors.formatHSL', t => {
  t.end()
})
*/
