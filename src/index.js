window.modules.App = (({
  Controller
}) => {
  return {
    init() {
      Controller.init()
    }
  }
})(window.modules)

window.modules.App.init()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js', { scope: '/' })
}
