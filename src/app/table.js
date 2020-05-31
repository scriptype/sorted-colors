window.modules.Table = (({
  Utils: { queryAll }
}) => {

  const parseDataFromTable = table => {
    const headers = queryAll('thead th', table)
    const values = queryAll('tbody tr', table)

    const columns = headers.map(header => ({
      id: header.id,
      name: header.textContent
    }))

    const rows = values.map(value => {
      const cells = queryAll('td', value)
      return cells.reduce((row, cell, colIndex) => {
        const columnId = columns[colIndex].id
        return {
          ...row,
          [columnId]: cell.textContent
        }
      }, {
        type: value.getAttribute('class')
      })
    })

    return {
      columns,
      rows
    }
  }

  return {
    parseDataFromTable
  }

})(window.modules)
