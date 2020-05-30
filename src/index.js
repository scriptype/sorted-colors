window.modules.App = (({
  Utils: { queryId },
  Table: { parseDataFromTable },
  Colors: { removeAlternativeColors, parseColorStrings },
  Chart: initChart
}) => {
  const colorsData = parseDataFromTable( queryId('colorsTable') )
  const uniqueColors = removeAlternativeColors(colorsData.rows)
  const parsedUniqueColors = uniqueColors.map(parseColorStrings)

  return {
    init() {
      initChart({
        colors: parsedUniqueColors
      })
    }
  }
})(window.modules)

window.modules.App.init()
