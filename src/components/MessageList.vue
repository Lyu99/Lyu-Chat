<template>
  <div class="message-list" ref="_ref">
    <div v-for="item of messageList" :key="item.id" class="mb-2">
      <div class="flex" :class="{'justify-end': item.type === 'question' }">
        <div>
          <div class="text-sm text-gray-500" :class="{'text-right': item.type === 'question' }">
            {{ dayjs(item.updatedAt).format("YYYY-MM-DD") }}
          </div>
          <div v-if="item.type === 'question'" class="bg-green-700 text-white p-2 rounded">
            <img v-if="item.imagePath" :src="`safe-file://${item.imagePath}`" alt="message" class="w-24 h-24 object-cover rounded block">
            {{ item.content }}
          </div>
          <div v-else class="bg-gray-300 text-gray-700 p-2 rounded">
            <template v-if="item.status === 'loading'">
              <Icon icon="eos-icons:three-dots-loading"></Icon>
            </template>
            <div v-else class="prose prose-headings:my-2 prose-pre:p-0">
              <VueMarkdown :source="item.content" :plugins="plugins" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { MessageProps } from "../types";
import { Icon } from "@iconify/vue";
import dayjs from "dayjs";
import VueMarkdown from "vue-markdown-render";
import markDownItHighLightJs from "markdown-it-highlightjs"

const _ref = ref<HTMLDivElement>()
defineProps<{
  messageList: MessageProps[]
}>()

defineExpose({
  ref: _ref
})

const plugins = [markDownItHighLightJs]
</script>

