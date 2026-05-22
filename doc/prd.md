# 产品需求文档（PRD）/ Product Requirements Document

## 1. 项目目标 / Project Goals
- 构建一个桌面端在线视频下载工具，支持主流平台链接解析与下载。  
  Build a desktop video downloader that supports parsing and downloading from mainstream online video platforms.
- 提供稳定、可扩展、低学习成本的下载体验。  
  Provide a stable, extensible, and low-learning-curve download experience.
- 支持多格式输出，覆盖视频与音频场景。  
  Support multi-format output for both video and audio use cases.

## 2. 目标受众 / Target Audience
- 需要离线观看内容的普通用户。  
  General users who need offline viewing.
- 内容创作者与剪辑人员。  
  Content creators and editors.
- 对批量下载与格式转换有需求的进阶用户。  
  Advanced users requiring batch download and format conversion.

## 3. 核心功能 / Core Features
1. **链接解析 / URL Probe**：输入视频页面 URL，提取标题、时长、封面、可选格式。  
2. **格式选择 / Format Selection**：支持 Auto 与指定格式下载。  
3. **多格式输出 / Multi-format Output**：支持 mp4、mkv、webm、mp3 等。  
4. **下载任务管理 / Task Management**：任务状态、进度、速度、ETA 展示。  
5. **基础设置 / Basic Settings**：下载目录配置与保存。  
6. **易用性 / Usability**：简洁 UI、低门槛操作流程。

## 4. 典型用户场景 / Typical User Scenarios
- **场景 A：快速下载单个视频**  
  用户粘贴 URL → 解析信息 → 点击下载 → 在默认目录查看结果。  
  User pastes URL → reviews metadata → starts download → finds output in default folder.

- **场景 B：导出音频用于学习/剪辑**  
  用户选择 mp3 输出并开始下载。  
  User selects mp3 output and downloads audio for learning/editing.

- **场景 C：按格式控制输出质量**  
  用户手动选择 formatId 与容器格式（如 mkv）。  
  User manually chooses formatId and container output (e.g., mkv).

## 5. MVP 功能列表 / MVP Feature List
| 模块 Module | 功能 Feature | MVP 状态 Status |
|---|---|---|
| 解析 Probe | URL 元数据解析 Metadata parsing | 必须 Must |
| 下载 Download | 基础下载流程 Basic download flow | 必须 Must |
| 输出 Output | 多格式输出 Multi-format output | 必须 Must |
| 任务 Task | 进度与状态展示 Progress/status display | 必须 Must |
| 设置 Settings | 输出目录持久化 Output directory persistence | 必须 Must |
| 体验 UX | 错误提示与交互反馈 Error and interaction feedback | 建议 Should |

## 6. 非目标（当前阶段）/ Non-goals (Current Phase)
- 账号登录体系与云端同步。  
  Account system and cloud sync.
- 在线播放与媒体管理平台化能力。  
  Built-in online player or full media management platform.
