// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入
// 主进程：可执行任意的 NodeJS 代码

// app：它着您应用程序的事件生命周期。
// BrowserWindow：它负责创建和管理应用窗口。

import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import path from 'path'

const createWindow = () => {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    // 窗口宽度
    width: 400,
    // 窗口高度
    height: 200,
    // 是否置于别的窗口之上
    alwaysOnTop: false,
    x: 1200,
    y: 0,
    // 使用预加载脚本
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
      nodeIntegration: true,
      sandbox: false,
    },
  })

  // 去除警告
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

  win.webContents.openDevTools()
  // 加载 html 文件 或者 url
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile('dist/index.html')
  }
}

// 切换主题颜色
ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }

  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
/* // 不使用原生菜单
Menu.setApplicationMenu(null) */
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 如果没有窗口打开则打开一个窗口 (macOS)
/* app.on('ready', () => {
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}) */

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
// 此方法不适用于 macOS。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
