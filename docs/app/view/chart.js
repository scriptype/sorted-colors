window.modules.views.Chart = (({
  Utils: {
    wait,
    query,
    queryId
  }
}) => {
  const dom = {
    chart: queryId('chart')
  };

  const setup = ({
    onClickColor
  }) => {
    dom.chart.addEventListener('click', e => {
      onClickColor(e.target.id);
    });
  };

  const render = ({
    colorList,
    hue,
    mono
  }) => {
    dom.chart.innerHTML = colorList.map(lightnessGroup => `
      <div class="row">
        ${lightnessGroup.map(({
      name,
      type
    }) => {
      const CSSProperties = [`--background: ${name}`, `--color: ${type === 'light' ? 'black' : 'white'}`];
      return `
            <button
              type="button"
              class="color-button"
              id="${name}"
              style="${CSSProperties.join(';')}"
            >
              ${name}
            </button>
          `;
    }).join('')}
      </div>
    `).join('');
  };

  const activateColor = colorId => {
    dom.chart.inert = true;
    dom.chart.classList.add('contain');
    queryId(colorId).classList.add('active');
  };
  /*
   * Can be triggered by:
   * - Clicking on close button in colorInfo
   * - Pressing ESC
   * - Changing hue while colorInfo is open
   *   This scenario requires checking if activeColorButton exists.
   */


  const deactivateColor = shouldFocusBack => {
    dom.chart.inert = false;
    const activeColorButton = query('.color-button.active', dom.chart);

    if (activeColorButton) {
      activeColorButton.classList.add('deactivating');
      activeColorButton.classList.remove('active');
    }

    wait(600).then(() => {
      // Last clicked color is still there. e.g. hue didn't change
      if (activeColorButton) {
        dom.chart.classList.remove('contain');
        /*
         * The crazy reason why we need to clone an element with one className lacking,
         * instead of just removing that className from the existing element is:
         * Some mobile browsers and some (I guess) old versions of Safari fucks up
         * the animation. They run "deactivate" keyframes upon className removal ¯\_(ツ)_/¯
         * When we do it this way and do it with some async involved, it works properly.
         */

        const newActiveColorButton = activeColorButton.cloneNode(true);
        newActiveColorButton.classList.remove('deactivating');
        requestAnimationFrame(() => {
          if (activeColorButton) {
            activeColorButton.replaceWith(newActiveColorButton);

            if (shouldFocusBack) {
              newActiveColorButton.focus();
            }
          }
        });
      }
    });
  };

  const isDeactivating = () => {
    return query('.deactivating', dom.chart);
  };

  return {
    setup,
    render,
    activateColor,
    deactivateColor,
    isDeactivating
  };
})(window.modules);