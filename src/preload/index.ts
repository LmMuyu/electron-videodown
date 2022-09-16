import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import path from "path";
import { loadDefaultOptions } from "./default.config";

const api = {
  ipcRenderer: electronAPI.ipcRenderer,
};

const defaultVideoStorePath = path.join(process.cwd(), "/test/video");

async function asyncExposeInMainWorldOrExposeWindow(
  exposePos: Electron.ContextBridge | (Window & typeof globalThis)
) {
  const defaultJson = await loadDefaultOptions();

  if (exposePos instanceof Window) {
    //@ts-ignore
    window.defaultJson = defaultJson;
  } else {
    contextBridge.exposeInMainWorld("defaultJson", defaultJson);
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("defaultVideoStorePath", defaultVideoStorePath);
    asyncExposeInMainWorldOrExposeWindow(contextBridge);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  window.defaultVideoStorePath = defaultVideoStorePath;
  asyncExposeInMainWorldOrExposeWindow(window);
}
