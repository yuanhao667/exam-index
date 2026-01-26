# 部署指南

## 📋 准备工作

我已经为你创建了以下文件：
- `.gitignore` - Git 忽略文件配置
- `README.md` - 项目说明文档
- `vercel.json` - Vercel 部署配置

## 🚀 步骤 1: 上传到 GitHub

### 方法一：使用命令行（推荐）

1. **打开终端，进入项目目录**：
   ```bash
   cd "/Users/zhaoyuanhao/Documents/cursor/exam index"
   ```

2. **初始化 Git 仓库**：
   ```bash
   git init
   ```

3. **添加所有文件**：
   ```bash
   git add .
   ```

4. **创建初始提交**：
   ```bash
   git commit -m "Initial commit: 洋葱学园 UED AI 技能考核系统"
   ```

5. **在 GitHub 上创建新仓库**：
   - 访问 https://github.com/new
   - 输入仓库名称（例如：`exam-index`）
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

6. **连接本地仓库到 GitHub**（替换 `YOUR_USERNAME` 和 `YOUR_REPO_NAME`）：
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### 方法二：使用 GitHub Desktop

1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开 GitHub Desktop，选择 "File" > "Add Local Repository"
3. 选择项目文件夹：`/Users/zhaoyuanhao/Documents/cursor/exam index`
4. 点击 "Publish repository" 按钮
5. 输入仓库名称并发布

## 🌐 步骤 2: 部署到 Vercel

### 方法一：通过 GitHub 导入（推荐）

1. **访问 Vercel**：
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**：
   - 点击 "Add New..." > "Project"
   - 选择你刚创建的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**：
   - Vercel 会自动检测到这是一个静态网站
   - Framework Preset: 选择 "Other" 或保持默认
   - Root Directory: 保持默认（`./`）
   - Build Command: 留空（静态网站不需要构建）
   - Output Directory: 留空或填写 `./`
   - Install Command: 留空

4. **部署**：
   - 点击 "Deploy"
   - 等待部署完成（通常 1-2 分钟）

5. **访问网站**：
   - 部署完成后，Vercel 会提供一个 URL（例如：`https://your-project.vercel.app`）
   - 点击 URL 即可访问你的网站

### 方法二：使用 Vercel CLI

1. **安装 Vercel CLI**：
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**：
   ```bash
   vercel login
   ```

3. **部署项目**：
   ```bash
   cd "/Users/zhaoyuanhao/Documents/cursor/exam index"
   vercel
   ```

4. **按照提示操作**：
   - 选择项目设置
   - 确认部署

## ✅ 验证部署

部署成功后，你应该能够：
- 通过 Vercel 提供的 URL 访问网站
- 所有功能正常工作
- 页面样式正确显示

## 🔄 更新网站

每次更新代码后：

1. **提交更改到 Git**：
   ```bash
   git add .
   git commit -m "更新描述"
   git push
   ```

2. **Vercel 会自动重新部署**：
   - 如果你通过 GitHub 导入，Vercel 会自动检测推送并重新部署
   - 通常 1-2 分钟后新版本就会上线

## 📝 注意事项

1. **文件路径**：确保所有资源文件（JS、CSS）使用相对路径
2. **HTTPS**：Vercel 自动提供 HTTPS 证书
3. **自定义域名**：可以在 Vercel 项目设置中添加自定义域名
4. **环境变量**：如果需要，可以在 Vercel 项目设置中添加环境变量

## 🆘 遇到问题？

- **Git 权限问题**：确保你有写入项目目录的权限
- **部署失败**：检查 `vercel.json` 配置是否正确
- **页面无法访问**：检查文件路径是否正确，确保 `index.html` 在根目录
