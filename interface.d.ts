import { CreateChatProps, OnUpdateCallBack } from "./src/types";

export interface IElectronAPI {
    startChat: (data: CreateChatProps) => void;
    onUpdateMessage: (callback: OnUpdateCallBack) => any;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
