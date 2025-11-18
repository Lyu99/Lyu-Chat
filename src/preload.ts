// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from "electron";
import { CreateChatProps, OnUpdateCallBack, AppConfigProps } from "./types";
import { webUtils } from 'electron';

contextBridge.exposeInMainWorld("electronAPI", {
    startChat: (data: CreateChatProps) => ipcRenderer.send("start-chat", data),
    onUpdateMessage: (callback: OnUpdateCallBack) => ipcRenderer.on("update-message", (event, data) => callback(data)),
    getFilePath: (file: File) => webUtils.getPathForFile(file),
    copyImageToUserDir: (sourcePath: string) => ipcRenderer.invoke("copy-image-to-user-dir", sourcePath),
    // 配置相关 API
    configGet: () => ipcRenderer.invoke("config:get"),
    configSave: (config: AppConfigProps) => ipcRenderer.invoke("config:save", config),
    configUpdate: (partialConfig: Partial<AppConfigProps>) => ipcRenderer.invoke("config:update", partialConfig),
    // 右键菜单相关 API
    showContextMenu: (conversationId: number) => ipcRenderer.invoke("show-context-menu", conversationId),
    onContextMenuCommand: (callback: (data: { command: string, conversationId: number }) => void) => {
        ipcRenderer.on("context-menu-command", (event, data) => callback(data));
    },
})
