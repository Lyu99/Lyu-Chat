import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
// import { MakerDeb } from '@electron-forge/maker-deb';
// import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { PublisherGithub } from '@electron-forge/publisher-github';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: "LyuChat",
  },
  rebuildConfig: {},
  makers: [
     new MakerSquirrel({
      // 应用信息
      name: 'LyuChat',
      authors: 'Lyu',
      description: 'A chat application',
      // 安装程序配置
      // setupIcon: './assets/icon.ico',  // Windows 安装图标
      // iconUrl: 'https://raw.githubusercontent.com/your-repo/vchat/main/assets/icon.ico', // 远程图标URL
      // 快捷方式设置
      setupExe: 'LyuChat-Setup.exe',  // 安装程序名称
    }),
    new MakerZIP({}, ['win32']),
    // new MakerRpm({}),
    // new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'your-github-username',  // 替换为你的 GitHub 用户名或组织名
        name: 'your-repo-name'         // 替换为你的仓库名
      },
      prerelease: false,  // 是否作为预发布版本
      draft: true,        // 是否创建为草稿（建议先设为 true 测试）
    })
  ],
};

export default config;
