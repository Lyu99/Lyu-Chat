// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from "electron";
import { CreateChatProps, OnUpdateCallBack } from "./types";

contextBridge.exposeInMainWorld("electronAPI", {
    startChat: (data: CreateChatProps) => ipcRenderer.send("start-chat", data),
    onUpdateMessage: (callback: OnUpdateCallBack) => ipcRenderer.on("update-message", (event, data) => callback(data))
})
