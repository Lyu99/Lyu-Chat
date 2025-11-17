<template>
  <div class="w-full relative">
    <div v-if="imagePreview"  class="mb-2 relative flex items-center">
      <img :src="imagePreview" alt="Preview" class="h-24 w-24 object-cover rounded">
    </div>
    <div class="flex items-center">
      <input type="file" accept="image/*" ref="fileInput" class="absolute left-2 hidden" @change="handleImageUpload" >
      <Icon
          class="absolute left-2"
          icon="radix-icons:image"
          width="24"
          height="24"
          :class="[
          'mr-2',
          disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer hover:text-gray-600'
        ]"
          @click="handleIconClick"
      />
      <input class="h-[40px] w-[100%] pl-8 pr-28 box-border items-center justify-center border-2 data-[placeholder-text]:white rounded"
             type="text"
             v-model="sendValue"
             :disabled="disabled"
      >
      <Button class="absolute right-2" icon-name="radix-icons:paper-plane" @click="handleSend" :disabled="disabled">发送</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Button from "../components/Button.vue";
import { Icon } from '@iconify/vue'

const fileInput = ref<HTMLInputElement | null>(null);
const sendValue = defineModel<string>();
const imagePreview = ref();

const emit = defineEmits<{
  onSend: [question: string, imagePath?: string]
}>()
const props = defineProps<{
  disabled?: boolean
}>();

const handleIconClick = () => {
  if(!props.disabled) {
    fileInput.value?.click();
  }
}
let selectedImage: File | null = null
const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if(target.files && target.files.length > 0) {
    selectedImage = target.files[0];
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(selectedImage)
  }
}
const handleSend = () => {
  if(sendValue.value) {
    if(selectedImage) {
      const path = window.electronAPI.getFilePath(selectedImage);
      emit("onSend", sendValue.value, path);
      selectedImage = null;
      imagePreview.value = "";
    } else {
      emit("onSend", sendValue.value)
    }
  }
}
</script>
<style scoped>

</style>
