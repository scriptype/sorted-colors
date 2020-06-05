window.modules.EventEmitter = (() => {
  const listen = listeners =>
    (eventType, eventListener) => {
      listeners[eventType] = listeners[eventType] || []
      listeners[eventType].push(eventListener)
    }

  const emit = listeners =>
    (eventType, payload = {}) => {
      if (listeners[eventType]) {
        listeners[eventType].forEach(eventListener => eventListener(payload))
      }
    }

  return (listeners = {}) => ({
    listen: listen(listeners),
    emit: emit(listeners)
  })
})(window.modules)
