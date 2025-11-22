<template>
  <div class="message-list flex flex-col gap-6 py-4" ref="_ref">
    <div v-for="item of messageList" :key="item.id" class="group w-full flex" 
         :class="item.type === 'question' ? 'justify-end' : 'justify-start'">
      
      <!-- Message Container -->
      <div class="flex max-w-[85%] md:max-w-[80%] gap-3" 
           :class="item.type === 'question' ? 'flex-row-reverse' : 'flex-row'">
        
        <!-- Avatar -->
        <div class="flex-shrink-0 mt-1">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
               :class="item.type === 'question' ? 'bg-primary-100 text-primary-600' : 'bg-white border border-gray-200 text-gray-600'">
            <Icon :icon="item.type === 'question' ? 'radix-icons:person' : 'radix-icons:desktop'" class="w-4 h-4" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-1" :class="item.type === 'question' ? 'items-end' : 'items-start'">
          
          <!-- Meta (Time) -->
          <div class="text-[10px] text-gray-400 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {{ dayjs(item.updatedAt).format("HH:mm") }}
          </div>

          <!-- Bubble -->
          <div class="relative px-4 py-2.5 shadow-sm text-sm sm:text-base leading-relaxed overflow-hidden"
               :class="[
                 item.type === 'question' 
                   ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm' 
                   : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm'
               ]">
            
            <!-- Image if exists -->
            <div v-if="item.imagePath" class="mb-2 -mx-1 -mt-1">
              <img :src="`safe-file://${item.imagePath}`" alt="uploaded image" 
                   class="max-w-full max-h-[300px] object-contain rounded-lg border border-white/10 bg-black/5" />
            </div>

            <!-- Text Content -->
            <div v-if="item.type === 'question'">
              {{ item.content }}
            </div>
            
            <div v-else>
              <template v-if="item.status === 'loading'">
                <div class="flex items-center gap-1 py-1">
                  <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </template>
              <div v-else class="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-a:text-primary-600 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-100 prose-pre:text-gray-800">
                <VueMarkdown :source="item.content" :plugins="plugins" />
              </div>
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
<style>
/* Override highlight.js theme if needed or ensuring code blocks look good */
.hljs {
  background: transparent !important;
  padding: 0 !important;
}
/* Custom prose styles for tighter code blocks */
.prose pre {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
