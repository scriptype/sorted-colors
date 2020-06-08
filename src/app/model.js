window.modules.Model = (({
  Utils: {
    randomFrom,
    queryId,
    createState
  },
  Table: { parseDataFromTable },
  Colors: { groupColors, removeAlternativeColors, parseColorStrings, formatRGB, formatHSL, findNextColor },
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
    colorId: '',
    colorList: [],
    tolerance: Settings.tolerance.min,
    colorsData: []
  }

  const setColorsData = (tableId, storage = state) => {
    const colorsData = parseDataFromTable(queryId(tableId))
    const uniqueColors = removeAlternativeColors(colorsData.rows)
    const parsedUniqueColors = uniqueColors.map(parseColorStrings)
    storage.colorsData = parsedUniqueColors
  }

  const getFormattedRGB = formatRGB
  const getFormattedHSL = formatHSL

  const getPreviousColor = () => {
    return findNextColor({
      direction: -1,
      groupedColors: state.colorList,
      allColors: state.colorsData,
      hue: state.hue,
      mono: state.mono,
      tolerance: Settings.tolerance,
      colorId: state.colorId
    })
  }

  const getNextColor = () => {
    return findNextColor({
      groupedColors: state.colorList,
      allColors: state.colorsData,
      hue: state.hue,
      mono: state.mono,
      tolerance: Settings.tolerance,
      colorId: state.colorId
    })
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

  const setup = ({ colorsTableId, onChange }) => {
    setColorsData(colorsTableId)
    update()
  }

  return {
    ...eventEmitter,
    setup,
    update,
    data: state,

    setColorsData,
    getFormattedRGB,
    getFormattedHSL,
    getPreviousColor,
    getNextColor
  }
})(window.modules)
