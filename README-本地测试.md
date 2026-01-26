# 本地测试指南

## 快速开始

### 1. 启动本地代理服务器

在终端中运行：

```bash
cd "/Users/zhaoyuanhao/Documents/cursor/exam index"
node proxy-server.js
```

你会看到：
```
✅ 本地代理服务器已启动！
📝 访问地址: http://localhost:3000
```

### 2. 在浏览器中打开

访问：**http://localhost:3000**

### 3. 测试功能

1. 输入姓名并选择角色（UI组 或 视觉组）
2. 完成答题
3. 数据会自动保存到飞书表格

## 停止服务器

在终端中按 `Ctrl + C` 停止服务器。

## 工作原理

- 本地代理服务器运行在 `http://localhost:3000`
- 它代理所有飞书 API 请求，绕过浏览器的 CORS 限制
- 同时提供静态文件服务（index.html 等）

## 注意事项

- 本地测试时，必须运行 `proxy-server.js`
- 部署到 Vercel 后，会自动使用 Vercel Functions（如果配置正确）
- 如果遇到问题，检查终端中的错误信息
