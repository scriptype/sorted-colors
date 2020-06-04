window.modules.Controller = (({
  Utils: {
    randomFrom,
    queryId,
    createState
  },
  GlobalEvents,
  Table: { parseDataFromTable },
  Colors: { groupColors, removeAlternativeColors, parseColorStrings },
  views: { HueControl, Chart, ColorInfo }
}) => {
  const showColorInfo = colorId => {
    if (Chart.isDeactivating() || ColorInfo.isDeactivating()) {
      return
    }

    Chart.activateColor(colorId)

    const color = parsedUniqueColors.find(c => c.name === colorId)
    ColorInfo.show(color)
  }

  const hideColorInfo = shouldFocusBack => {
    Chart.deactivateColor(shouldFocusBack)
    ColorInfo.hide()
  }

  const toggleMono = isOn => {
    setState({
      mono: isOn,
      prevHue: state.hue,
      hue: isOn ? 0 : state.prevHue
    })
    hideColorInfo()
  }

  const setHue = hue => {
    setState({
      hue
    })
    hideColorInfo()
  }

  const render = ({ hue, mono }) => {
    const colorList = groupColors({
      colorList: parsedUniqueColors,
      tolerance: {
        min: 5
      },
      hue,
      mono
    })

    Chart.render({
      colorList,
      hue,
      mono
    })

    HueControl.render({
      colorList,
      hue,
      mono
    })
  }

  GlobalEvents.onKeyUp('escape', () => {
    if (ColorInfo.isActive()) {
      hideColorInfo(true)
    }
  })

  const colorsData = parseDataFromTable(queryId('colorsTable'))
  const uniqueColors = removeAlternativeColors(colorsData.rows)
  const parsedUniqueColors = uniqueColors.map(parseColorStrings)

  const exampleHues = [13, 25, 36, 47, 105, 150, 178, 210, 240, 297, 336, 350]

  const { state, setState } = createState({
    hue: randomFrom(exampleHues),
    mono: false
  }, render)

  HueControl.setup({
    onToggleMono: toggleMono,
    onChangeHue: setHue
  })

  Chart.setup({
    onClickColor: showColorInfo
  })

  ColorInfo.setup({
    onClose: hideColorInfo.bind(null, true)
  })

  return {
    init() {
      render(state)
    }
  }
})(window.modules)
