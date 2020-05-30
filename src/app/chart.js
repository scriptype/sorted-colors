window.modules.Chart = (({
  Utils: {
    randomFrom,
    wait,
    query,
    queryAll,
    queryId,
    createState,
    getKeyCode
  },
  Colors: { groupColors },
  ColorInfo
}) => {

  return ({ colors }) => {
    const dom = {
      chart: queryId('chart'),
      chartContainer: queryId('chart-container'),
      hueSlider: queryId('hue-slider'),
      hueValueDisplay: queryId('hue-value'),
      toleranceText: queryId('tolerance-text'),
      toleranceValueDisplay: queryId('tolerance-value'),
      monoToggle: queryId('mono-toggle'),
      saturationAxis: queryId('saturation-axis')
    }

    const render = (state) => {
      const { hue, mono } = state

      const colorList = groupColors({
        colorList: colors,
        tolerance: {
          min: 5
        },
        hue,
        mono
      })

      ColorInfo.setup({
        el: queryId('color-info'),
        onClose: hideColorInfo.bind(null, true)
      })

      const html = colorList.list.map(lightnessGroup => `
        <div class="row">
          ${lightnessGroup.map(({ name, type}) => {
            const CSSProperties = [
              `--background: ${name}`,
              `--color: ${type === 'light' ? 'black' : 'white'}`
            ]

            return `
              <button
                type="button"
                class="color-button"
                id="${name}"
                style="${CSSProperties.join(';')}"
              >
                ${name}
              </button>
            `
          }).join('')}
        </div>
      `).join('')

      const sliderPos = hue / 360

      dom.hueSlider.classList.toggle('mono', !!mono)
      dom.toleranceText.classList.toggle('hidden', !!mono)
      dom.saturationAxis.classList.toggle('hidden', !!mono)
      if (mono) {
        dom.hueValueDisplay.innerText = 0
      } else {
        dom.hueValueDisplay.innerText = hue
      }

      dom.hueSlider.style.setProperty('--pos', sliderPos)
      dom.hueSlider.value = hue
      dom.toleranceValueDisplay.innerHTML = colorList.tolerance
      dom.chart.innerHTML = html
    }


    const showColorInfo = e => {
      if (query('.deactivating', dom.chart) || ColorInfo.isDeactivating()) {
        return
      }

      dom.chart.inert = true
      dom.chart.classList.add('contain')
      e.target.classList.add('active')

      const color = colors.find(c => c.name === e.target.id)
      ColorInfo.show(color)
    }

    /*
     * Can be triggered by:
     * - Clicking on close button in colorInfo
     * - Pressing ESC
     * - Changing hue while colorInfo is open
     *   This scenario requires checking if activeColorButton exists.
     */
    const hideColorInfo = shouldFocusBack => {
      dom.chart.inert = false
      ColorInfo.hide()
      const activeColorButton = query('.color-button.active', dom.chart)
      if (activeColorButton) {
        activeColorButton.classList.add('deactivating')
        activeColorButton.classList.remove('active')
      }

      wait(600).then(() => {
        // Last clicked color is still there. e.g. hue didn't change
        if (activeColorButton) {
          dom.chart.classList.remove('contain')

          /*
           * The crazy reason why we need to clone an element with one className lacking,
           * instead of just removing that className from the existing element is:
           * Some mobile browsers and some (I guess) old versions of Safari fucks up
           * the animation. They run "deactivate" keyframes upon className removal ¯\_(ツ)_/¯
           * When we do it this way and do it with some async involved, it works properly.
           */
          const newActiveColorButton = activeColorButton.cloneNode(true)
          newActiveColorButton.classList.remove('deactivating')
          requestAnimationFrame(() => {
            if (activeColorButton) {
              activeColorButton.replaceWith(newActiveColorButton)
              if (shouldFocusBack) {
                newActiveColorButton.focus()
              }
            }
          })
        }
      })
    }

    const exampleHues = [13, 25, 36, 47, 105, 150, 178, 210, 240, 297, 336, 350]

    const ui = createState({
      hue: randomFrom(exampleHues),
      mono: false
    }, render)

    render(ui.state)

    dom.monoToggle.addEventListener('change', e => {
      ui.setState({
        mono: e.target.checked,
        prevHue: ui.state.hue,
        hue: e.target.checked ? 0 : ui.state.prevHue
      })
      hideColorInfo()
    })

    dom.hueSlider.addEventListener('input', e => {
      ui.setState({
        hue: Number(e.target.value),
      })
      hideColorInfo()
    })

    dom.chart.addEventListener('click', showColorInfo)

    window.addEventListener('keyup', e => {
      if (getKeyCode(e) === 'escape' && ColorInfo.isActive()) {
        hideColorInfo(true)
      }
    })
  }

})(window.modules)
