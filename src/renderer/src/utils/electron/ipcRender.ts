export function ipcRender() {
  return window.electron.ipcRenderer || (window.api as any).ipcRenderer;
}
