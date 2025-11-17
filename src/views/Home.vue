<template>
  <div class="w-[80%] h-full mx-auto">
    <div class="h-[85%] flex items-center">
      <ProviderSelect :items="providers" v-model="selectProvider"></ProviderSelect>
    </div>
    <div class="h-[15%] flex items-center">
      <SendMessage v-model="inMessageText" @on-send="creatConversation" :disabled="selectProvider === ''"></SendMessage>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ProviderSelect from "../components/ProviderSelect.vue";
import SendMessage from "../components/SendMessage.vue";
import { db } from "../db";
import { ProviderProps } from "../types";
import { useRouter } from "vue-router";
import { useConversationStore } from "../store/conversation";

const providers = ref<ProviderProps[]>([]);
const inMessageText = ref("");
const selectProvider = ref("");
const router = useRouter();
const conversationStore = useConversationStore();

onMounted(async () => {
   providers.value = await db.providers.toArray()
});
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
