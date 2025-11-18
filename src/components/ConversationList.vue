<template>
  <div class="conversation-list">
    <div
        class="item border-gray-300 border-t cursor-pointer p-2"
        v-for="item of items"
        :key="item.id"
        @click="gotoConversation(item)"
        @contextmenu.prevent="showContextMenu(item)"
        :class="{
          'bg-gray-400 hover:bg-gray-400': conversationStore.selectId === item.id,
          'bg-white hover:bg-gray-200': conversationStore.selectId !== item.id
        }"
    >
      <div class="flex justify-between items-center text-sm leading-5 text-gray-500">
        <span>{{ item.selectedModel }}</span>
        <span>{{ dayjs(item.updatedAt).format("YYYY-MM-DD") }}</span>
      </div>
      <h2 class="font-semibold leading-6 text-gray-900 truncate">
        {{ item.title }}
      </h2>
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
