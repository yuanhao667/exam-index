# 洋葱学园 UED AI 技能考核系统 - 常用命令

.PHONY: install dev deploy submit push feishu-fields help

# 默认：显示帮助
help:
	@echo "用法: make [目标]"
	@echo ""
	@echo "  安装与开发"
	@echo "    make install      - 安装依赖 (npm install)"
	@echo "    make dev          - 本地开发 (vercel dev)"
	@echo ""
	@echo "  提交流程"
	@echo "    make submit       - 添加、提交并推送 (git add . && commit && push)"
	@echo "    make submit MSG=\"说明\" - 使用自定义提交说明"
	@echo "    make push         - 仅推送到远程"
	@echo ""
	@echo "  部署与飞书"
	@echo "    make deploy       - 部署到 Vercel (vercel --prod)"
	@echo "    make feishu-fields - 拉取飞书多维表格字段 ID，用于配置 FEISHU_FIELD_*"
	@echo ""

# 安装依赖
install:
	npm install

# 本地开发（需先 npm i -g vercel）
dev:
	vercel dev

# 提交流程：暂存 -> 提交 -> 推送（提交说明可通过 MSG= 传入）
MSG ?= update
submit:
	git add .
	git status
	@echo "--- 即将提交并推送，说明: $(MSG) ---"
	git commit -m "$(MSG)" || true
	git push

# 仅推送（不自动 add/commit）
push:
	git push

# 部署到 Vercel 生产环境
deploy:
	vercel --prod

# 拉取飞书表格字段 ID（需本地已起 vercel dev 或填写 --base）
feishu-fields:
	python3 scripts/feishu_get_field_ids.py
	@echo "若 API 在远程，请执行: python3 scripts/feishu_get_field_ids.py --base https://你的域名"
