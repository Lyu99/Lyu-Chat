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
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
