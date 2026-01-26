# 📚 详细步骤：上传到 GitHub

## 第一步：配置 Git（如果还没配置过）

打开终端（Terminal），执行以下命令来配置你的 Git 信息：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

**示例**：
```bash
git config --global user.name "Zhang San"
git config --global user.email "zhangsan@example.com"
```

> 💡 **提示**：这个配置只需要做一次，之后所有项目都会使用这个信息。

---

## 第二步：在项目目录中初始化 Git

1. **打开终端（Terminal）**

2. **进入项目目录**：
   ```bash
   cd "/Users/zhaoyuanhao/Documents/cursor/exam index"
   ```

3. **初始化 Git 仓库**：
   ```bash
   git init
   ```
   你会看到类似这样的输出：`Initialized empty Git repository in ...`

4. **添加所有文件**：
   ```bash
   git add .
   ```
   这个命令会把项目中的所有文件添加到 Git 的暂存区。

5. **创建第一次提交**：
   ```bash
   git commit -m "Initial commit: 洋葱学园 UED AI 技能考核系统"
   ```
   你会看到类似这样的输出，显示提交了哪些文件。

---

## 第三步：在 GitHub 上创建仓库

1. **打开浏览器，访问 GitHub**：
   - 网址：https://github.com
   - 如果没有账号，先注册一个（免费）

2. **登录后，点击右上角的 "+" 号**，选择 "New repository"

3. **填写仓库信息**：
   - **Repository name**（仓库名称）：例如 `exam-index` 或 `onion-exam-system`
   - **Description**（描述，可选）：例如 "洋葱学园 UED AI 技能考核系统"
   - **Public 或 Private**：选择 Public（公开）或 Private（私有）
   - ⚠️ **重要**：**不要**勾选以下选项：
     - ❌ "Add a README file"
     - ❌ "Add .gitignore"
     - ❌ "Choose a license"
   - 保持所有选项为空

4. **点击绿色的 "Create repository" 按钮**

5. **创建成功后，GitHub 会显示一个页面**，上面有类似这样的命令：
   ```
   …or push an existing repository from the command line
   git remote add origin https://github.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```

---

## 第四步：连接本地仓库到 GitHub 并上传

1. **回到终端**，确保还在项目目录中

2. **添加 GitHub 远程仓库**（替换成你实际的用户名和仓库名）：
   ```bash
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   ```
   
   **示例**：
   ```bash
   git remote add origin https://github.com/zhangsan/exam-index.git
   ```

3. **将分支重命名为 main**（GitHub 默认使用 main）：
   ```bash
   git branch -M main
   ```

4. **上传代码到 GitHub**：
   ```bash
   git push -u origin main
   ```

5. **如果这是第一次使用 GitHub**，可能会要求你：
   - **输入用户名**：输入你的 GitHub 用户名
   - **输入密码**：输入你的 GitHub 密码（或者 Personal Access Token）
   
   > 💡 **注意**：如果使用密码，GitHub 现在要求使用 Personal Access Token 而不是密码。
   > 如果遇到认证问题，可以：
   > - 使用 GitHub Desktop（图形界面，更简单）
   > - 或者创建 Personal Access Token（见下方说明）

---

## 🔐 如果遇到认证问题（需要 Personal Access Token）

如果 `git push` 时要求输入密码但密码不工作，你需要创建 Personal Access Token：

1. **访问**：https://github.com/settings/tokens
2. **点击** "Generate new token" > "Generate new token (classic)"
3. **填写信息**：
   - Note（备注）：例如 "My Computer"
   - Expiration（过期时间）：选择 "No expiration" 或自定义
   - **勾选权限**：至少勾选 `repo`（全部权限）
4. **点击** "Generate token"
5. **复制生成的 token**（只显示一次，要保存好！）
6. **在终端输入密码时，粘贴这个 token 而不是密码**

---

## ✅ 验证是否成功

上传成功后：

1. **刷新你的 GitHub 仓库页面**
2. **你应该能看到所有文件**：
   - index.html
   - DEFAULT_QUESTIONS_ui.js
   - DEFAULT_QUESTIONS_visual.js
   - README.md
   - .gitignore
   - vercel.json
   - DEPLOYMENT.md

如果看到了这些文件，说明上传成功！🎉

---

## 🆘 常见问题

### 问题 1：`git: command not found`
**解决**：需要先安装 Git
- macOS：打开终端，运行 `xcode-select --install`
- 或者从 https://git-scm.com/downloads 下载安装

### 问题 2：`fatal: remote origin already exists`
**解决**：说明已经添加过远程仓库了，可以：
```bash
git remote remove origin
git remote add origin https://github.com/你的用户名/仓库名.git
```

### 问题 3：`Permission denied`
**解决**：检查你的 GitHub 用户名和仓库名是否正确，或者使用 Personal Access Token

### 问题 4：想要更简单的方法？
**解决**：使用 GitHub Desktop（图形界面工具）
1. 下载：https://desktop.github.com/
2. 安装后，选择 "File" > "Add Local Repository"
3. 选择项目文件夹
4. 点击 "Publish repository" 按钮

---

## 📝 完整命令总结

如果你已经配置过 Git，只需要执行这些命令：

```bash
# 1. 进入项目目录
cd "/Users/zhaoyuanhao/Documents/cursor/exam index"

# 2. 初始化 Git（如果还没初始化）
git init

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "Initial commit: 洋葱学园 UED AI 技能考核系统"

# 5. 连接 GitHub（替换成你的信息）
git remote add origin https://github.com/你的用户名/仓库名.git

# 6. 重命名分支
git branch -M main

# 7. 上传
git push -u origin main
```

---

完成这一步后，就可以继续部署到 Vercel 了！🚀
