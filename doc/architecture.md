# 架构设计文档 / Architecture Design

## 1. 总体分层 / Layered Architecture
1. **主进程 Main Process**（Electron Main）  
   负责窗口生命周期、系统交互、任务调度入口。  
   Owns app lifecycle, system integration, and task orchestration entry.
2. **渲染进程 Renderer Process**（React UI）  
   负责用户交互、状态展示、参数输入。  
   Handles user interactions, state display, and input collection.
3. **逻辑服务层 Logic Services**（Downloader/Store/Utils）  
   封装下载、设置存储、路径/日志等能力。  
   Encapsulates downloader, settings store, and utility capabilities.
4. **IPC 层 IPC Layer**  
   主渲染进程通信通道，采用白名单 channel 与 typed payload。  
   Main-renderer communication via channel whitelist and typed payloads.
5. **第三方集成 Third-party Integrations**  
   对接 yt-dlp 与 ffmpeg 等外部二进制。  
   Integrates external binaries such as yt-dlp and ffmpeg.

## 2. 调用机制 / yt-dlp & ffmpeg Invocation Flow
- 解析阶段 Probe：主进程通过 `spawn` 调用 `yt-dlp -J <url>`，解析 JSON。  
  Probe phase: main process invokes `yt-dlp -J <url>` and parses JSON output.
- 下载阶段 Download：主进程根据用户选择拼装参数（`-f`、`--remux-video`、`-x --audio-format` 等）启动任务。  
  Download phase: main process assembles args based on user options and starts task.
- 转封装/转码阶段 Post-process：通过 yt-dlp 触发 ffmpeg 处理，输出目标格式文件。  
  Post-process phase: ffmpeg is triggered by yt-dlp for remux/transcode output.
- 进度回传 Progress：读取 stdout/stderr，解析关键行并通过 IPC 推送到前端。  
  Progress feedback: parse stdout/stderr lines and push structured updates via IPC.

## 3. 前端组件划分 / Frontend Component Boundaries
- `UrlInput`：URL 输入与触发解析。  
- `VideoInfoCard`：展示媒体信息、格式与输出配置。  
- `DownloadTaskList`：展示任务状态与进度。  
- `SettingsPanel`：管理输出目录等本地设置。  

UI 组件遵循“展示与行为分离”的原则，状态可逐步沉淀至统一 store。  
UI components follow separation of concerns; state can be consolidated into a centralized store as the app grows.

## 4. 安全与边界 / Security Boundaries
- 使用 `preload + contextIsolation` 暴露最小 API 面。  
  Expose minimal APIs through `preload + contextIsolation`.
- 渲染进程不直接访问 Node 能力。  
  Renderer must not access raw Node APIs directly.
- 外部命令参数需校验与转义策略（避免注入风险）。  
  Validate and sanitize command parameters to reduce injection risk.

## 5. 可扩展方向 / Extensibility
- 下载任务队列与并发控制。  
- 失败重试、暂停/取消。  
- 插件化站点适配与策略配置。  
- 跨平台二进制自动安装与更新（详见 `doc/binary-distribution.md`）。  

These extensions can be added without changing the core layered boundaries.
