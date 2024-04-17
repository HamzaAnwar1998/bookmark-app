import { BrowserWindow, Menu } from 'electron'

export default (appWindow) => {
  let helpWindow

  const createHelpWindow = () => {
    helpWindow = new BrowserWindow({
      maxWidth: 2000,
      maxHeight: 2000,
      width: 1200,
      height: 800,
      webPreferences: {
        contextIsolation: 1,
        nodeIntegration: 0
      }
    })

    helpWindow.loadURL('https://github.com/HamzaAnwar1998/bookmark-app')
  }
  const template = [
    {
      label: 'Items',
      submenu: [
        {
          label: 'Add New',
          click: () => {
            appWindow.send('open-modal')
          },
          accelerator: 'CmdOrCtrl+O'
        },
        {
          label: 'Open in browser',
          click: () => {
            appWindow.send('open-item-in-browser')
          },
          accelerator: 'CmdOrCtrl+Shift+F'
        },
        {
          label: 'Search Items',
          click: () => {
            appWindow.send('focus-search')
          },
          accelerator: 'CmdOrCtrl+S'
        }
      ]
    },
    {
      role: 'fileMenu'
    },
    {
      role: 'editMenu'
    },
    {
      role: 'windowMenu'
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn more',
          click: () => {
            // shell.openExternal('https://github.com/HamzaAnwar1998/bookmark-app')
            createHelpWindow()
          }
        }
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      role: 'appMenu'
    })
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
