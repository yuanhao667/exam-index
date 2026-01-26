# 洋葱学园 UED AI 技能考核系统

一个基于 React 和 Tailwind CSS 的前端考试系统。

## 功能特性

- UI 设计师和视觉设计师的 AI 技能考核
- 实时答题和评分系统
- 响应式设计，支持移动端和桌面端
- 自动保存成绩到飞书多维表格

## 技术栈

- React 18
- Tailwind CSS
- Babel Standalone (用于 JSX 转换)
- Vercel Serverless Functions (飞书 API 代理)

## 部署指南

### 方式一：Vercel 部署（推荐）

#### 1. 准备代码仓库

```bash
# 如果还没有 Git 仓库，初始化一个
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### 2. 在 Vercel 部署

1. 访问 [Vercel](https://vercel.com) 并登录
2. 点击 **"Add New Project"** 或 **"Import Project"**
3. 选择你的 GitHub 仓库并导入
4. 在 **"Environment Variables"** 部分，添加以下环境变量：

   ```
   FEISHU_APP_ID=cli_a9f9f58238381bde
   FEISHU_APP_SECRET=4d9U9oZgDtoL7PgSHZltgdx13NP8WDVE
   FEISHU_APP_TOKEN=EDjSb0Tl2ap5aTsbuXgcPpS9nTb
   ```

   > ⚠️ **重要**：这些密钥信息不要写在代码中，只在 Vercel 控制台的环境变量中配置。

5. 点击 **"Deploy"** 开始部署
6. 部署完成后，Vercel 会提供一个访问地址（如：`https://your-project.vercel.app`）

#### 3. 配置环境变量（关键步骤）

在 Vercel 项目设置中配置环境变量：

1. 进入项目 → **Settings** → **Environment Variables**
2. 添加以下三个变量：
   - `FEISHU_APP_ID`
   - `FEISHU_APP_SECRET`
   - `FEISHU_APP_TOKEN`
3. 选择环境（Production、Preview、Development）
4. 保存后，**重新部署**项目使环境变量生效

#### 4. 验证部署

- 访问部署后的 URL
- 打开浏览器开发者工具，测试提交成绩功能
- 检查 Vercel 函数日志，确认 API 调用正常

### 方式二：本地开发

1. 在项目根目录创建 `.env.local` 文件（参考 `.env.example`）
2. 填入飞书配置信息
3. 使用 Vercel CLI 本地运行：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目目录运行
vercel dev
```

或者直接在浏览器中打开 `index.html`（但 API 功能需要服务器环境）。

## 文件结构

```
├── index.html                    # 主页面
├── api/
│   └── feishu/
│       └── index.js              # 飞书 API 代理（Serverless Function）
├── DEFAULT_QUESTIONS_ui.js      # UI 设计师题目
├── DEFAULT_QUESTIONS_visual.js  # 视觉设计师题目
├── vercel.json                   # Vercel 配置
├── package.json                  # 项目配置
└── .env.example                  # 环境变量模板
```

## 注意事项

- ⚠️ **安全**：飞书密钥等敏感信息只配置在 Vercel 环境变量中，不要提交到代码仓库
- 🔄 **更新**：修改代码后推送到 GitHub，Vercel 会自动重新部署
- 📝 **日志**：在 Vercel Dashboard → Functions 中可以查看 API 调用日志
