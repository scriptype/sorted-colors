window.modules.Model = (({
  Utils: {
    randomFrom,
    queryId,
    createState
  },
  Table: { parseDataFromTable },
  Colors: { groupColors, removeAlternativeColors, parseColorStrings },
  EventEmitter: createEventEmitter
}) => {
  const Settings = {
    exampleHues: [13, 25, 36, 47, 105, 150, 178, 210, 240, 297, 336, 350],
    tolerance: {
      min: 5
    }
  }

  const eventEmitter = createEventEmitter()

  const state = {
    hue: randomFrom(Settings.exampleHues),
    mono: false,
    colorList: [],
    tolerance: Settings.tolerance.min,
    colorsData: []
  }

  const setup = ({ colorsTableId, onChange }) => {
    setColorsData(colorsTableId)
    update()
  }

  const setColorsData = (tableId, storage = state) => {
    const colorsData = parseDataFromTable(queryId(tableId))
    const uniqueColors = removeAlternativeColors(colorsData.rows)
    const parsedUniqueColors = uniqueColors.map(parseColorStrings)
    storage.colorsData = parsedUniqueColors
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
    eventEmitter.emit('change')
  }

  return {
    ...eventEmitter,
    setup,
    update,
    data: state,

    // Exports for tests
    setColorsData
  }
})(window.modules)
