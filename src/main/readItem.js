import { BrowserWindow } from 'electron'

let offscreenWindow

export const readItem = (obj, callback) => {
  // Check if the URL already exists in the items array
  const urlExists = obj.items.some((item) => item.url === obj.url)

  if (urlExists) {
    // Execute callback with error message
    callback({ id: null, title: null, ss: null, url: obj.url, err: 'URL already exists' })
    return // Exit function early
  }
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  offscreenWindow.loadURL(obj.url)

  offscreenWindow.webContents.on('did-finish-load', () => {
    const id = Date.now().toString()
    const title = offscreenWindow.getTitle().slice(0, 65)
    if (title !== 'Readit') {
      offscreenWindow.webContents
        .capturePage()
        .then((image) => {
          const ss = image.toDataURL()
          // execute callback
          callback({ id, title, ss, url: obj.url, err: null })
        })
        .catch((err) => {
          console.log(err)
          callback({ id, title, ss: null, url: obj.url, err: err.message })
        })
        .finally(() => {
          // clean up
          offscreenWindow.close()
          offscreenWindow = null
        })
    } else {
      // execute failed callback
      callback({
        id,
        title,
        ss: null,
        url: obj.url,
        err: 'URL does not exist. Please use a real website url'
      })
    }
  })
}
