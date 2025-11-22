<template>
<div class="provider-select w-full relative">
  <SelectRoot v-model="currentModel">
    <SelectTrigger class="inline-flex w-full items-center justify-between rounded-xl px-4
    h-[52px] bg-white border border-gray-200 text-gray-900 text-sm
    hover:border-primary-300 hover:bg-gray-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
    transition-all duration-200 outline-none shadow-sm"
    >
      <SelectValue placeholder="Select a model to chat with..." class="text-gray-500" />
      <Icon icon="radix-icons:chevron-down" class="h-4 w-4 text-gray-400 transition-transform duration-200 ease-in-out" />
    </SelectTrigger>
    
    <SelectPortal>
      <SelectContent class="min-w-[320px] bg-white rounded-xl
      shadow-xl border border-gray-100 overflow-hidden
      will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade
      data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade
      data-[side=left]:animate-slideRightAndFade z-[100] py-1"
      :side-offset="5"
      >
        <SelectViewport class="p-1 max-h-[300px]">
          <div v-for="item of items" :key="item.id" class="mb-1 last:mb-0">
            <SelectLabel class="flex items-center px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50/50 mx-1 rounded">
              <img :src="item.avatar" alt="" class="w-4 h-4 mr-2 rounded-sm opacity-80" >
              {{ item.name }}
            </SelectLabel>
            <SelectGroup class="p-1">
              <SelectItem v-for="(model, index) of item.models" :key="index" :value="`${item.id}/${model}`"
                          class="relative flex items-center h-[36px] px-8 text-sm leading-none text-gray-700 
                          rounded-md select-none outline-none cursor-pointer
                          data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none
                          data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700"
              >
                <SelectItemIndicator class="absolute left-2 inline-flex items-center justify-center text-primary-600">
                  <Icon icon="radix-icons:check" class="w-4 h-4" />
                </SelectItemIndicator>
                <SelectItemText>{{ model }}</SelectItemText>
              </SelectItem>
            </SelectGroup>
            <SelectSeparator class="h-[1px] bg-gray-100 mx-2 my-1" />
          </div>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</div>
</template>
<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue'
import { ProviderProps } from "../types";
import { Icon } from "@iconify/vue";
defineProps<{ items: ProviderProps[] }>()
const currentModel = defineModel<string>()
</script>
<style scoped>
/* Add animations for Radix UI */
@keyframes slideUpAndFade {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideRightAndFade {
  from { opacity: 0; transform: translateX(-2px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideDownAndFade {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideLeftAndFade {
  from { opacity: 0; transform: translateX(2px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
