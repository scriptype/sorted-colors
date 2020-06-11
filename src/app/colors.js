window.modules.Colors = (({
  Utils: { getNumbers }
}) => {
  const { abs, max } = Math

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
    const colors = colorList.filter(color => abs(hue - color.hsl[0]) < tolerance)
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

  /*
   * Finds the next color in either direction.
   *
   * If there are more colors in the same lightness group as the given color, return first of them
   *
   * If there are more lightness groups available in the current list of colors, then move to next group in the given direction and return the first color
   *
   * If none of the above is possible, that means the next color is not in the view yet. So, generate the colors of next hue in the direction. Keep generating until finding a different color, then return it.
   * */
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
    console.log('colorId', colorId, callLimit)
    const lightnessGroup = groupedColors.find(group => {
      return group.find(c => c.name === colorId)
    })

    if (lightnessGroup) {
      console.log('found the lightness group')
      const color = lightnessGroup.find(c => c.name === colorId)
      const colorIndex = lightnessGroup.indexOf(color)
      const lastColorIndex = direction === 1 ? lightnessGroup.length - 1 : 0

      if (colorIndex !== lastColorIndex) {
        console.log('same group, next color')
        return {
          hue,
          tolerance: tolerance.min,
          colorList: groupedColors,
          color: lightnessGroup[colorIndex + direction]
        }
      }

      const lightnessGroupIndex = groupedColors.indexOf(lightnessGroup)
      const lastGroupIndex = direction === 1 ? groupedColors.length - 1 : 0
      if (lightnessGroupIndex !== lastGroupIndex) {
        const newGroupIndex = lightnessGroupIndex + direction
        const newGroup = groupedColors[newGroupIndex]
        const newColor = newGroup[direction === 1 ? 0 : newGroup.length - 1]
        console.log('next group, first color')
        return {
          hue,
          tolerance: tolerance.min,
          colorList: groupedColors,
          color: newColor
        }
      }
    }

    console.log('will search new colors')

    const hueLimit = max(0, 360 * direction)
    const hueStart = 360 - hueLimit
    const newHue = hue === hueLimit ? hueStart : hue + direction
    const { list: newColorList, tolerance: newTolerance } = groupColors({
      hue: newHue,
      mono,
      colorList: allColors,
      tolerance
    })

    const differentColors = newColorList.map(group => {
      return group.map(color => {
        if (groupedColors.every(g => g.every(c => c.name !== color.name))) {
          return color
        }
        return null
      }).filter(Boolean)
    }).filter(group => !!group.length)

    if (differentColors.length) {
      console.log('found it', differentColors)
      const newGroupIndex = direction === 1 ? 0 : differentColors.length - 1
      const newGroup = differentColors[newGroupIndex]
      const newColorIndex = direction === 1 ? 0 : newGroup.length - 1
      const firstNewColor = newGroup[newColorIndex]
      return {
        hue: newHue,
        tolerance: newTolerance,
        colorList: newColorList,
        color: firstNewColor
      }
    }

    console.log('could not find it, recursing')

    return callLimit > 0 ? findNextColor({
      groupedColors: newColorList,
      allColors,
      hue: newHue,
      mono,
      tolerance,
      colorId,
      direction,
      callLimit: callLimit - 1
    }) : undefined
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
    findNextColor,
    formatRGB,
    formatHSL
  }
})(window.modules)
