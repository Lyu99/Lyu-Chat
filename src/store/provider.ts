import { defineStore } from "pinia";
import { ProviderProps } from "../types";
import { db } from "../db";

interface ProviderStore {
    items: ProviderProps[];
}

export const useProviderStore = defineStore("provider", {
    state: (): ProviderStore => {
        return {
            items: [],
        }
    },
    actions: {
        async fetchProviders() {
            this.items = await db.providers.toArray();
        },
    },
    getters: {
        getProviderById: (state) => (id: number) => {
            return state.items.find(item => item.id === id);
        },
    }
})

