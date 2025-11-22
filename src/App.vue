<template>
  <div class="flex h-screen w-full bg-white">
    <!-- Sidebar -->
    <div class="flex flex-col w-[280px] bg-gray-50 border-r border-gray-200 h-full">
      <!-- Conversation List -->
      <div class="flex-1 overflow-y-auto scrollbar-hide">
        <ConversationList :items="conversations" />
      </div>
      
      <!-- Bottom Actions -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="grid grid-cols-2 gap-3">
          <RouterLink to="/" class="w-full">
            <Button icon-name="radix-icons:chat-bubble" class="w-full justify-center" size="small">
              {{  t('common.newChat')  }}
            </Button>
          </RouterLink>
          <RouterLink to="/setting" class="w-full">
            <Button icon-name="radix-icons:gear" plain class="w-full justify-center" size="small">
              {{  t('common.setting')  }}
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 h-full relative flex flex-col bg-white">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import ConversationList from "./components/ConversationList.vue";
import Button from "./components/Button.vue";
import { initProviders } from "./db";
import { useConversationStore } from "./store/conversation";
import { useProviderStore } from "./store/provider";
import { useI18n } from 'vue-i18n';
const conversationStore = useConversationStore();
const providerStore = useProviderStore();
const conversations = computed(() => conversationStore.items);
const { t } = useI18n();
onMounted(async () => {
  await initProviders();
  await providerStore.fetchProviders();
  await conversationStore.fetchConversations();
})
</script>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
