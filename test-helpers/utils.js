const wait = duration =>
  new Promise(resolve => setTimeout(resolve, duration))

module.exports = {
  wait
}
