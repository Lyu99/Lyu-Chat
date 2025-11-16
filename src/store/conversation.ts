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
        }
    },
    getters: {
        getConversationId: (state) => (id: number) => {
            return state.items.find(item => item.id === id);
        },

    }
})
