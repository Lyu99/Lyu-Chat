import { CreateChatProps, OnUpdateCallBack, AppConfigProps } from "./src/types";

export interface IElectronAPI {
    startChat: (data: CreateChatProps) => void;
    onUpdateMessage: (callback: OnUpdateCallBack) => any;
    getFilePath: (file: File) => string;
    copyImageToUserDir: (sourcePath: string) => Promise<string>;
    // 配置相关 API
    configGet: () => Promise<AppConfigProps>;
    configSave: (config: AppConfigProps) => Promise<AppConfigProps>;
    configUpdate: (partialConfig: Partial<AppConfigProps>) => Promise<AppConfigProps>;
    // 右键菜单相关 API
    showContextMenu: (conversationId: number) => Promise<void>;
    onContextMenuCommand: (callback: (data: { command: string, conversationId: number }) => void) => void;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
