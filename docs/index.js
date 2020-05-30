window.modules.App = (({
  Controller
}) => {
  return {
    init() {
      Controller.init();
    }

  };
})(window.modules);

window.modules.App.init();