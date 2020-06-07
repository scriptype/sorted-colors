function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

window.modules.Model = (({
  Utils: {
    randomFrom,
    queryId,
    createState
  },
  Table: {
    parseDataFromTable
  },
  Colors: {
    groupColors,
    removeAlternativeColors,
    parseColorStrings
  },
  EventEmitter: createEventEmitter
}) => {
  const Settings = {
    exampleHues: [13, 25, 36, 47, 105, 150, 178, 210, 240, 297, 336, 350],
    tolerance: {
      min: 5
    }
  };
  const eventEmitter = createEventEmitter();
  const state = {
    hue: randomFrom(Settings.exampleHues),
    mono: false,
    colorList: [],
    tolerance: Settings.tolerance.min,
    colorsData: []
  };

  const setColorsData = (tableId, storage = state) => {
    const colorsData = parseDataFromTable(queryId(tableId));
    const uniqueColors = removeAlternativeColors(colorsData.rows);
    const parsedUniqueColors = uniqueColors.map(parseColorStrings);
    storage.colorsData = parsedUniqueColors;
  };

  const getNewState = (_ref) => {
    let {
      hue,
      mono
    } = _ref,
        rest = _objectWithoutProperties(_ref, ["hue", "mono"]);

    const newHue = typeof hue !== 'undefined' ? hue : state.hue;
    const newMono = typeof mono !== 'undefined' ? mono : state.mono;
    const {
      list: colorList,
      tolerance
    } = groupColors({
      hue: newHue,
      mono: newMono,
      colorList: state.colorsData,
      tolerance: Settings.tolerance
    });
    return _objectSpread({
      hue: newHue,
      mono: newMono,
      colorList,
      tolerance
    }, rest);
  };

  const update = (_ref2 = {}) => {
    let {
      hue,
      mono
    } = _ref2,
        rest = _objectWithoutProperties(_ref2, ["hue", "mono"]);

    const newState = getNewState(_objectSpread({
      hue,
      mono
    }, rest));
    Object.assign(state, newState);
    eventEmitter.emit('change');
  };

  const setup = ({
    colorsTableId,
    initialState
  }) => {
    setColorsData(colorsTableId);
    update(initialState);
  };

  return _objectSpread(_objectSpread({}, eventEmitter), {}, {
    setup,
    update,
    data: state,
    // Exports for tests
    setColorsData
  });
})(window.modules);