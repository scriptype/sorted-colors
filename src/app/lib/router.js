window.modules.Router = (({
  EventEmitter: createEventEmitter
}) => {
  const eventEmitter = createEventEmitter()

  const props = {
    routes: {}
  }

  const navigate = (routeName, params) => {
    const path = props.routes[routeName](params)
    history.pushState(params, routeName, `${path}`)
    eventEmitter.emit(`route:${routeName}`)
  }

  const getState = () => history.state

  const setup = ({ routes }) => {
    props.routes = routes
  }

  return {
    ...eventEmitter,
    navigate,
    getState,
    setup
  }
})(window.modules)
