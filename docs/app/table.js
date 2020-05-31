function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

window.modules.Table = (({
  Utils: {
    queryAll
  }
}) => {
  const parseDataFromTable = table => {
    const headers = queryAll('thead th', table);
    const values = queryAll('tbody tr', table);
    const columns = headers.map(header => ({
      id: header.id,
      name: header.textContent
    }));
    const rows = values.map(value => {
      const cells = queryAll('td', value);
      return cells.reduce((row, cell, colIndex) => {
        const columnId = columns[colIndex].id;
        return _objectSpread(_objectSpread({}, row), {}, {
          [columnId]: cell.textContent
        });
      }, {
        type: value.getAttribute('class')
      });
    });
    return {
      columns,
      rows
    };
  };

  return {
    parseDataFromTable
  };
})(window.modules);