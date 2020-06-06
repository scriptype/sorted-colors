const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

const exampleTableMarkup = `
  <table>
    <thead>
      <tr>
        <th id="name">Name</th>
        <th id="country">Country</th>
      </tr>
    </thead>

    <tbody>
      <tr class="north">
        <td>Siberia</td>
        <td>Russia</td>
      </tr>

      <tr class="south">
        <td>Patagonia</td>
        <td>Argentina / Chile</td>
      </tr>

      <tr class="equatorial">
        <td>Amazon</td>
        <td>Brazil</td>
      </tr>
    </tbody>
  </table>
`

test('Table.parseDataFromTable', async t => {
  const dom = await loadDOM()
  const { Table } = dom.window.modules

  const container = dom.window.document.createElement('div')
  container.innerHTML = exampleTableMarkup
  const exampleTable = container.firstElementChild

  const actual = Table.parseDataFromTable(exampleTable)

  const expected = {
    columns: [
      { id: 'name', name: 'Name' },
      { id: 'country', name: 'Country' }
    ],
    rows: [
      {
        type: 'north',
        name: 'Siberia',
        country: 'Russia'
      },
      {
        type: 'south',
        name: 'Patagonia',
        country: 'Argentina / Chile'
      },
      {
        type: 'equatorial',
        name: 'Amazon',
        country: 'Brazil'
      }
    ]
  }

  t.deepLooseEqual(actual, expected, 'Parsed correctly')
})
