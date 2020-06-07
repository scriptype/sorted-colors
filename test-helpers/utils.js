const wait = duration =>
  new Promise(resolve => setTimeout(resolve, duration))

// Make assertion only when it's not silent. When it's silent, if assertion is not true, throw error
const assertSilent = (t, assertion, message, silent) => {
  if (silent) {
    if (!assertion) {
      throw new Error(message)
    }
    return
  }
  t.ok(assertion, message)
}

module.exports = {
  wait,
  assertSilent
}
