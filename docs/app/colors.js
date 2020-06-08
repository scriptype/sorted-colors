function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

window.modules.Colors = (({
  Utils: {
    getNumbers
  }
}) => {
  const {
    abs,
    max
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

  const findNextColor = ({
    groupedColors,
    allColors,
    hue,
    mono,
    tolerance,
    colorId,
    direction = 1,
    callLimit = 360
  }) => {
    const lightnessGroup = groupedColors.find(group => {
      return group.find(c => c.name === colorId);
    });
    const color = lightnessGroup.find(c => c.name === colorId);
    const colorIndex = lightnessGroup.indexOf(color);
    const lastColorIndex = direction === 1 ? lightnessGroup.length - 1 : 0;

    if (colorIndex !== lastColorIndex) {
      return lightnessGroup[colorIndex + direction];
    }

    const lightnessGroupIndex = groupedColors.indexOf(lightnessGroup);
    const lastGroupIndex = direction === 1 ? groupedColors.length - 1 : 0;

    if (lightnessGroupIndex !== lastGroupIndex) {
      return groupedColors[lightnessGroupIndex + direction][0];
    }

    const hueLimit = max(0, 360 * direction);
    const hueStart = 360 - hueLimit;
    const reachedLimit = abs(hueLimit - hue + direction);
    const newHue = reachedLimit ? hueStart : hue + direction;
    const {
      list: newColorList
    } = groupColors({
      hue: newHue,
      mono,
      colorList: allColors,
      tolerance
    });
    const firstOldColor = groupedColors[0][0];
    const firstNewColor = newColorList[0][0];

    if (firstNewColor.name !== firstOldColor.name) {
      return firstNewColor;
    }

    return callLimit > 0 ? findNextColor({
      groupedColors: newColorList,
      allColors,
      hue: newHue,
      mono,
      tolerance,
      colorId,
      direction,
      i: callLimit - 1
    }) : undefined;
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
    findNextColor,
    formatRGB,
    formatHSL
  };
})(window.modules);