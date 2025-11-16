<template>
  <div class="w-full flex items-center justify-between">
    <input class="h-[35px] w-[85%] px-[4px] items-center justify-center border-2 data-[placeholder-text]:white rounded"
           type="text"
           v-model="sendValue"
           :disabled="disabled"
    >
    <Button icon-name="radix-icons:paper-plane" @click="handleSend" :disabled="disabled">发送</Button>
  </div>
</template>
<script setup lang="ts">
import Button from "../components/Button.vue";

const sendValue = defineModel<string>();
const emit = defineEmits<{
  onSend: [string]
}>()
defineProps<{
  disabled?: boolean
}>();
const handleSend = () => {
  if(sendValue.value) {
    emit("onSend", sendValue.value)
  }
}
</script>
<style scoped>

</style>
