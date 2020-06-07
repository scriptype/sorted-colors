const test = require('tape')
const loadDOM = require('../../test-helpers/load-dom')
const { wait, assertSilent } = require('../../test-helpers/utils')

const Selectors = {
  hueSlider: '#hue-slider',
  monoToggle: '#mono-toggle',
  colorButtons: '.color-button',
  colorInfo: '#color-info',
  closeColorInfo: '#close-color-info'
}

const isVisible = (dom, element) => {
  const { getComputedStyle } = dom.window
  const { width, height } = getComputedStyle(element)
  return parseFloat(width) > 0 && parseFloat(height) > 0
}

const clickRandomColor = async (dom, t, { silent } = {}) => {
  const { document } = dom.window

  const colorInfo = document.querySelector(Selectors.colorInfo)
  assertSilent(
    t, !isVisible(dom, colorInfo), 'Color info is not visible before clicking color', silent
  )

  const colorButtons = Array.from(document.querySelectorAll(Selectors.colorButtons))
  const randomColor = colorButtons[Math.floor(Math.random() * colorButtons.length)]

  randomColor.click()
  assertSilent(
    t, isVisible(dom, colorInfo), 'After clicking a color, color info should be visible', silent
  )

  const colorName = randomColor.textContent.trim()
  assertSilent(
    t, colorInfo.textContent.match(new RegExp(colorName, 'gi')), 'Color info shows correct color', silent
  )
}

const deactivateColorInfo = async (dom, t, { silent } = {}) => {
  const { document } = dom.window

  const colorInfo = document.querySelector(Selectors.colorInfo)
  assertSilent(
    t, isVisible(dom, colorInfo), 'Color info is visible before clicking close', silent
  )

  const closeColorInfo = document.querySelector(Selectors.closeColorInfo)
  closeColorInfo.click()

  assertSilent(
    t, !isVisible(dom, colorInfo), 'Color info is not visible after closing it', silent
  )
}

test('App should load with colors of a hue', async t => {
  const dom = await loadDOM(true)
  const { document } = dom.window

  const colorButtons = Array.from(document.querySelectorAll(Selectors.colorButtons))
  t.true(colorButtons.length > 0, 'There are already color buttons')
  t.true(colorButtons.length < 50, "But it's not like crazy ton of them")

  const hueSlider = document.querySelector(Selectors.hueSlider)
  t.true(hueSlider.value !== undefined, 'Hue slider has a value')
  t.true(Number(hueSlider.value) > 0, "And it's bigger than 0 (0 is not an example hue)")
  t.true(Number(hueSlider.value) <= 360, "But also, it can't be bigger than 360")
})

test('Clicking on a color', async t => {
  const dom = await loadDOM(true)
  await clickRandomColor(dom, t)
})

test('Closing color info', async t => {
  const dom = await loadDOM(true)
  await clickRandomColor(dom, t, { silent: true })
  await deactivateColorInfo(dom, t)
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

  const newColors = Array.from(
    document.querySelectorAll(Selectors.colorButtons)
  )

  t.isNotDeepEqual(colors, newColors, 'Changing hue resulted in different colors')

  await wait(800)
  await clickRandomColor(dom, t, { silent: true })
  t.pass('Activating a color worked in new hue')

  await wait(800)
  await deactivateColorInfo(dom, t, { silent: true })
  t.pass('Closing color info worked in new hue')
})

test('Toggling mono', async t => {
  const dom = await loadDOM(true)
  const { document } = dom.window

  const monoToggle = document.querySelector(Selectors.monoToggle)
  const colorInfo = document.querySelector(Selectors.colorInfo)

  const colors = Array.from(
    document.querySelectorAll(Selectors.colorButtons)
  ).map(btn => btn.textContent.trim())

  await clickRandomColor(dom, t, { silent: true })

  monoToggle.click()
  t.false(isVisible(dom, colorInfo), 'Previously visible color info got closed after clicking mono')

  const newColors = Array.from(
    document.querySelectorAll(Selectors.colorButtons)
  ).map(btn => btn.textContent.trim())

  t.isNotDeepEqual(colors, newColors, 'Toggling mono resulted in different colors')

  t.true(
    !colors.includes('black') && newColors.includes('black'),
    'Black is visible only after switching mono on'
  )

  await wait(800)
  await clickRandomColor(dom, t, { silent: true })
  t.pass('Activating a color worked when mono is on')

  monoToggle.click()

  await wait(800)
  await clickRandomColor(dom, t, { silent: true })
  t.pass('Activating a color worked after switching-off mono')

  const newestColors = Array.from(
    document.querySelectorAll(Selectors.colorButtons)
  ).map(btn => btn.textContent.trim())

  t.isNotDeepEqual(newColors, newestColors, 'Toggling mono back changed the colors again')
  t.deepLooseEqual(newestColors, colors, 'Newest colors are same as initial colors')
})
