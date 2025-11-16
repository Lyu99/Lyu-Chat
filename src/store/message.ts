import { defineStore } from "pinia";
import { MessageProps, MessageStatus, UpdateStreamProps} from "../types";
import { db } from "../db";

interface MessageStore {
    items: MessageProps[]
}

export const useMessageStore = defineStore('message', {
    state: (): MessageStore => {
        return {
            items: []
        }
    },
    actions: {
        async fetchMessageByConversation(conversationId: number) {
            this.items = await db.messages.where({ conversationId }).toArray();
        },
        async createMessage(creatData: Omit<MessageProps, "id">) {
            const messageId = await db.messages.add(creatData);
            this.items.push({ id: messageId, ...creatData })
            return messageId;
        },
        async updateMessage(streamData: UpdateStreamProps) {
            const { messageId, data } = streamData;
            const curMessage = this.items.find(i => i.id === messageId);
            if(curMessage) {
                const updateData = {
                    content: curMessage.content + data.result,
                    status: data.is_end === "stop" ? "finished" : "streaming" as MessageStatus,
                    updatedAt: new Date().toISOString(),
                }
                await db.messages.update(messageId, updateData)
                const idx = this.items.findIndex(i => i.id === messageId)
                if(idx !== -1) {
                    this.items[idx] = { ...this.items[idx], ...updateData }
                }
            }
        }
    },
    getters: {
        getLastQuestion: (state) => (conversationId: number) => {
            return state.items.findLast(i => i.conversationId === conversationId && i.type === "question");
        },
        getIsDisabled: (state) => {
            return state.items.some(i => i.status === "streaming" || i.status === "loading");
        }
    }
})
