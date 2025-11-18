export interface ConversationProps {
    id: number;
    title: string;
    selectedModel: string;
    createdAt: string;
    updatedAt: string;
    providerId: number;
}
export interface ProviderProps {
    id: number;
    name: string;
    title?: string;
    desc?: string;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    models: string[];
}
export type MessageStatus = 'loading' | 'streaming' | 'finished';
export interface MessageProps {
    id: number;
    conversationId: number;
    type: 'question' | 'answer';
    content: string;
    createdAt: string;
    updatedAt: string;
    status?: MessageStatus;
    imagePath?: string;
}
export interface CreateChatProps {
    messages: {
        role: string,
        content: string,
        imagePath?: string;
    }[];
    providerName: string;
    selectedModel: string;
    messageId: number;
}
export interface UpdateStreamProps {
    messageId: number;
    data: {
        is_end: string;
        result: string;
    }
}

export type OnUpdateCallBack = (data: UpdateStreamProps) => void;
export interface MessageListRefProps {
    ref: HTMLDivElement
}

// 配置相关类型
export interface AppConfigProps {
    language: 'zh-CN' | 'en-US';
    fontSize: number; // 字体大小，单位 px，范围 12-24
}