<template>
  <div class="flex items-center justify-between h-screen">
    <div class="w-[300px] bg-gray-200 h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="items" />
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2">
        <button>
          <Icon icon="radix-icons:chat-bubble" />
          新建聊天
        </button>
        <button>
          <Icon icon="radix-icons:gear" />
          应用配置
        </button>
      </div>
    </div>
    <div class="h-full flex-1 flex items-center">
      <div class="w-[80%] h-full mx-auto">
        <div class="h-[85%] flex items-center">
          <ProviderSelect :items="providers" v-model="selectModel"></ProviderSelect>
        </div>
        <div class="h-[15%] flex items-center">
          message....
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import ConversationList from "./components/ConversationList.vue";
import { ConversationProps, ProviderProps } from "./types";
import ProviderSelect from "./components/ProviderSelect.vue";
const selectModel = ref("");
const items: ConversationProps[] = [
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
    title: "什么是光合作用1",
    selectedModel: "GPT3.5",
    createdAt: "2025-08-08",
    updatedAt: "2025-08-08",
    providerId: 1,
  },
  {
    id: 3,
    title: "什么是光合作用1",
    selectedModel: "GPT3.5",
    createdAt: "2025-08-08",
    updatedAt: "2025-08-08",
    providerId: 1,
  }
]
const providers: ProviderProps[] = [
  {
    id: 1,
    name: "通一千问",
    desc: "通一千问",
    models: ['qwen-turbo', 'qwen-turbo', 'qwen-turbo'],
    avatar: "1",
    createdAt: "2020-09-09",
    updatedAt: "2020-09-09"
  },
  {
    id: 2,
    name: "通一千问",
    desc: "通一千问",
    models: ['qwen-turbo', 'qwen-turbo', 'qwen-turbo'],
    avatar: "1",
    createdAt: "2020-09-09",
    updatedAt: "2020-09-09"
  }
]
</script>
<style scoped>

</style>
