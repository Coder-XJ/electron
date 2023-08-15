export interface IVersion {
  node: string
  chrome: string
  electron: string
  version: object
  process: object
  ping: Function
  webPage: Function
  setTitle: Function
}

export interface IElectronAPI {
  setTitle: Function
  getElectronVersion: (callback?: Function) => string
  getChromeVersion: (callback?: Function) => string
  openFile: Function
  cancelBluetoothRequest: Function
  bluetoothPairingRequest: Function
  bluetoothPairingResponse: Function
}

export interface IDarkMode {
  toggle: () => Promise<boolean>
  system: () => Promise<void>
}

declare global {
  interface Window {
    versions: IVersion
    electronAPI: IElectronAPI
    darkMode: IDarkMode
  }
}
