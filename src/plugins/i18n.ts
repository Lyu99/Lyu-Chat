import { createI18n } from 'vue-i18n';
import zhCN from '../locales/zh-CN.json';
import en from '../locales/en.json';

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'zh-CN', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'en': en
  },
  globalInjection: true, // 全局注入 $t 函数
});

export default i18n;

