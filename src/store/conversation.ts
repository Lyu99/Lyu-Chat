import {defineStore} from "pinia";
import { ConversationProps } from "../types";
import { db } from "../db";

interface ConversationStore {
    items: ConversationProps[],
    selectId: number,
}

export const useConversationStore = defineStore("conversation", {
    state: (): ConversationStore => {
        return {
            items: [],
            selectId: -1,
        }
    },
    actions: {
        async fetchConversations() {
            this.items = await db.conversations.toArray();
        },
        async createConversation(createData: Omit<ConversationProps, "id">) {
            const cId = await db.conversations.add(createData);
            this.items.push({
                id: cId,
                ...createData
            })
            return cId;
        },
        async deleteConversation(conversationId: number) {
            // 从数据库中删除对话
            await db.conversations.delete(conversationId);
            // 从 store 中删除对话
            const index = this.items.findIndex(item => item.id === conversationId);
            if (index !== -1) {
                this.items.splice(index, 1);
            }
            // 如果删除的是当前选中的对话，重置选中状态
            if (this.selectId === conversationId) {
                this.selectId = -1;
            }
        }
    },
    getters: {
        getConversationId: (state) => (id: number) => {
            return state.items.find(item => item.id === id);
        },
    }
})
