import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { dialog } from 'electron'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

autoUpdater.autoDownload = false

export const checkAndApplyUpdates = () => {
  autoUpdater.checkForUpdates()
  autoUpdater.on('update-available', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update available',
        message: 'A new update is available of Readit app. Do yu want to update now?',
        buttons: ['Update', 'No']
      })
      .then((res) => {
        if (res.response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
  })
  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update ready',
        message: 'Update has been downloaded. Do you want to quit and restart?',
        buttons: ['Quit', 'Later']
      })
      .then((res) => {
        if (res.response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
  })
}
