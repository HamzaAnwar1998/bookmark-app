import { BrowserWindow } from 'electron'

let offscreenWindow

export const readItem = (url, callback) => {
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  offscreenWindow.loadURL(url)

  offscreenWindow.webContents.on('did-finish-load', () => {
    const id = Date.now().toString()
    const title = offscreenWindow.getTitle().slice(0, 65)
    offscreenWindow.webContents
      .capturePage()
      .then((image) => {
        const ss = image.toDataURL()
        // execute callback
        callback({ id, title, ss, url, err: null })
      })
      .catch((err) => {
        callback({ id, title, ss: null, url, err: err.message })
      })
      .finally(() => {
        // clean up
        offscreenWindow.close()
        offscreenWindow = null
      })
  })
}
