# 项目规范 / Project Conventions

## 1. 代码风格 / Code Style
### TypeScript Best Practices
- 开启严格类型（`strict`）并优先使用显式类型边界。  
  Enable strict typing and keep explicit type boundaries.
- 避免 `any`，优先使用 `unknown` + 类型收窄。  
  Avoid `any`; prefer `unknown` with narrowing.
- 对 IPC payload 定义共享类型，避免主/渲染进程漂移。  
  Define shared IPC payload types to prevent schema drift.

### 目录结构 / Directory Structure
- `src/main`：主进程、IPC 注册、系统级能力。  
- `src/preload`：安全桥接 API。  
- `src/renderer`：React 页面与组件。  
- `src/shared`：跨层共享类型与常量。  

### 命名规范 / Naming Conventions
- 文件名：模块语义清晰，组件使用 PascalCase（如 `VideoInfoCard.tsx`）。  
- 变量/函数：camelCase；类型/接口：PascalCase。  
- IPC Channel：全大写常量集合管理（如 `IPC_CHANNELS`）。  

## 2. Commit Style
- 建议采用 Conventional Commits：  
  Recommend Conventional Commits:
  - `feat:` 新功能 / new feature
  - `fix:` 缺陷修复 / bug fix
  - `docs:` 文档更新 / docs change
  - `refactor:` 重构 / refactor
  - `chore:` 工程维护 / maintenance

示例 Example: `docs: add project PRD and architecture docs`

## 3. PR 流程 / Pull Request Workflow
1. 小步提交，保持单一主题。  
   Keep PRs focused and scoped.
2. PR 描述需包含：目标、变更范围、验证方式。  
   PR description should include goal, scope, and validation steps.
3. 评审通过后再合并，避免直接推送主分支。  
   Merge only after review; avoid direct pushes to main.

## 4. 安全与依赖管理 / Security & Dependency Management
- 外部命令执行统一封装，避免直接拼接不可信输入。  
  Wrap command execution and avoid unsafe direct concatenation.
- 新增依赖需说明用途、版本策略与替代方案评估。  
  Document purpose, version strategy, and alternatives for new deps.
- 定期升级 yt-dlp/ffmpeg 与 npm 依赖，跟踪漏洞公告。  
  Regularly update yt-dlp/ffmpeg and npm deps, track advisories.
- 对下载路径、文件名等用户输入做合法性校验。  
  Validate user-provided paths and filenames.
