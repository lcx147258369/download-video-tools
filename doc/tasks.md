# 开发任务清单 / Development Task List

> 聚焦 MVP，实现“可下载、可用、可扩展”。  
> Focus on MVP: downloadable, usable, extensible.

状态标签 Status Labels：
- 🟢 **已完成 / Completed**
- ⚪ **待办 / Todo**
- 🟡 **待优化拓展 / Needs Improvement**

| 区域 Area | 任务 Task | 状态 Status |
|---|---|---|
| 前端 Frontend | URL 输入与校验 URL input & validation（P0）：保证基础交互完整，降低错误输入。 | 🟡 **待优化拓展 / Needs Improvement** |
| 前端 Frontend | 视频信息卡片 Video info card（P0）：展示标题、封面、时长、格式列表。 | 🟡 **待优化拓展 / Needs Improvement** |
| 前端 Frontend | 格式选择组件 Format selector（P0）：支持 Auto 与手动 formatId。 | 🟢 **已完成 / Completed** |
| 前端 Frontend | 任务列表与状态 UI Task list/status UI（P0）：显示进度、速度、ETA、状态。 | 🟢 **已完成 / Completed** |
| 前端 Frontend | 设置面板 Settings panel（P1）：输出目录设置与保存反馈。 | 🟢 **已完成 / Completed** |
| 后端 Backend | URL 解析服务 Probe service（P0）：调用 yt-dlp 提取元数据并标准化。 | 🟡 **待优化拓展 / Needs Improvement** |
| 后端 Backend | 下载执行器 Download runner（P0）：支持 formatId 与 outputFormat 参数。 | 🟡 **待优化拓展 / Needs Improvement** |
| 后端 Backend | 进度解析 Progress parser（P0）：解析下载日志并推送结构化进度。 | 🟡 **待优化拓展 / Needs Improvement** |
| 后端 Backend | 错误处理 Error handling（P1）：统一异常信息，提升可排障性。 | ⚪ **待办 / Todo** |
| 桌面集成 Desktop Integration | Electron 主/渲染进程桥接 IPC bridge（P0）：通过 preload 暴露受控 API。 | 🟢 **已完成 / Completed** |
| 桌面集成 Desktop Integration | 系统能力封装 System capability wrapper（P1）：打开目录、平台兼容路径处理。 | 🟡 **待优化拓展 / Needs Improvement** |
| 二进制管理 Binary Management | yt-dlp 路径与可执行检查 Binary resolution/check（P0）：保证启动后可用，失败可提示。 | ⚪ **待办 / Todo** |
| 二进制管理 Binary Management | ffmpeg 能力探测 ffmpeg capability probe（P1）：支持 remux/audio extract 场景。 | ⚪ **待办 / Todo** |
| 二进制管理 Binary Management | 跨平台分发策略 Cross-platform distribution（P2）：为后续安装包与自动更新做准备。 | ⚪ **待办 / Todo** |
| 文档 Documentation | PRD 与架构文档 PRD/architecture docs（P0）：明确需求范围与实现边界。 | 🟢 **已完成 / Completed** |
| 文档 Documentation | 规范文档 Conventions doc（P0）：统一编码、提交、评审流程。 | 🟢 **已完成 / Completed** |
| 文档 Documentation | 快速开始指南 Quick start guide（P1）：降低新成员上手成本。 | ⚪ **待办 / Todo** |
