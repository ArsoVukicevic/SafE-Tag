const imgPath = (imgName) => {
  const host = window.location.hostname
  const port = window.location.port
  const protocol = window.location.protocol

  return `${protocol}//${host}:${port}/images/${imgName}`
}

export default imgPath
