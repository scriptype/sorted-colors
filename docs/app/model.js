const _excluded = ["hue", "mono"],
  _excluded2 = ["hue", "mono"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
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
  const setup = ({
    colorsTableId,
    onChange
  }) => {
    setColorsData(colorsTableId);
    update();
  };
  const setColorsData = (tableId, storage = state) => {
    const colorsData = parseDataFromTable(queryId(tableId));
    const uniqueColors = removeAlternativeColors(colorsData.rows);
    const parsedUniqueColors = uniqueColors.map(parseColorStrings);
    storage.colorsData = parsedUniqueColors;
  };
  const getNewState = _ref => {
    let {
        hue,
        mono
      } = _ref,
      rest = _objectWithoutProperties(_ref, _excluded);
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
      rest = _objectWithoutProperties(_ref2, _excluded2);
    const newState = getNewState(_objectSpread({
      hue,
      mono
    }, rest));
    Object.assign(state, newState);
    eventEmitter.emit('change');
  };
  return _objectSpread(_objectSpread({}, eventEmitter), {}, {
    setup,
    update,
    data: state,
    // Exports for tests
    setColorsData
  });
})(window.modules);