<template>
<div class="h-16 min-h-[64px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-6 justify-between sticky top-0 z-10" v-if="conversation">
  <div class="flex items-center gap-3 overflow-hidden">
    <div class="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
      <Icon icon="radix-icons:chat-bubble" class="w-4 h-4" />
    </div>
    <div class="flex flex-col">
      <h3 class="font-semibold text-gray-900 truncate leading-tight text-sm">{{ conversation.title }}</h3>
      <span class="text-xs text-gray-500 flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        {{ conversation.selectedModel }}
      </span>
    </div>
  </div>
  <div class="text-xs text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
    {{ dayjs(conversation.updatedAt).format("MMM D, YYYY") }}
  </div>
</div>
<div class="flex-1 w-full overflow-y-auto">
  <div class="max-w-3xl mx-auto h-full px-4">
    <MessageList :messageList="messageList" ref="messageListRef" />
  </div>
</div>
<div class="w-full bg-white pb-6 pt-2">
  <div class="max-w-3xl mx-auto px-4">
    <SendMessage @on-send="sendMessage" v-model="sendValue" :disabled="messageStore.getIsDisabled" />
  </div>
</div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
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
