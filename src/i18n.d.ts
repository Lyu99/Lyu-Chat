// i18n 类型定义
import 'vue-i18n';

// 导入语言文件类型
import zhCN from './locales/zh-CN.json';

type MessageSchema = typeof zhCN;

declare module 'vue-i18n' {
  // 为 useI18n 提供类型
  export interface DefineLocaleMessage extends MessageSchema {}
}

