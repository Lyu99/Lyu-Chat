<template>
  <div class="setting-container p-8 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">{{ t('settings.title') }}</h1>

    <!-- Tabs 组件 -->
    <TabsRoot default-value="language" class="w-full">
      <TabsList class="flex border-b border-gray-200 mb-6">
        <TabsTrigger 
          value="language"
          class="px-6 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 transition-all cursor-pointer"
        >
          语言设置
        </TabsTrigger>
        <TabsTrigger 
          value="model"
          class="px-6 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 transition-all cursor-pointer"
        >
          模型设置
        </TabsTrigger>
      </TabsList>

      <!-- 语言设置标签内容 -->
      <TabsContent value="language" class="mt-6">
        <!-- 语言设置 -->
        <div class="setting-item mb-8">
          <label class="block text-sm font-medium mb-3 text-gray-700">{{ t('settings.language.label') }}</label>
          <SelectRoot v-model="selectedLanguage" @update:model-value="handleLanguageChange">
            <SelectTrigger 
              class="inline-flex min-w-[200px] items-center justify-between rounded px-4 text-sm leading-none h-10 gap-2 bg-white text-gray-900 shadow-[0_2px_10px] shadow-black/10 hover:bg-gray-50 focus:shadow-[0_0_0_2px] focus:shadow-blue-500 outline-none border border-gray-300"
            >
              <SelectValue placeholder="选择语言..." />
              <Icon icon="radix-icons:chevron-down" class="h-4 w-4" />
            </SelectTrigger>
            <SelectPortal>
              <SelectContent 
                class="min-w-[200px] bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-[100]"
                :side-offset="5"
              >
                <SelectViewport class="p-1">
                  <SelectItem 
                    v-for="lang in languages" 
                    :key="lang.value"
                    :value="lang.value"
                    class="text-sm leading-none text-gray-900 rounded flex items-center h-8 px-8 pr-9 relative select-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white cursor-pointer"
                  >
                    <SelectItemIndicator class="absolute left-2 inline-flex items-center justify-center">
                      <Icon icon="radix-icons:check" class="h-4 w-4" />
                    </SelectItemIndicator>
                    <SelectItemText>{{ lang.label }}</SelectItemText>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>

        <!-- 字体大小设置 -->
        <div class="setting-item mb-8">
          <label class="block text-sm font-medium mb-3 text-gray-700">{{ t('settings.fontSize.label') }}</label>
          <NumberFieldRoot 
            v-model="fontSize"
            :min="12"
            :max="24"
            :step="1"
            @update:model-value="handleFontSizeChange"
            class="flex items-center gap-2"
          >
            <NumberFieldInput 
              class="w-32 h-10 px-3 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div class="flex flex-col gap-1">
              <NumberFieldIncrement
                class="h-5 px-2 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
              >
                <Icon icon="radix-icons:chevron-up" class="h-3 w-3" />
              </NumberFieldIncrement>
              <NumberFieldDecrement
                class="h-5 px-2 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
              >
                <Icon icon="radix-icons:chevron-down" class="h-3 w-3" />
              </NumberFieldDecrement>
            </div>
            <span class="text-sm text-gray-500 ml-2">{{ t('settings.fontSize.unit') }} ({{ t('settings.fontSize.range') }})</span>
          </NumberFieldRoot>
        </div>

        <!-- 预览区域 -->
        <div class="preview-section mt-12 p-6 border-2 border-gray-200 rounded-lg bg-gray-50">
          <h3 class="text-sm font-semibold mb-3 text-gray-700">{{ t('settings.preview.title') }}</h3>
          <p :style="{ fontSize: fontSize + 'px' }" class="text-gray-900 leading-relaxed">
            {{ t('settings.preview.sampleText') }}
          </p>
        </div>

        <!-- 提示信息 -->
        <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800 flex items-center gap-2">
            <Icon icon="radix-icons:info-circled" class="h-4 w-4" />
            {{ t('settings.info.autoSave') }} <code class="text-xs bg-blue-100 px-1 py-0.5 rounded">userData/config.json</code>
          </p>
        </div>
      </TabsContent>

      <!-- 模型设置标签内容 -->
      <TabsContent value="model" class="mt-6">
        <AccordionRoot 
          type="single" 
          :collapsible="true"
          class="w-full bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <AccordionItem value="model-config" class="border-b border-gray-200">
            <AccordionHeader class="flex">
              <AccordionTrigger 
                class="flex flex-1 items-center justify-between px-6 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors group"
              >
                <span>模型配置</span>
                <Icon 
                  icon="radix-icons:chevron-down" 
                  class="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" 
                />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent 
              class="px-6 pb-6 pt-2 text-sm text-gray-700 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
            >
              <div class="space-y-4">
                <!-- API Key 输入框 -->
                <div class="form-field">
                  <label for="apiKey" class="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    id="apiKey"
                    v-model="modelConfig.apiKey"
                    type="password"
                    placeholder="请输入 API Key"
                    class="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>

                <!-- Base URL 输入框 -->
                <div class="form-field">
                  <label for="baseURL" class="block text-sm font-medium text-gray-700 mb-2">
                    Base URL
                  </label>
                  <input
                    id="baseURL"
                    v-model="modelConfig.baseURL"
                    type="text"
                    placeholder="https://api.openai.com/v1"
                    class="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>

                <!-- Model Name 输入框 -->
                <div class="form-field">
                  <label for="modelName" class="block text-sm font-medium text-gray-700 mb-2">
                    Model Name
                  </label>
                  <input
                    id="modelName"
                    v-model="modelConfig.modelName"
                    type="text"
                    placeholder="gpt-3.5-turbo"
                    class="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      </TabsContent>
    </TabsRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfigStore } from '../store/config';
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue';
import {
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from 'radix-vue';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'radix-vue';
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from 'radix-vue';
import { Icon } from '@iconify/vue';

const { t } = useI18n();
const configStore = useConfigStore();

// 语言选项
const languages = ref([
  { value: 'zh-CN', label: '' },
  { value: 'en-US', label: '' },
]);

// 本地响应式状态
const selectedLanguage = ref<'zh-CN' | 'en-US'>('zh-CN');
const fontSize = ref(16);

// 模型配置
const modelConfig = ref({
  apiKey: '',
  baseURL: '',
  modelName: '',
});

// 组件挂载时加载配置
onMounted(async () => {
  await configStore.loadConfig();
  selectedLanguage.value = configStore.language;
  fontSize.value = configStore.fontSize;
  // 更新语言选项的标签
  languages.value = [
    { value: 'zh-CN', label: t('settings.language.zhCN') },
    { value: 'en-US', label: t('settings.language.enUS') },
  ];
});

// 处理语言更改
const handleLanguageChange = async (value: string) => {
  try {
    await configStore.setLanguage(value as 'zh-CN' | 'en-US');
    console.log('语言已更新:', value);
  } catch (error) {
    console.error('更新语言失败:', error);
  }
};

// 处理字体大小更改
const handleFontSizeChange = async (value: number | undefined) => {
  if (value === undefined) return;
  try {
    await configStore.setFontSize(value);
    console.log('字体大小已更新:', value);
  } catch (error) {
    console.error('更新字体大小失败:', error);
  }
};
</script>
