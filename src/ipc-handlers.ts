import { ipcMain, BrowserWindow, Menu, app } from 'electron';
import { CreateChatProps, AppConfigProps } from "./types";
import { getConfig, saveConfig, updateConfig } from "./config";
import { messageMerge } from "./helper";
import { ModelValue } from "./enums";
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'node:path';

/**
 * 注册所有 IPC 事件处理器
 * @param mainWindow 主窗口实例
 */
export function registerIpcHandlers(mainWindow: BrowserWindow) {
    // 复制图片到用户目录
    ipcMain.handle("copy-image-to-user-dir", async (e, sourcePath: string) => {
        const userDataPath = app.getPath('userData');
        const imageDir = path.join(userDataPath, 'images');
        await fs.mkdir(imageDir, {
            recursive: true,
        });
        const fileName = path.basename(sourcePath);
        const destPath = path.join(imageDir, fileName);
        await fs.copyFile(sourcePath, destPath);
        return destPath;
    });

    // 配置相关的 IPC handlers
    ipcMain.handle("config:get", async () => {
        return await getConfig();
    });

    ipcMain.handle("config:save", async (e, config: AppConfigProps) => {
        await saveConfig(config);
        return config;
    });

    ipcMain.handle("config:update", async (e, partialConfig: Partial<AppConfigProps>) => {
        return await updateConfig(partialConfig);
    });

    // 右键菜单处理
    ipcMain.handle("show-context-menu", async (event, conversationId: number) => {
        const template = [
            {
                label: '删除对话',
                click: () => {
                    mainWindow.webContents.send("context-menu-command", {
                        command: 'delete',
                        conversationId
                    });
                }
            }
        ];
        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: mainWindow });
    });

    // 聊天处理
    ipcMain.on("start-chat", async (event, data: CreateChatProps) => {
        const { providerName, messages, selectedModel, messageId } = data;
        const newMessage = await messageMerge(messages);
        
        if(providerName === "qianfan") {
            const client = new OpenAI({
                apiKey: process.env.DASHSCOPE_API_KEY, // https://console.bce.baidu.com/iam/#/iam/apikey/list
                baseURL: 'https://qianfan.baidubce.com/v2/', // 千帆ModelBuilder平台地址
            });

            const stream = await client.chat.completions.create({
                messages: newMessage as any,
                model: ModelValue[selectedModel as keyof typeof ModelValue],
                stream: true,
            });

            for await (const chunk of stream) {
                const end = chunk.choices[0]?.finish_reason;
                const res = chunk.choices[0]?.delta.content;
                const content = {
                    messageId,
                    data: {
                        is_end: end,
                        result: res,
                    }
                }
                mainWindow.webContents.send("update-message", content);
            }
        }
        
        if(providerName === "dashscope") {
            const client = new OpenAI(
                {
                    // 新加坡和北京地域的API Key不同。获取API Key：https://help.aliyun.com/zh/model-studio/get-api-key
                    // 若没有配置环境变量，请用阿里云百炼API Key将下行替换为：apiKey: "sk-xxx",
                    apiKey: process.env.ALI_API_KEY,
                    // 以下是北京地域base_url，如果使用新加坡地域的模型，需要将base_url替换为：https://dashscope-intl.aliyuncs.com/compatible-mode/v1
                    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
                }
            );
            const stream = await client.chat.completions.create({
                model: ModelValue[selectedModel as keyof typeof ModelValue],
                messages: newMessage as any,
                stream: true,
                // 目的：在最后一个chunk中获取本次请求的Token用量。
                stream_options: { include_usage: true },
            });
            for await (const chunk of stream) {
                if (chunk.choices && chunk.choices.length > 0) {
                    const end = chunk.choices[0]?.finish_reason;
                    const res = chunk.choices[0]?.delta.content;
                    const content = {
                        messageId,
                        data: {
                            is_end: end,
                            result: res,
                        }
                    }
                    mainWindow.webContents.send("update-message", content);
                }
            }
        }
    });
}

