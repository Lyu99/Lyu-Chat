<template>
  <div class="conversation-list">
    <div
        class="item border-gray-300 border-t cursor-pointer bg-white hover:bg-gray-200 p-2"
        v-for="item of items"
        :key="item.id"
    >
      <RouterLink :to="`/conversation/${item.id}`">
        <div class="flex justify-between items-center text-sm leading-5 text-gray-500">
          <span>{{ item.selectedModel }}</span>
          <span>{{ dayjs(item.updatedAt).format("YYYY-MM-DD") }}</span>
        </div>
        <h2 class="font-semibold leading-6 text-gray-900 truncate">
          {{ item.title }}
        </h2>
      </RouterLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ConversationProps } from '../types';
import dayjs from "dayjs";
defineProps<{ items: ConversationProps[] }>()
</script>
<style lang="ts" scoped>

</style>
