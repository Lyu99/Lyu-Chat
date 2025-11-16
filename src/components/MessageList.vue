<template>
  <div class="message-list">
    <div v-for="item of messageList" :key="item.id" class="mb-2">
      <div class="flex" :class="{'justify-end': item.type === 'question' }">
        <div>
          <div class="text-sm text-gray-500" :class="{'text-right': item.type === 'question' }">
            {{ dayjs(item.updatedAt).format("YYYY-MM-DD") }}
          </div>
          <div v-if="item.type === 'question'" class="bg-green-700 text-white p-2 rounded">
            {{ item.content }}
          </div>
          <div v-else class="bg-gray-300 text-gray-700 p-2 rounded">
            <template v-if="item.status === 'loading'">
              <Icon icon="eos-icons:three-dots-loading"></Icon>
            </template>
            <template v-else>
              {{ item.content }}
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MessageProps } from "../types";
import { Icon } from "@iconify/vue";
import dayjs from "dayjs";
defineProps<{
  messageList: MessageProps[]
}>()
</script>

