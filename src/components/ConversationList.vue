<template>
  <div class="conversation-list">
    <div
        class="item border-gray-300 border-t cursor-pointer p-2"
        v-for="item of items"
        :key="item.id"
        @click="gotoConversation(item)"
        :class="{
          'bg-gray-400 hover:bg-gray-400': store.selectId === item.id,
          'bg-white hover:bg-gray-200': store.selectId !== item.id
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

defineProps<{ items: ConversationProps[] }>()

const router = useRouter();
const store = useConversationStore();

const gotoConversation = (item: ConversationProps) => {
  router.push({
    path: `/conversation/${item.id}`,
  })
  store.selectId = item.id;
}
</script>
<style lang="ts" scoped>

</style>
