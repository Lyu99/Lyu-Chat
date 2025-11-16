import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { ipcMain } from "electron";
import { CreateChatProps } from "./types";
import OpenAI from 'openai';
import 'dotenv/config';
import { ModelValue } from "./enums";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  ipcMain.on("start-chat", async (event, data: CreateChatProps) => {
      const { providerName, messages, selectedModel, messageId } = data;
      if(providerName === "qianfan") {
          const client = new OpenAI({
              apiKey: process.env.DASHSCOPE_API_KEY, // https://console.bce.baidu.com/iam/#/iam/apikey/list
              baseURL: 'https://qianfan.baidubce.com/v2/', // 千帆ModelBuilder平台地址
          });

          const stream = await client.chat.completions.create({
              messages: messages as any,
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
              model: "qwen-plus",
              messages: [
                  { role: "system", content: "You are a helpful assistant." },
                  { role: "user", content: "请介绍一下自己" },
              ],
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
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
