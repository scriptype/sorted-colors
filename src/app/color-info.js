window.modules.colorInfo = (({
  utils: { wait, query, queryAll },
  colors: { formatRGB, formatHSL }
}) => {

  const props = {
    el: null,
    onClose: () => {}
  }

  const setup = ({ el, onClose }) => {
    props.el = el
    props.onClose = onClose
  }

  const show = (color) => {
    const { type, name, alternativeName, rgb, hsl, hex } = color

    props.el.inert = false
    props.el.classList.add('active')

    const CSSProperties = [
      `--background: ${name}`,
      `--color: ${type === 'light' ? 'black' : 'white'}`
    ]

    props.el.innerHTML = `
      <div class="color-info-container" style="${CSSProperties.join(';')}">
        <h1 class="selectable color-info-name" tabindex="0">
          <span class="marquee">${name}</span>
        </h1>

        ${color.alternativeName ? `
          <p class="color-info-row color-info-row--alter" tabindex="0">
            or <span class="selectable">${color.alternativeName}</span>
          </p>
        `: ''}

        <p class="selectable color-info-row color-info-row--hex" tabindex="0">
          ${color.hex}
        </p>

        <p class="selectable color-info-row color-info-row--rgb" tabindex="0">
          ${formatRGB(color.rgb)}
        </p>

        <p class="selectable color-info-row color-info-row--hsl" tabindex="0">
          ${formatHSL(color.hsl)}
        </p>

        <button
          type="button"
          class="color-info-close-button"
          id="close-color-info"
        >
          <svg class="back-icon" role="img" alt="back icon">
            <use xlink:href="#back-icon"></use>
          </svg>
          back
        </button>
      </div>
    `

    const container = query('.color-info-container', props.el)

    const closeButton = query('#close-color-info', container)
    closeButton.addEventListener('click', props.onClose)

    queryAll('.selectable', container).forEach(selectable => {
      selectable.addEventListener('click', () => select(selectable))
      selectable.addEventListener('focus', () => select(selectable))
    })

    wait(1000).then(() => {
      const computedStyle = getComputedStyle(container)
      const width = parseFloat(computedStyle.width)
      const paddingLeft = parseFloat(computedStyle.paddingLeft)
      const paddingRight = parseFloat(computedStyle.paddingRight)
      const containerWidth = width - (paddingLeft + paddingRight)
      queryAll('.marquee', props.el).forEach(item => {
        const width = item.offsetWidth
        const widthDiff = containerWidth - width
        if (widthDiff >= 0) {
          item.classList.remove('marquee')
          return
        }
        item.style.setProperty('--marquee-amount', `${widthDiff}px`)
      })
    })
  }

  const hide = () => {
    props.el.inert = true
    props.el.classList.add('deactivating')
    props.el.classList.remove('active')
    wait(600).then(() => {
      props.el.classList.remove('deactivating')
    })
  }

  const isActive = () => props.el.classList.contains('active')

  const isDeactivating = () => props.el.classList.contains('deactivating')

  return {
    setup,
    show,
    hide,
    isActive,
    isDeactivating
  }

})(window.modules)
