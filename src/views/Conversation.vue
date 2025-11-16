<template>
<div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between" v-if="conversation">
  <h3 class="font-semibold  text-gray-900">{{ conversation.title }}</h3>
  <span class="text-sm text-gray-500">{{ dayjs(conversation.updatedAt).format("YYYY-MM-DD") }}</span>
</div>
<div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2">
  <MessageList :messageList="messageList" />
</div>
<div class="w-[80%] mx-auto h-[15%] flex items-center">
  <SendMessage @on-send="sendMessage" v-model="sendValue" :disabled="messageStore.getIsDisabled" />
</div>
</template>
<script setup lang="ts">
import {ref, onMounted, watch, computed} from "vue";
import { useRoute } from 'vue-router';
import MessageList from "../components/MessageList.vue";
import SendMessage from "../components/SendMessage.vue";
import { MessageProps } from "../types";
import { db } from "../db";
import dayjs from "dayjs";
import { useConversationStore } from "../store/conversation";
import { useMessageStore } from "../store/message";

const route = useRoute();
let currentConversationId = ref(parseInt(route.params.id as string));
const initMessageId = parseInt(route.query.init as string);
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const conversation = computed(() => conversationStore.getConversationId(currentConversationId.value))
const messageList = computed(() => messageStore.items);
const sendValue = ref("");
const sendMessageArr = computed(() => messageList.value.filter(i => i.status !== "loading").map((i) => {
  return {
    role: i.type === "question" ? "user" : "assistant",
    content: i.content
  }
}))

const sendMessage = async (question: string) => {
  if(question) {
    const date = new Date().toISOString();
    await messageStore.createMessage({
      content: question,
      conversationId: currentConversationId.value,
      updatedAt: date,
      createdAt: date,
      type: "question"
    })
    await createInitMessage();
    sendValue.value = "";
  }
}

const createInitMessage = async () => {
  const createData: Omit<MessageProps, "id"> = {
    conversationId: currentConversationId.value,
    type: "answer",
    content: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "loading"
  }
  const messageId = await messageStore.createMessage(createData);
  if(conversation.value) {
    const provider = await db.providers.where({ id: conversation.value.providerId }).first();
    if(provider) {
      window.electronAPI.startChat({
        messages: sendMessageArr.value,
        providerName: provider.name,
        messageId: messageId,
        selectedModel: conversation.value.selectedModel
      })
    }
  }
}

watch(() => route.params.id,  async (newVal: string) => {
  currentConversationId.value = parseInt(newVal);
  await messageStore.fetchMessageByConversation(currentConversationId.value);
})

onMounted(async () => {
  await messageStore.fetchMessageByConversation(currentConversationId.value);
  if(initMessageId) {
    await createInitMessage();
  }
  window.electronAPI.onUpdateMessage(async (stream) => {
    await messageStore.updateMessage(stream);
  })
})
</script>
