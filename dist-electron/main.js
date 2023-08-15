"use strict";
const electron = require("electron");
const path = require("path");
const createWindow = () => {
  const win = new electron.BrowserWindow({
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
      preload: path.resolve(__dirname, "preload.js"),
      nodeIntegration: true,
      sandbox: false
    }
  });
  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
  win.webContents.openDevTools();
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile("dist/index.html");
  }
};
electron.ipcMain.handle("dark-mode:toggle", () => {
  if (electron.nativeTheme.shouldUseDarkColors) {
    electron.nativeTheme.themeSource = "light";
  } else {
    electron.nativeTheme.themeSource = "dark";
  }
  return electron.nativeTheme.shouldUseDarkColors;
});
electron.ipcMain.handle("dark-mode:system", () => {
  electron.nativeTheme.themeSource = "system";
});
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    electron.app.quit();
});
