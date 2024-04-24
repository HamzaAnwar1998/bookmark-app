import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import iconPng from '../../resources/icon.png?asset'
import iconIco from '../../resources/icon.ico?asset'
import iconIcns from '../../resources/icon.icns?asset'
import windowStateKeeper from 'electron-window-state'
import { readItem } from './readItem'
import appMenu from './menu'
import { checkAndApplyUpdates } from './updater'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// ipc messaging
// new item
ipcMain.on('new-item', (e, args) => {
  readItem(args, (data) => {
    e.sender.send('new-item-success', data)
  })
})

// create window function
function createWindow() {
  // default window state
  const mainWindowState = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 300,
    show: false,
    autoHideMenuBar: false,
    // ...(process.platform === 'linux' ? { icon: iconPng } : { icon: iconIco }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // set icon browser window
  if (process.platform === 'darwin') {
    mainWindow.setIcon(iconIcns)
  } else if (process.platform === 'win32') {
    mainWindow.setIcon(iconIco)
  } else {
    mainWindow.setIcon(iconPng)
  }

  // set dock icon on
  if (process.platform === 'darwin') {
    app.dock.setIcon(iconIcns)
  }

  // set menu
  appMenu(mainWindow.webContents)

  // use main window state
  mainWindowState.manage(mainWindow)

  // window is ready to be shown
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // open a new window with external url
  mainWindow.webContents.setWindowOpenHandler(() => {
    return {
      action: 'allow'
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // check and apply updates after 1.5 seconds
  setTimeout(() => {
    checkAndApplyUpdates()
  }, 1500)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // call create window function
  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
