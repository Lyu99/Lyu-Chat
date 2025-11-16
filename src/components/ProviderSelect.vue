<template>
<div class="provider-select w-full">
  <SelectRoot v-model="currentModel">
    <SelectTrigger class="inline-flex min-w-[160px] w-full items-center
    justify-between rounded px-[15px] text-[13px] leading-none
    h-[35px] gap-[5px] bg-white text-grass11 shadow-[0_2px_10px]
     shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px]
     focus:shadow-black data-[placeholder]:text-gray-300 outline-none"
    >
      <SelectValue placeholder="select a model..."></SelectValue>
      <Icon icon="radix-icons:chevron-down" class="h-3.5 w-3.5"/>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent class="min-w-[160px] bg-white rounded
      shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]
      will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade
      data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade
      data-[side=left]:animate-slideRightAndFade z-[100]"
      >
        <SelectViewport class="p-[5px]">
          <div v-for="item of items" :key="item.id">
            <SelectLabel class="flex items-center px-[25px] text-xs leading-[25px] text-mauve11">
              <img :src="item.avatar" alt="" class="w-[20px] h-[20px] mr-2 rounded" >
              {{ item.name }}
            </SelectLabel>
            <SelectGroup>
              <SelectItem v-for="(model, index) of item.models" :key="index" :value="`${item.id}/${model}`"
                          class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px]
                          pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8
                          data-[disabled]:pointer-events-none data-[highlighted]:outline-none
                          data-[highlighted]:bg-green-600 data-[highlighted]:text-white
                          data-[highlighted]:bg-green9 data-[highlighted]:text-green1 cursor-pointer"
              >
                <SelectItemIndicator>
                  <Icon icon="radix-icons:check" />
                </SelectItemIndicator>
                <SelectItemText>{{ model }}</SelectItemText>
              </SelectItem>
            </SelectGroup>
            <SelectSeparator class="h-[1px] bg-gray-300 my-2" />
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
  SelectScrollDownButton,
  SelectScrollUpButton,
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

</style>
