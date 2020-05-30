window.modules.Controller = (({
  Utils: {
    randomFrom,
    queryId,
    createState
  },
  GlobalEvents,
  Table: {
    parseDataFromTable
  },
  Colors: {
    groupColors,
    removeAlternativeColors,
    parseColorStrings
  },
  HueControl,
  Chart,
  ColorInfo
}) => {
  const showColorInfo = colorId => {
    if (Chart.isDeactivating() || ColorInfo.isDeactivating()) {
      return;
    }

    Chart.activateColor(colorId);
    const color = parsedUniqueColors.find(c => c.name === colorId);
    ColorInfo.show(color);
  };

  const hideColorInfo = shouldFocusBack => {
    Chart.deactivateColor(shouldFocusBack);
    ColorInfo.hide();
  };

  const onToggleMono = isChecked => {
    ui.setState({
      mono: isChecked,
      prevHue: ui.state.hue,
      hue: isChecked ? 0 : ui.state.prevHue
    });
    hideColorInfo();
  };

  const onChangeHue = hue => {
    ui.setState({
      hue
    });
    hideColorInfo();
  };

  GlobalEvents.onKeyUp('escape', () => {
    if (ColorInfo.isActive()) {
      hideColorInfo(true);
    }
  });

  const render = ({
    hue,
    mono
  }) => {
    const colorList = groupColors({
      colorList: parsedUniqueColors,
      tolerance: {
        min: 5
      },
      hue,
      mono
    });
    Chart.render({
      colorList,
      hue,
      mono
    });
    HueControl.render({
      colorList,
      hue,
      mono
    });
  };

  const colorsData = parseDataFromTable(queryId('colorsTable'));
  const uniqueColors = removeAlternativeColors(colorsData.rows);
  const parsedUniqueColors = uniqueColors.map(parseColorStrings);
  const exampleHues = [13, 25, 36, 47, 105, 150, 178, 210, 240, 297, 336, 350];
  const ui = createState({
    hue: randomFrom(exampleHues),
    mono: false
  }, render);
  HueControl.setup({
    onToggleMono,
    onChangeHue
  });
  Chart.setup({
    onClickColor: showColorInfo
  });
  ColorInfo.setup({
    onClose: hideColorInfo.bind(null, true)
  });
  return {
    init() {
      render(ui.state);
    }

  };
})(window.modules);