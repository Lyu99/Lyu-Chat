<template>
  <div class="w-[80%] h-full mx-auto">
    <div class="h-[85%] flex items-center">
      <ProviderSelect :items="providers" v-model="selectModel"></ProviderSelect>
    </div>
    <div class="h-[15%] flex items-center">
      <SendMessage v-model="inMessageText" @on-send="msgOnSend"></SendMessage>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ProviderSelect from "../components/ProviderSelect.vue";
import SendMessage from "../components/SendMessage.vue";
import { providers } from "../testData";

const inMessageText = ref("");
const msgOnSend = (value: string) => {
  console.log(value);
}
const selectModel = ref("");
</script>
<style scoped>

</style>
