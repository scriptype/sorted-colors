window.modules.App = (({
  utils: { queryId }
}) => {
  const { parseDataFromTable } = modules.table
  const { removeAlternativeColors, parseColorStrings } = modules.colors
  const initChart = modules.chart

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
