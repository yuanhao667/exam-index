#!/bin/bash

# 快速上传到 GitHub 的脚本
# 使用方法：在终端中运行 bash 快速上传命令.sh

echo "🚀 开始上传到 GitHub..."
echo ""

# 进入项目目录
cd "/Users/zhaoyuanhao/Documents/cursor/exam index"

# 检查是否已配置 Git 用户信息
if ! git config user.name &> /dev/null; then
    echo "⚠️  检测到未配置 Git 用户信息"
    echo "请先运行以下命令配置（只需要配置一次）："
    echo "  git config --global user.name \"你的名字\""
    echo "  git config --global user.email \"你的邮箱\""
    echo ""
    read -p "是否现在配置？(y/n): " configure
    if [ "$configure" = "y" ]; then
        read -p "请输入你的名字: " name
        read -p "请输入你的邮箱: " email
        git config --global user.name "$name"
        git config --global user.email "$email"
        echo "✅ 配置完成！"
    else
        echo "请先配置 Git 用户信息后再运行此脚本"
        exit 1
    fi
fi

# 初始化 Git（如果还没初始化）
if [ ! -d .git ]; then
    echo "📦 初始化 Git 仓库..."
    git init
fi

# 添加所有文件
echo "📝 添加文件到 Git..."
git add .

# 提交
echo "💾 创建提交..."
git commit -m "Initial commit: 洋葱学园 UED AI 技能考核系统"

echo ""
echo "✅ 本地 Git 仓库已准备好！"
echo ""
echo "📋 接下来需要："
echo "1. 在 GitHub 上创建新仓库：https://github.com/new"
echo "2. 创建仓库后，复制仓库的 URL（例如：https://github.com/用户名/仓库名.git）"
echo "3. 运行以下命令连接并上传："
echo ""
echo "   git remote add origin https://github.com/你的用户名/你的仓库名.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
