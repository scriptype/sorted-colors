const util = require('util')
const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')

const { config } = require('../package.json')

const htmlPath = path.resolve(__dirname, '..', config.distDir, 'index.html')

const readFile = util.promisify(fs.readFile)

const loadDOM = readFile(htmlPath)
  .then(html => new JSDOM(html, {
    url: `file:///${htmlPath}`,
    resources: 'usable',
    runScripts: 'dangerously'
  }))
  .then(dom => {
    return new Promise(resolve => {
      const limit = 100
      let pollCount = 0
      const interval = setInterval(() => {
        console.log('polling dom:', pollCount++, `/ ${limit}`)
        if (dom.window.document.querySelector('#chart').childNodes.length) {
          clearInterval(interval)
          resolve(dom)
        }
        if (pollCount >= limit) {
          clearInterval(interval)
        }
      }, 100)
    })
  })

module.exports = loadDOM
