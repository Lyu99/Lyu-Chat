<template>
  <div class="w-full relative group">
    <!-- Image Preview -->
    <div v-if="imagePreview" class="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 animate-fade-in">
      <div class="relative">
        <img :src="imagePreview" alt="Preview" class="h-20 w-20 object-cover rounded-md">
        <button @click="clearImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm">
          <Icon icon="radix-icons:cross-2" class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Input Container -->
    <div class="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all duration-200">
      
      <!-- Image Upload Trigger -->
      <div class="pl-3 flex items-center">
        <input type="file" accept="image/*" ref="fileInput" class="hidden" @change="handleImageUpload" >
        <button 
          class="p-2 rounded-lg transition-colors"
          :class="disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50 cursor-pointer'"
          @click="handleIconClick"
          :disabled="disabled"
        >
          <Icon icon="radix-icons:image" class="w-5 h-5" />
        </button>
      </div>

      <!-- Text Input -->
      <input 
        class="flex-1 h-[52px] px-3 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
        type="text"
        v-model="sendValue"
        :disabled="disabled"
        :placeholder="placeholder || t('common.typeMessage')"
        @keydown.enter="handleSend"
      >

      <!-- Send Button -->
      <div class="pr-2">
        <Button 
          size="small" 
          :disabled="disabled || (!sendValue && !selectedImage)" 
          @click="handleSend"
          :class="{ 'opacity-50': !sendValue && !selectedImage }"
        >
          <Icon icon="radix-icons:paper-plane" class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Button from "../components/Button.vue";
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';

const fileInput = ref<HTMLInputElement | null>(null);
const sendValue = defineModel<string>();
const imagePreview = ref();
const { t } = useI18n();

const emit = defineEmits<{
  onSend: [question: string, imagePath?: string]
}>()
const props = defineProps<{
  disabled?: boolean;
  placeholder?: string;
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

const clearImage = () => {
  selectedImage = null;
  imagePreview.value = "";
  if (fileInput.value) fileInput.value.value = '';
}

const handleSend = () => {
  if(props.disabled) return;
  
  if(sendValue.value || selectedImage) {
    if(selectedImage) {
      const path = window.electronAPI.getFilePath(selectedImage);
      emit("onSend", sendValue.value || '', path); // Allow sending just image if supported, or empty text with image
      clearImage();
    } else {
      if (sendValue.value) {
        emit("onSend", sendValue.value)
      }
    }
  }
}
</script>
<style scoped>
/* Add fade animation */
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
