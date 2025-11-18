// Electron 主进程配置管理模块
import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { AppConfigProps } from './types';

// 默认配置
const DEFAULT_CONFIG: AppConfigProps = {
    language: 'zh-CN',
    fontSize: 16,
    qianfan: {
        apiKey: 'bce-v3/ALTAK-g2SfDcNW8w2etS0ruJ43L/df314ec1b961549c622ea8e4399a3548cbe79e90',
        baseURL: 'https://qianfan.baidubce.com/v2/',
        modelName: '',
    },
    dashscope: {
        apiKey: 'sk-82f9829701634e5dbb14598b0167d4c6',
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        modelName: '',
    },
};

// 配置文件路径
const getConfigPath = () => {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'config.json');
};

// 读取配置
export async function getConfig(): Promise<AppConfigProps> {
    try {
        const configPath = getConfigPath();
        const data = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(data);
        // 合并默认配置，确保所有字段都存在
        return { ...DEFAULT_CONFIG, ...config };
    } catch (error) {
        // 文件不存在或读取失败，返回默认配置
        return DEFAULT_CONFIG;
    }
}

// 保存配置
export async function saveConfig(config: AppConfigProps): Promise<void> {
    try {
        const configPath = getConfigPath();
        // 确保目录存在
        await fs.mkdir(path.dirname(configPath), { recursive: true });
        // 写入配置文件
        await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (error) {
        console.error('保存配置失败:', error);
        throw error;
    }
}

// 更新部分配置
export async function updateConfig(partialConfig: Partial<AppConfigProps>): Promise<AppConfigProps> {
    const currentConfig = await getConfig();
    const newConfig = { ...currentConfig, ...partialConfig };
    await saveConfig(newConfig);
    return newConfig;
}

