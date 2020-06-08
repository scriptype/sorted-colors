window.modules.Controller = (({
  GlobalEvents,
  Model,
  views: { HueControl, Chart, ColorInfo }
}) => {
  const init = () => {
    Chart.render()
    HueControl.render()
  }

  const showColorInfo = colorId => {
    if (Chart.isDeactivating() || ColorInfo.isDeactivating()) {
      return
    }

    Model.update({
      colorId
    })

    Chart.activateColor(colorId)

    const color = Model.data.colorsData.find(c => c.name === colorId)
    ColorInfo.show(color)
  }

  const hideColorInfo = shouldFocusBack => {
    Chart.deactivateColor(shouldFocusBack)
    ColorInfo.hide()
  }

  const toggleMono = isOn => {
    const { hue, prevHue } = Model.data
    Model.update({
      mono: isOn,
      prevHue: hue,
      hue: isOn ? 0 : prevHue
    })
    hideColorInfo()
  }

  const setHue = hue => {
    Model.update({
      hue
    })
    hideColorInfo()
  }

  GlobalEvents.onKeyUp('Escape', () => {
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
    onClose: hideColorInfo.bind(null, true),
    onMovePrev() {
      console.log(Model.getPreviousColor())
    },
    onMoveNext() {
      console.log(Model.getNextColor())
    }
  })

  Model.setup({
    colorsTableId: 'colorsTable'
  })

  return {
    init
  }
})(window.modules)
