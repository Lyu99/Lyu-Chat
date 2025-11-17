import { CreateChatProps, OnUpdateCallBack } from "./src/types";

export interface IElectronAPI {
    startChat: (data: CreateChatProps) => void;
    onUpdateMessage: (callback: OnUpdateCallBack) => any;
    getFilePath: (file: File) => string;
    copyImageToUserDir: (sourcePath: string) => Promise<string>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
