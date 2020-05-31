const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

test('Colors.removeAlternativeColors', async t => {
  const dom = await loadDOM
  const { Colors } = dom.window.modules

  const colorList = [
    {
      name: 'some color',
      hex: '#dadada',
      rgb: 'rgb(1,2,3)',
      hsl: 'hsl(100,50%,25%)'
    },
    {
      name: 'preferred color',
      alternativeName: 'unpreferred color',
      hex: '#bebebe',
      rgb: 'rgb(4,5,6)',
      hsl: 'hsl(120,60%,50%)'
    },
    {
      name: 'unpreferred color',
      hex: '#bebebe',
      rgb: 'rgb(4,5,6)',
      hsl: 'hsl(120,60%,50%)'
    }
  ]

  const expected = colorList.filter(c => c.name !== 'unpreferred color')

  t.same(
    Colors.removeAlternativeColors(colorList),
    expected,
    'Removes unpreferred equivalent and preserves others'
  )

  const reversedColorList = [...colorList].reverse()

  const reversedExpected = reversedColorList.filter(
    c => c.name !== 'unpreferred color'
  )

  t.same(
    Colors.removeAlternativeColors(reversedColorList),
    reversedExpected,
    "The order of colors doesn't matter"
  )
})

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
})

test('Colors.filterColorsByHue', async t => {
  const dom = await loadDOM
  const { Colors } = dom.window.modules

  const tolerance = 5

  /*
   * This is prepared to assert that
   * - Saturation and lightness is irrelevant,
   * - Order of colors is irrelevant,
   * - any ONLY hue and tolerance should play role
   */
  const colorList = [
    { hsl: [60, 70, 60] }, // Group A, hue 60 will get them (tol: 5)
    { hsl: [50, 80, 50] }, // Group B, hue 50 will get them (tol: 5)
    { hsl: [200, 90, 40] }, // Group C, hue 200 will get them (tol: 20)

    { hsl: [58, 60, 65] },
    { hsl: [48, 60, 55] },
    { hsl: [190, 80, 45] },

    { hsl: [56, 30, 70] },
    { hsl: [46, 40, 30] },
    { hsl: [181, 90, 85] },

    { hsl: [62, 35, 85] },
    { hsl: [52, 90, 90] },
    { hsl: [210, 10, 25] },
  ]

  const expectedForHue50 = {
    list: [
      { hsl: [50, 80, 50] },
      { hsl: [48, 60, 55] },
      { hsl: [46, 40, 30] },
      { hsl: [52, 90, 90] }
    ],
    tolerance: 5
  }

  const expectedForHue60 = {
    list: [
      { hsl: [60, 70, 60] },
      { hsl: [58, 60, 65] },
      { hsl: [56, 30, 70] },
      { hsl: [62, 35, 85] }
    ],
    tolerance: 5
  }

  // To catch them all, tolerance needs to be 20
  const expectedForHue200 = {
    list: [
      { hsl: [200, 90, 40] }
    ],
    tolerance: 5
  }

  const expectedForHue200Tolerance20 = {
    list: [
      { hsl: [200, 90, 40] },
      { hsl: [190, 80, 45] },
      { hsl: [181, 90, 85] },
      { hsl: [210, 10, 25] }
    ],
    tolerance: 20
  }

  // Starts with tolerance 5, recurses until tolerance 91, then finds one color
  const expectedForHue300 = {
    list: [
      { hsl: [210, 10, 25] }
    ],
    tolerance: 91
  }

  // Starts with tolerance 5, recurses until tolerance 37, then finds one color
  const expectedForHue10 = {
    list: [
      { hsl: [46, 40, 30] }
    ],
    tolerance: 37
  }

  t.deepLooseEqual(
    Colors.filterColorsByHue(colorList, 50, tolerance),
    expectedForHue50,
    'Filters correct colors for hue 50'
  )

  t.deepLooseEqual(
    Colors.filterColorsByHue(colorList, 60, tolerance),
    expectedForHue60,
    'Filters correct colors for hue 60'
  )

  t.deepLooseEqual(
    Colors.filterColorsByHue(colorList, 200, tolerance),
    expectedForHue200,
    'Filters correct colors for hue 200'
  )

  t.deepLooseEqual(
    Colors.filterColorsByHue(colorList, 200, 20),
    expectedForHue200Tolerance20,
    'Filters correct colors for hue 200, tolerance 20'
  )

  t.deepLooseEqual(
    Colors.filterColorsByHue(colorList, 300, tolerance),
    expectedForHue300,
    'Filters correct colors for hue 300'
  )

  t.deepLooseEqual(
    Colors.filterColorsByHue(colorList, 10, tolerance),
    expectedForHue10,
    'Filters correct colors for hue 10'
  )
})

test('Colors.formatRGB', async t => {
  const dom = await loadDOM
  const { Colors } = dom.window.modules

  t.same(
    Colors.formatRGB([255, 0, 5]),
    'rgb(255, 0, 5)',
    'Formats RGB correctly'
  )
})

test('Colors.formatHSL', async t => {
  const dom = await loadDOM
  const { Colors } = dom.window.modules

  t.same(
    Colors.formatHSL([120, 50, 90]),
    'hsl(120, 50%, 90%)',
    'Formats HSL correctly'
  )
})

/*

test('Colors.groupColorsByLightness', t => {
})

test('Colors.groupColors', t => {
})
*/
