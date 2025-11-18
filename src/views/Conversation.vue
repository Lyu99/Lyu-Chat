<template>
<div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between" v-if="conversation">
  <h3 class="font-semibold  text-gray-900">{{ conversation.title }}</h3>
  <span class="text-sm text-gray-500">{{ dayjs(conversation.updatedAt).format("YYYY-MM-DD") }}</span>
</div>
<div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2">
  <MessageList :messageList="messageList" ref="messageListRef" />
</div>
<div class="w-[80%] mx-auto h-[15%] flex items-center">
  <SendMessage @on-send="sendMessage" v-model="sendValue" :disabled="messageStore.getIsDisabled" />
</div>
</template>
<script setup lang="ts">
import {ref, onMounted, watch, computed, ComputedRef, nextTick} from "vue";
import { useRoute } from 'vue-router';
import MessageList from "../components/MessageList.vue";
import SendMessage from "../components/SendMessage.vue";
import { ConversationProps, MessageProps, MessageListRefProps } from "../types";
import { db } from "../db";
import dayjs from "dayjs";
import { useConversationStore } from "../store/conversation";
import { useMessageStore } from "../store/message";
import { useProviderStore } from "../store/provider";

const messageListRef = ref<MessageListRefProps>()
const route = useRoute();
let currentConversationId = ref(parseInt(route.params.id as string));
const initMessageId = parseInt(route.query.init as string);
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const providerStore = useProviderStore();
const conversation: ComputedRef<ConversationProps | undefined> = computed(() => conversationStore.getConversationId(currentConversationId.value));
const messageList = computed(() => messageStore.items);
const sendValue = ref("");
const sendMessageArr = computed(() => messageList.value.filter(i => i.status !== "loading").map((i) => {
  return {
    role: i.type === "question" ? "user" : "assistant",
    content: i.content,
    ...(i.imagePath && { imagePath: i.imagePath })
  }
}))

const sendMessage = async (question: string, imagesPath?: string) => {
  if(question) {
    let copyImagePath: string | undefined;
    if(imagesPath) {
      copyImagePath = await window.electronAPI.copyImageToUserDir(imagesPath);
    }
    const date = new Date().toISOString();
    await messageStore.createMessage({
      content: question,
      conversationId: currentConversationId.value,
      updatedAt: date,
      createdAt: date,
      type: "question",
      ...(imagesPath && { imagePath: copyImagePath })
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
  await viewIntoEnd();
  if(conversation.value) {
    const provider = providerStore.getProviderById(conversation.value.providerId);
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

const viewIntoEnd = async () => {
  await nextTick();
  if(messageListRef.value) {
    messageListRef.value.ref.scrollIntoView({ block: "end", behavior: "smooth" })
  }
}

watch(() => route.params.id,  async (newVal: string) => {
  currentConversationId.value = parseInt(newVal);
  await messageStore.fetchMessageByConversation(currentConversationId.value);
  await viewIntoEnd();
})

onMounted(async () => {
  await messageStore.fetchMessageByConversation(currentConversationId.value);
  await viewIntoEnd();
  if(initMessageId) {
    await createInitMessage();
  }
  window.electronAPI.onUpdateMessage(async (stream) => {
    await messageStore.updateMessage(stream);
    await viewIntoEnd();
  })
})
</script>
