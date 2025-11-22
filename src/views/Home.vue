<template>
  <div class="h-full flex flex-col max-w-3xl mx-auto px-6 relative">
    <!-- Main content area centered -->
    <div class="flex-1 flex flex-col justify-center items-center gap-8 -mt-20">
      
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">LyuChat</h1>
        <p class="text-gray-500">Select a model and start chatting</p>
      </div>

      <div class="w-full max-w-md">
        <ProviderSelect :items="providers" v-model="selectProvider"></ProviderSelect>
      </div>
    </div>

    <!-- Input area fixed at bottom or just below -->
    <div class="pb-12 w-full">
       <SendMessage 
        v-model="inMessageText" 
        @on-send="creatConversation" 
        :disabled="selectProvider === ''"
        placeholder="Type a message to start..."
      ></SendMessage>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import ProviderSelect from "../components/ProviderSelect.vue";
import SendMessage from "../components/SendMessage.vue";
import { db } from "../db";
import { useRouter } from "vue-router";
import { useConversationStore } from "../store/conversation";
import { useProviderStore } from "../store/provider";

const inMessageText = ref("");
const selectProvider = ref("");
const router = useRouter();
const conversationStore = useConversationStore();
const providerStore = useProviderStore();

const providers = computed(() => providerStore.items);
const modelInfo = computed(() => {
  const [providerId, selectedModel] = selectProvider.value.split("/");
  return {
    providerId: parseInt(providerId),
    selectedModel
  }
})
const creatConversation = async (value: string, imagesPath?: string) => {
  const { providerId, selectedModel } = modelInfo.value;
  const currentDate = new Date().toISOString();
  let copyImagePath: string | undefined;
  if(imagesPath) {
    copyImagePath = await window.electronAPI.copyImageToUserDir(imagesPath);
  }
  const conversationId = await conversationStore.createConversation({
    title: value,
    providerId,
    selectedModel,
    createdAt: currentDate,
    updatedAt: currentDate
  })
  const newMessageId = await db.messages.add({
    conversationId,
    type: "question",
    content: value,
    createdAt: currentDate,
    updatedAt: currentDate,
    ...(copyImagePath && { imagePath: copyImagePath })
  })
  await router.push(`/conversation/${conversationId}?init=${newMessageId}`)
}
</script>
<style scoped>

</style>
