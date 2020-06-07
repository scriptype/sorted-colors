window.modules.Controller = (({
  Router,
  Routes,
  GlobalEvents,
  Model,
  Table: { parseDataFromTable },
  Colors: { groupColors, removeAlternativeColors, parseColorStrings },
  views: { HueControl, Chart, ColorInfo }
}) => {
  const init = () => {
    const initialState = Router.getState()

    if (!initialState) {
      Chart.render()
      HueControl.render()
      return
    }

    console.log('initialState', initialState)

    Model.update({
      mono: initialState.mono,
      hue: initialState.mono ? 0 : initialState.hue
    })

    if (initialState.color) {
      showColorInfo(initialState.color)
    }
  }

  const showColorInfo = colorId => {
    if (Chart.isDeactivating() || ColorInfo.isDeactivating()) {
      return
    }

    Chart.activateColor(colorId)

    const color = Model.data.colorsData.find(c => c.name === colorId)
    ColorInfo.show(color)

    Router.navigate('colorView', {
      mono: Model.data.mono,
      hue: Model.data.hue,
      color: color.name
    })
  }

  const hideColorInfo = shouldFocusBack => {
    Chart.deactivateColor(shouldFocusBack)
    ColorInfo.hide()

    Router.navigate('hueView', {
      mono: Model.data.mono,
      hue: Model.data.hue
    })
  }

  const toggleMono = isOn => {
    const { hue, prevHue } = Model.data

    Model.update({
      mono: isOn,
      prevHue: hue,
      hue: isOn ? 0 : prevHue
    })

    Router.navigate('hueView', {
      mono: isOn,
      hue: hue
    })

    hideColorInfo()
  }

  const setHue = hue => {
    Router.navigate('hueView', {
      mono: Model.data.mono,
      hue
    })

    Model.update({
      hue
    })

    hideColorInfo()
  }

  GlobalEvents.onKeyUp('escape', () => {
    if (ColorInfo.isActive()) {
      hideColorInfo(true)
    }
  })

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

  Router.setup({
    routes: Routes
  })

  Model.setup({
    colorsTableId: 'colorsTable'
  })

  return {
    init
  }
})(window.modules)
