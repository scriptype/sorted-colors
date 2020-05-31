window.modules.Colors = (({
  Utils: { getNumbers }
}) => {

  const { abs } = Math

  /*
   * For each color in colorList, check if there's an equivalent color
   * with a different name.
   * Eliminate the non-preferred colors that have equivalents.
   * A color can be thought "preferred", if it has `alternativeName` field in it.
   * e.g. Eliminates fuchsia and aqua in favor of magenta and cyan, respectively.
   */
  const removeAlternativeColors = colorList => {
    return colorList.map((color, index) => {
      const equivalent = colorList.find(c => c !== color && c.hex === color.hex)
      if (!equivalent || color.alternativeName === equivalent.name) {
        return color
      }
      return null
    }).filter(c => !!c)
  }

  const parseColorStrings = color => ({
    ...color,
    rgb: color.rgb.match(/rgb\((\d+),(\d+),(\d+)\)/).slice(1).map(Number),
    hsl: color.hsl.match(/hsl\((.*),(.*)%,(.*)%\)/).slice(1).map(Number)
  })

  const isMonochrome = color => color.hsl[1] === 0
  const isNonMonochrome = color => !isMonochrome(color)

  const filterColorsByHue = (colorList, hue, tolerance) => {
    const colors = colorList.filter(color =>  abs(hue - color.hsl[0]) < tolerance)
    if (colors.length) {
      return {
        list: colors,
        tolerance
      }
    }
    return filterColorsByHue(colorList, hue, tolerance + 1)
  }

  const groupColorsByLightness = (colorList, tolerance) => {
    return getNumbers(100 / tolerance + 1).map(t =>
      colorList.filter(color => {
        const difference = 100 - color.hsl[2] - t * tolerance
        const differenceLimit = tolerance / 2
        if (abs(difference) === differenceLimit) {
          return difference > 0
        }
        return abs(difference) < differenceLimit
      })
    ).filter(group => !!group.length)
  }

  const groupColors = ({ colorList, hue, tolerance, mono }) => {
    const baseColors = colorList.filter(mono ? isMonochrome : isNonMonochrome)
    const sortedColors = [...baseColors].sort((a, b) => a.hsl[1] - b.hsl[1])

    const colorsFilteredByHue = filterColorsByHue(sortedColors, hue, tolerance.min)

    const lightnessGroups = groupColorsByLightness(colorsFilteredByHue.list, tolerance.min)

    return {
      list: lightnessGroups,
      tolerance: colorsFilteredByHue.tolerance
    }
  }

  const formatRGB = rgb => `rgb(${rgb.join(', ')})`

  const formatHSL = hsl => `hsl(${hsl.map((_, i) => i === 0 ? _ : `${_}%`).join(', ')})`

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
  }

})(window.modules)
