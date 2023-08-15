// preload.js
// 运行在渲染器的环境中，但能访问 NodeJS 中的 API

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
import { contextBridge, ipcRenderer } from 'electron'
import ffi from 'ffi-napi'
import path from 'path'

const filePath = path.join('../rescources/AddDll(64).dll')
const libm = ffi.Library(filePath, {
  AddInt: ['int', ['int', 'int']],
})

console.log(libm.AddInt(5, 5))

// 切换主题
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'), // dark-mode作为前缀：仅用作命名空间，提高代码可读性
  system: () => ipcRenderer.invoke('dark-mode:system'),
})
