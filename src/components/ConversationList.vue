<template>
  <div class="conversation-list px-2 py-2 space-y-1">
    <div
        class="item group relative flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors duration-200"
        v-for="item of items"
        :key="item.id"
        @click="gotoConversation(item)"
        @contextmenu.prevent="showContextMenu(item)"
        :class="{
          'bg-primary-50 text-primary-900': conversationStore.selectId === item.id,
          'text-gray-700 hover:bg-gray-100': conversationStore.selectId !== item.id
        }"
    >
      <div class="flex justify-between items-center">
        <h2 class="font-medium text-sm truncate flex-1 mr-2" :class="conversationStore.selectId === item.id ? 'text-primary-900' : 'text-gray-900'">
          {{ item.title || 'New Chat' }}
        </h2>
        <span class="text-[10px] opacity-60" :class="conversationStore.selectId === item.id ? 'text-primary-700' : 'text-gray-500'">
            {{ dayjs(item.updatedAt).format("MM-DD") }}
        </span>
      </div>
      <div class="flex justify-between items-center text-xs">
        <span class="px-1.5 py-0.5 rounded text-[10px] border" 
              :class="conversationStore.selectId === item.id 
                ? 'bg-white/50 border-primary-200 text-primary-700' 
                : 'bg-gray-50 border-gray-200 text-gray-500 group-hover:border-gray-300'">
          {{ item.selectedModel }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ConversationProps } from '../types';
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useConversationStore } from "../store/conversation";
import { useMessageStore } from "../store/message";
import { onMounted } from "vue";

defineProps<{ items: ConversationProps[] }>()

const router = useRouter();
const conversationStore = useConversationStore();
const messageStore = useMessageStore();

const gotoConversation = (item: ConversationProps) => {
  router.push({
    path: `/conversation/${item.id}`,
  })
  conversationStore.selectId = item.id;
}

// 显示 Electron 原生右键菜单
const showContextMenu = (item: ConversationProps) => {
  window.electronAPI.showContextMenu(item.id);
}

// 删除对话
const handleDeleteConversation = async (conversationId: number) => {
  try {
    // 先删除该对话的所有消息
    await messageStore.deleteMessagesByConversation(conversationId);
    
    // 再删除对话
    await conversationStore.deleteConversation(conversationId);
    
    // 如果删除的是当前正在查看的对话，跳转到首页
    if (conversationStore.selectId === -1) {
      router.push('/');
    }
    
    console.log('删除对话成功，ID:', conversationId);
  } catch (error) {
    console.error('删除对话失败:', error);
  }
}

// 监听菜单命令
onMounted(() => {
  window.electronAPI.onContextMenuCommand((data: { command: string, conversationId: number }) => {
    if (data.command === 'delete') {
      handleDeleteConversation(data.conversationId);
    }
  });
});
</script>
<style scoped>
</style>
