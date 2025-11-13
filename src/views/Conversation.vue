<template>
<div class="w-[80%] mx-auto h-[85%] overflow-y-auto pt-2">
  <MessageList :messageList="filterMessageList" />
</div>
<div class="w-[80%] mx-auto h-[15%] flex items-center">
  <SendMessage />
</div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from 'vue-router';
import MessageList from "../components/MessageList.vue";
import SendMessage from "../components/SendMessage.vue";
import { message } from "../testData";
import { MessageProps } from "../types";

const route = useRoute();
let currentConversationId = parseInt(route.params.id as string);
let filterMessageList = ref<MessageProps[]>([]);
filterMessageList.value = message.filter(item => item.conversationId === currentConversationId);
watch(() => route.params.id, (newId: string) => {
  currentConversationId = parseInt(newId);
  filterMessageList.value = message.filter(item => item.conversationId === currentConversationId);
})
</script>
