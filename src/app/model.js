window.modules.Model = (({
  Utils: {
    randomFrom,
    queryId,
    createState
  },
  Table: { parseDataFromTable },
  Colors: { groupColors, removeAlternativeColors, parseColorStrings }
}) => {
  const Settings = {
    exampleHues: [13, 25, 36, 47, 105, 150, 178, 210, 240, 297, 336, 350],
    tolerance: {
      min: 5
    }
  }

  const state = {
    hue: randomFrom(Settings.exampleHues),
    mono: false,
    colorList: [],
    tolerance: Settings.tolerance.min,
    colorsData: [],
    onChange: () => {}
  }

  const setup = ({ colorsTableId, onChange }) => {
    setColorsData(colorsTableId)
    setCallback(onChange)
    update()
  }

  const setColorsData = (tableId) => {
    const colorsData = parseDataFromTable(queryId(tableId))
    const uniqueColors = removeAlternativeColors(colorsData.rows)
    const parsedUniqueColors = uniqueColors.map(parseColorStrings)
    state.colorsData = parsedUniqueColors
  }

  const setCallback = (callback) => {
    state.onChange = callback
  }

  const getNewState = ({ hue, mono, ...rest }) => {
    const newHue = typeof hue !== 'undefined' ? hue : state.hue
    const newMono = typeof mono !== 'undefined' ? mono : state.mono

    const { list: colorList, tolerance } = groupColors({
      hue: newHue,
      mono: newMono,
      colorList: state.colorsData,
      tolerance: Settings.tolerance
    })

    return {
      hue: newHue,
      mono: newMono,
      colorList,
      tolerance,
      ...rest
    }
  }

  const update = ({ hue, mono, ...rest } = {}) => {
    const newState = getNewState({ hue, mono, ...rest })
    Object.assign(state, newState)
    state.onChange(state)
  }

  return {
    setup,
    update,
    data: state
  }
})(window.modules)
