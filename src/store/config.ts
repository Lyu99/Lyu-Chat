// 配置 Store
import { defineStore } from 'pinia';
import { AppConfigProps } from '../types';

export const useConfigStore = defineStore('config', {
    state: (): AppConfigProps => ({
        language: 'zh-CN',
        fontSize: 16,
    }),

    actions: {
        // 从本地加载配置
        async loadConfig() {
            try {
                const config = await window.electronAPI.configGet();
                this.language = config.language;
                this.fontSize = config.fontSize;
            } catch (error) {
                console.error('加载配置失败:', error);
            }
        },

        // 保存完整配置
        async saveConfig() {
            try {
                const config: AppConfigProps = {
                    language: this.language,
                    fontSize: this.fontSize,
                };
                await window.electronAPI.configSave(config);
            } catch (error) {
                console.error('保存配置失败:', error);
                throw error;
            }
        },

        // 更新部分配置
        async updateConfig(partialConfig: Partial<AppConfigProps>) {
            try {
                const newConfig = await window.electronAPI.configUpdate(partialConfig);
                this.language = newConfig.language;
                this.fontSize = newConfig.fontSize;
            } catch (error) {
                console.error('更新配置失败:', error);
                throw error;
            }
        },

        // 设置语言
        async setLanguage(language: 'zh-CN' | 'en-US') {
            this.language = language;
            await this.updateConfig({ language });
        },

        // 设置字体大小
        async setFontSize(fontSize: number) {
            // 限制字体大小范围 12-24
            if (fontSize < 12) fontSize = 12;
            if (fontSize > 24) fontSize = 24;
            this.fontSize = fontSize;
            await this.updateConfig({ fontSize });
        },
    },
});

