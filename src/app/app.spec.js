const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')

const Selectors = {
  colorButtons: '.color-button',
  hueSlider: '#hue-slider',
  colorInfo: '#color-info',
  closeColorInfo: '#close-color-info'
}

const isVisible = (dom, element) => {
  const { getComputedStyle } = dom.window
  const { width, height } = getComputedStyle(element)
  return parseFloat(width) > 0 && parseFloat(height) > 0
}

const testClickingOnAColor = async (dom, t) => {
  const { document } = dom.window

  const colorInfo = document.querySelector(Selectors.colorInfo)
  t.false(
    isVisible(dom, colorInfo),
    'Color info is not visible before clicking color'
  )

  const colorButtons = Array.from(document.querySelectorAll(Selectors.colorButtons))
  const randomColor = colorButtons[Math.floor(Math.random() * colorButtons.length)]

  randomColor.click()

  t.true(
    isVisible(dom, colorInfo),
    'After clicking a color, color info should be visible'
  )

  const colorName = randomColor.textContent.trim()
  t.true(
    colorInfo.textContent.match(new RegExp(colorName, 'gi')),
    'Color info shows correct color'
  )
}

const testClosingColorInfo = async (dom, t) => {
  const { document } = dom.window

  const colorInfo = document.querySelector(Selectors.colorInfo)
  t.true(isVisible(dom, colorInfo), 'Color info is visible before clicking close')

  const closeColorInfo = document.querySelector(Selectors.closeColorInfo)
  closeColorInfo.click()

  t.false(isVisible(dom, colorInfo), 'Color info is not visible after closing it')
}

test('App should load with colors of a hue', async t => {
  const dom = await loadDOM(true)
  const { document } = dom.window

  const colorButtons = Array.from(document.querySelectorAll(Selectors.colorButtons))
  t.true(colorButtons.length > 0, 'There are already color buttons')
  t.true(colorButtons.length < 50, "But it's not like crazy ton of them")

  const hueSlider = document.querySelector(Selectors.hueSlider)
  t.true(hueSlider.value !== undefined, 'Hue slider has a value')
  t.true(Number(hueSlider.value) > 0, 'And that value is bigger than 0 (0 is not an example hue)')
  t.true(Number(hueSlider.value) <= 360, "But also, it can't be bigger than 360")
})

test('Clicking on a color', async t => {
  const dom = await loadDOM(true)
  await testClickingOnAColor(dom, t)
})

test('Closing color info', async t => {
  const dom = await loadDOM(true)
  await testClickingOnAColor(dom, t)
  await testClosingColorInfo(dom, t)
})

test('Changing hue', async t => {
  const dom = await loadDOM(true)
  const { document, InputEvent } = dom.window

  const hueSlider = document.querySelector(Selectors.hueSlider)
  const currentHue = Number(hueSlider.value)

  const colors = Array.from(
    document.querySelectorAll(Selectors.colorButtons)
  ).map(btn => btn.textContent.trim())

  hueSlider.value = 360 - currentHue > 180
    ? currentHue + 10 + Math.round(Math.random() * 60)
    : currentHue - 10 - Math.round(Math.random() * 60)
  hueSlider.dispatchEvent(new InputEvent('input'))

  await new Promise(resolve => setTimeout(resolve, 500))

  const newColors = Array.from(
    document.querySelectorAll(Selectors.colorButtons)
  )

  t.isNotDeepEqual(colors, newColors, 'Changing hue resulted in different colors')
})
