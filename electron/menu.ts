import { BrowserWindow, Menu } from 'electron'

export const createMenu = (win: BrowserWindow) => {
  const menu = Menu.buildFromTemplate([
    {
      label: '菜单',
      submenu: [
        {
          label: 'electron',
          click: () => {
            console.log('点击')
            win.webContents.send('electron', process.versions.electron)
          },
        },
        {
          label: 'chrome',
          click: () => win.webContents.send('chrome', process.versions.chrome),
        },
      ],
    },
    {
      label: '调试',
      role: 'toggleDevTools',
    },
  ])

  Menu.setApplicationMenu(menu)
  // return menu
}
