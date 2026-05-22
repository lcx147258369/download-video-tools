# 二进制分发策略 / Binary Distribution Strategy

## 目标 / Goal
- 为 `yt-dlp` 与 `ffmpeg` 提供跨平台可执行文件来源、落地目录与版本升级策略。  
- Prepare cross-platform sourcing, placement, and upgrade strategy for `yt-dlp` and `ffmpeg`.

## 平台与落地目录 / Platform Targets & Install Paths
- **macOS**: `~/Library/Application Support/download-video-tools/bin`
- **Windows**: `%APPDATA%/download-video-tools/bin`
- **Linux**: `~/.local/share/download-video-tools/bin`

应用启动时优先顺序：
1. 环境变量 `YT_DLP_PATH` / `FFMPEG_PATH`
2. 应用私有目录下的二进制
3. 系统 PATH 中的同名命令

## 分发方式 / Distribution Approach
1. 安装包内可选预置（按平台拆分资源，避免包体过大）。  
2. 首次启动按平台下载并校验（SHA256）后缓存。  
3. 后续通过版本清单比对实现增量更新。  

## 版本与更新策略 / Version & Update Policy
- 记录当前版本到本地配置（如 `binary-manifest.json`）。
- 每次应用启动时可后台对比远程清单。
- 检测到新版本时提示用户更新（静默下载 + 下次启动切换）。

## 安全策略 / Security
- 下载后必须做哈希校验与执行权限校验。
- 仅允许 HTTPS 与受信任发布源。
- 校验失败时回退至旧版本并提示用户。

## 与当前实现的关系 / Relation to Current Code
- 当前代码已实现运行时探测与可执行检查（`BinaryService`）。
- 本文档作为后续安装包集成与自动更新的实现基线。
