function clone (array) {
  return array === undefined
    ? []
    : JSON.parse(JSON.stringify(array))
}
export default clone
