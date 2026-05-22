# 快速开始指南 / Quick Start Guide

## 1. 环境准备 / Prerequisites
- Node.js 20+
- npm 10+
- 可选：本地安装 `yt-dlp` 与 `ffmpeg`（或设置 `YT_DLP_PATH`、`FFMPEG_PATH`）

## 2. 安装依赖 / Install Dependencies
```bash
npm install
```

## 3. 启动开发模式 / Start Development
```bash
npm run dev
```

启动后应用会：
- 打开 Electron 窗口与 React 页面
- 自动读取本地设置
- 检查 `yt-dlp` / `ffmpeg` 可用性并在界面提示异常

## 4. 生产构建 / Production Build
```bash
npm run build
```

## 5. 代码质量检查 / Quality Checks
```bash
npm run lint
npm run typecheck
```

## 6. 常见问题 / Troubleshooting
- **提示 yt-dlp unavailable**
  - 安装 yt-dlp，或设置 `YT_DLP_PATH=/absolute/path/to/yt-dlp`
- **提示 ffmpeg unavailable**
  - 安装 ffmpeg，或设置 `FFMPEG_PATH=/absolute/path/to/ffmpeg`
- **无法保存下载目录**
  - 检查目录权限，避免选择只读路径
