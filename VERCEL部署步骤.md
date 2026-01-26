# 🚀 Vercel 部署步骤（详细版）

## ✅ 第一步已完成！
你的代码已经成功上传到 GitHub：https://github.com/yuanhao667/exam-index

---

## 🌐 第二步：部署到 Vercel

### 步骤 1：访问 Vercel 并登录

1. **打开浏览器，访问**：https://vercel.com
2. **点击右上角的 "Sign Up" 或 "Log In"**
3. **选择 "Continue with GitHub"**（使用 GitHub 账号登录）
   - 这会要求你授权 Vercel 访问你的 GitHub 账号
   - 点击 "Authorize Vercel" 授权

---

### 步骤 2：导入项目

1. **登录后，你会看到 Vercel 的 Dashboard（控制台）**
2. **点击 "Add New..." 按钮**（通常在右上角或中间）
3. **选择 "Project"**

---

### 步骤 3：选择 GitHub 仓库

1. **在项目列表中，找到 `exam-index` 仓库**
   - 如果看不到，点击 "Import" 或 "Import Git Repository"
   - 或者直接在搜索框搜索 "exam-index"
2. **点击 `exam-index` 仓库旁边的 "Import" 按钮**

---

### 步骤 4：配置项目（重要！）

Vercel 会自动检测项目类型，但你需要确认以下设置：

#### Framework Preset（框架预设）
- 选择：**"Other"** 或 **"Other"**
- 或者保持默认（Vercel 可能会自动识别为静态网站）

#### Root Directory（根目录）
- 保持默认：**`./`**（不要修改）

#### Build Command（构建命令）
- **留空**（因为这是静态网站，不需要构建）
- 或者删除默认值

#### Output Directory（输出目录）
- **留空** 或填写 **`./`**
- 或者删除默认值

#### Install Command（安装命令）
- **留空**（不需要安装依赖）

#### Environment Variables（环境变量）
- **不需要添加**（除非你的项目需要）

---

### 步骤 5：部署

1. **检查所有配置是否正确**
2. **点击绿色的 "Deploy" 按钮**
3. **等待部署完成**（通常 1-2 分钟）
   - 你会看到部署进度
   - 显示 "Building..." 然后 "Deploying..."

---

### 步骤 6：访问你的网站

部署成功后：

1. **你会看到一个成功页面**，显示：
   - ✅ "Congratulations! Your project has been deployed."
   - 你的网站 URL（例如：`https://exam-index.vercel.app`）

2. **点击 URL 或 "Visit" 按钮**，打开你的网站

3. **验证网站是否正常工作**：
   - 页面应该能正常加载
   - 所有功能应该正常工作
   - 样式应该正确显示

---

## 🎉 完成！

现在你的网站已经上线了！你可以：
- 分享这个 URL 给其他人
- 在 GitHub 仓库的 "About" 部分添加这个网站链接
- 继续开发，每次推送到 GitHub 后，Vercel 会自动重新部署

---

## 🔄 自动部署

以后每次你更新代码：

1. **在本地修改代码**
2. **提交并推送到 GitHub**：
   ```bash
   git add .
   git commit -m "更新描述"
   git push
   ```
3. **Vercel 会自动检测到推送并重新部署**
   - 通常在 1-2 分钟内完成
   - 你可以在 Vercel Dashboard 看到部署历史

---

## 🆘 常见问题

### 问题 1：部署失败
**可能原因**：
- 配置错误（Build Command 或 Output Directory）
- 文件路径问题

**解决**：
- 检查 `vercel.json` 配置是否正确
- 确保 `index.html` 在根目录
- 在 Vercel 项目设置中，将 Build Command 和 Output Directory 都留空

### 问题 2：页面显示 404
**解决**：
- 检查 `vercel.json` 配置
- 确保 `index.html` 文件名正确
- 尝试访问：`https://你的域名.vercel.app/index.html`

### 问题 3：样式或 JS 文件加载失败
**解决**：
- 检查文件路径是否正确（使用相对路径）
- 确保所有文件都已上传到 GitHub

### 问题 4：想要自定义域名
**解决**：
1. 在 Vercel Dashboard 中，进入你的项目
2. 点击 "Settings" > "Domains"
3. 添加你的自定义域名
4. 按照提示配置 DNS

---

## 📝 快速检查清单

部署前确认：
- ✅ 代码已推送到 GitHub
- ✅ `vercel.json` 文件存在
- ✅ `index.html` 在根目录
- ✅ 所有资源文件使用相对路径

部署时：
- ✅ Framework Preset: Other
- ✅ Build Command: 留空
- ✅ Output Directory: 留空
- ✅ Install Command: 留空

---

## 🎯 下一步

部署成功后，你可以：
1. **测试网站功能**：确保所有功能正常
2. **分享链接**：把网站 URL 分享给需要的人
3. **添加描述**：在 GitHub 仓库的 "About" 部分添加网站链接和描述
4. **继续开发**：以后每次推送代码，Vercel 会自动更新网站

---

祝你部署顺利！🚀
