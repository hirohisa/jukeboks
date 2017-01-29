var MEDIA = {
  UNKNOWN : 0,
  IMAGE: 1,
  VIDEO: 2
}

function ext(filePath) {
  if (!filePath) return MEDIA.UNKNOWN

  const path = require('path')
  switch (path.extname(filePath)) {
    case ".jpg":
    case ".jpeg":
    case ".gif":
    case ".png":
    return MEDIA.IMAGE
    break
    case ".mp3":
    case ".mp4":
    return MEDIA.VIDEO
    break
    default:
    break
  }
  return MEDIA.UNKNOWN
}

function createImage(src) {
  var img = document.createElement("img")
  img.src = src
  return img
}

function createVideo(src) {
  var video = document.createElement("video")
  video.src = src
  video.autoplay = true
  return video
}

function clearContents() {
  while (mainContent.firstChild) {
      mainContent.removeChild(mainContent.firstChild)
  }
}

const mainContent = document.getElementById('main-content')

class MediaLoader {

  constructor(transport) {
    this.transport = transport
  }

  clearContent() {
    clearContents()
  }

  preRender(filePath) {
    var src = "file://" + filePath
    var f = {}
    f[MEDIA.IMAGE] = function() {
      var hit
      for (var i in mainContent.childNodes) {
        var node = mainContent.childNodes[i]
        if (!node.nodeName) continue
        if (node.nodeName.toLowerCase() != "img") continue

        if (src == node.src) {
          hit = node
          break
        }
      }

      if (!hit) {
        var element = createImage(src)
        element.className = "hidden"
        mainContent.appendChild(element)
      }
    }
    f[MEDIA.VIDEO] = function() {}
    f[MEDIA.UNKNOWN] = function() {}

    f[ext(filePath)]()
  }

  render(filePath) {
    var self = this
    var src = "file://" + filePath
    var f = {}
    f[MEDIA.IMAGE] = function() {
      var hit
      for (var i in mainContent.childNodes) {
        var node = mainContent.childNodes[i]
        if (!node.nodeName) continue
        if (node.nodeName.toLowerCase() != "img") continue

        if (src == node.src) {
          hit = node
          node.className = "visible"
        } else {
          node.className = "hidden"
        }
      }

      if (!hit) {
        var element = createImage(src)
        element.className = "visible"
        mainContent.appendChild(element)
      }
    }
    f[MEDIA.VIDEO] = function() {
      clearContents()
      var element = createVideo(src)
      element.addEventListener("ended", function() {
        self.transport.on({type: 'endVideo'})
      }, true)

      mainContent.appendChild(element)
    }
    f[MEDIA.UNKNOWN] = function() {}

    f[ext(filePath)]()
  }
}

module.exports = MediaLoader