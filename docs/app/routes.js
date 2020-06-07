window.modules.Routes = (() => {
  return {
    hueView: ({
      hue,
      mono
    }) => `?h=${mono ? 'mono' : hue}`,
    colorView: ({
      hue,
      color,
      mono
    }) => `?h=${mono ? 'mono' : hue}&c=${color}`
  };
})(window.modules);