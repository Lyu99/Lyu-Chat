// 配置 Store
import { defineStore } from 'pinia';
import { AppConfigProps, ProviderConfigProps } from '../types';
import i18n from '../plugins/i18n';

export const useConfigStore = defineStore('config', {
    state: (): AppConfigProps => ({
        language: 'zh-CN',
        fontSize: 16,
        qianfan: undefined,
        dashscope: undefined,
    }),

    actions: {
        // 从本地加载配置
        async loadConfig() {
            try {
                const config = await window.electronAPI.configGet();
                this.language = config.language;
                this.fontSize = config.fontSize;
                this.qianfan = config.qianfan;
                this.dashscope = config.dashscope;
                // 同步语言到 i18n
                i18n.global.locale.value = config.language === 'en-US' ? 'en' : config.language;
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
                    qianfan: this.qianfan,
                    dashscope: this.dashscope,
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
                this.qianfan = newConfig.qianfan;
                this.dashscope = newConfig.dashscope;
            } catch (error) {
                console.error('更新配置失败:', error);
                throw error;
            }
        },

        // 设置语言
        async setLanguage(language: 'zh-CN' | 'en-US') {
            this.language = language;
            // 同步语言到 i18n
            i18n.global.locale.value = language === 'en-US' ? 'en' : language;
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

        // 设置百度千帆配置
        async setQianfanConfig(config: ProviderConfigProps) {
            this.qianfan = config;
            await this.updateConfig({ qianfan: config });
        },

        // 设置阿里灵积配置
        async setDashscopeConfig(config: ProviderConfigProps) {
            this.dashscope = config;
            await this.updateConfig({ dashscope: config });
        },
    },
});

