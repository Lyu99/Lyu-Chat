import { ConversationProps, ProviderProps, MessageProps } from "./types";
export const conversationData: ConversationProps[] = [
    {
        id: 1,
        title: "什么是光合作用1",
        selectedModel: "GPT3.5",
        createdAt: "2025-08-08",
        updatedAt: "2025-08-08",
        providerId: 1,
    },
    {
        id: 2,
        title: "什么是光合作用2",
        selectedModel: "GPT3.5",
        createdAt: "2025-08-08",
        updatedAt: "2025-08-08",
        providerId: 1,
    },
    {
        id: 3,
        title: "什么是光合作用3",
        selectedModel: "GPT3.5",
        createdAt: "2025-08-08",
        updatedAt: "2025-08-08",
        providerId: 1,
    }
]
export const providers: ProviderProps[] = [
    {
        id: 1,
        name: "qianfan",
        title: "百度千帆",
        desc: "百度千帆",
        models: ['ERNIE 5.0', 'DeepSeek-V3'],
        avatar: "https://aip-static.cdn.bcebos.com/landing/product/ernie-bote321e5.png",
        createdAt: "",
        updatedAt: ""
    },
    {
        id: 2,
        name: "dashscope",
        title: "阿里灵积",
        desc: "阿里灵积",
        models: ['qwen-plus', 'qwen3-vl-plus'],
        avatar: "https://qph.cf2.poecdn.net/main-thumb-pb-4160791-200-qlqunomdvkyitpedtghnhsgjlutapgfl.jpeg",
        createdAt: "",
        updatedAt: ""
    }
]
export const message: MessageProps[] = [
    { id: 1, conversationId: 1, content: "什么是光合作用1111111111111111111111111", createdAt: "2020-02-02", updatedAt: "2020-02-02", type: "question", status: "finished" },
    { id: 2, conversationId: 1, content: "什么是光合作用2", createdAt: "2020-02-02", updatedAt: "2020-02-02", type: "answer", status: "finished" },
    { id: 3, conversationId: 1, content: "什么是光合作用3", createdAt: "2020-02-02", updatedAt: "2020-02-02", type: "question", status: "finished" },
    { id: 4, conversationId: 1, content: "什么是光合作用4", createdAt: "2020-02-02", updatedAt: "2020-02-02", type: "answer", status: "loading" },
    { id: 5, conversationId: 1, content: "什么是光合作用5", createdAt: "2020-02-02", updatedAt: "2020-02-02", type: "question", status: "loading" },
    { id: 6, conversationId: 2, content: "什么是光合作用6", createdAt: "2020-02-02", updatedAt: "2020-02-02", type: "question", status: "finished" },
    { id: 7, conversationId: 3, content: "什么是光合作用7", createdAt: "2020-02-02", updatedAt: "2020-02-02", type: "question", status: "finished" },
]
