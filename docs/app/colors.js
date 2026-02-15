function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
window.modules.Colors = (({
  Utils: {
    getNumbers
  }
}) => {
  const {
    abs
  } = Math;

  /*
   * For each color in colorList, check if there's an equivalent color
   * with a different name.
   * Eliminate the non-preferred colors that have equivalents.
   * A color can be thought "preferred", if it has `alternativeName` field in it.
   * e.g. Eliminates fuchsia and aqua in favor of magenta and cyan, respectively.
   */
  const removeAlternativeColors = colorList => {
    return colorList.map((color, index) => {
      const equivalent = colorList.find(c => c !== color && c.hex === color.hex);
      if (!equivalent || color.alternativeName === equivalent.name) {
        return color;
      }
      return null;
    }).filter(c => !!c);
  };
  const parseColorStrings = color => _objectSpread(_objectSpread({}, color), {}, {
    rgb: color.rgb.match(/rgb\((\d+),(\d+),(\d+)\)/).slice(1).map(Number),
    hsl: color.hsl.match(/hsl\((.*),(.*)%,(.*)%\)/).slice(1).map(Number)
  });
  const isMonochrome = color => color.hsl[1] === 0;
  const isNonMonochrome = color => !isMonochrome(color);
  const filterColorsByHue = (colorList, hue, tolerance) => {
    const colors = colorList.filter(color => abs(hue - color.hsl[0]) < tolerance);
    if (colors.length) {
      return {
        list: colors,
        tolerance
      };
    }
    return filterColorsByHue(colorList, hue, tolerance + 1);
  };
  const groupColorsByLightness = (colorList, tolerance) => {
    return getNumbers(100 / tolerance + 1).map(t => colorList.filter(color => {
      const difference = 100 - color.hsl[2] - t * tolerance;
      const differenceLimit = tolerance / 2;
      if (abs(difference) === differenceLimit) {
        return difference > 0;
      }
      return abs(difference) < differenceLimit;
    })).filter(group => !!group.length);
  };
  const groupColors = ({
    colorList,
    hue,
    tolerance,
    mono
  }) => {
    const baseColors = colorList.filter(mono ? isMonochrome : isNonMonochrome);
    const sortedColors = _toConsumableArray(baseColors).sort((a, b) => a.hsl[1] - b.hsl[1]);
    const colorsFilteredByHue = filterColorsByHue(sortedColors, hue, tolerance.min);
    const lightnessGroups = groupColorsByLightness(colorsFilteredByHue.list, tolerance.min);
    return {
      list: lightnessGroups,
      tolerance: colorsFilteredByHue.tolerance
    };
  };
  const formatRGB = rgb => `rgb(${rgb.join(', ')})`;
  const formatHSL = hsl => `hsl(${hsl.map((_, i) => i === 0 ? _ : `${_}%`).join(', ')})`;
  return {
    removeAlternativeColors,
    parseColorStrings,
    isMonochrome,
    isNonMonochrome,
    filterColorsByHue,
    groupColorsByLightness,
    groupColors,
    formatRGB,
    formatHSL
  };
})(window.modules);