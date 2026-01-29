#!/usr/bin/env python3
"""
调用 /api/feishu 的 getFieldIds，拉取当前多维表格字段 ID，并打印要设置的环境变量。
用于排查飞书 FieldNameNotFound(1254045) 时，一次性拿到所有 FEISHU_FIELD_* 的值。

用法:
  python scripts/feishu_get_field_ids.py
  python scripts/feishu_get_field_ids.py --base https://你的项目.vercel.app
"""
import argparse
import json
import sys

try:
    import urllib.request
    import urllib.error
except ImportError:
    print("需要 Python 3", file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="获取飞书多维表格字段 ID 及环境变量建议")
    parser.add_argument(
        "--base",
        default="http://localhost:3000",
        help="API 根地址，例如 https://你的项目.vercel.app 或 http://localhost:3000",
    )
    args = parser.parse_args()
    base = args.base.rstrip("/")
    url = f"{base}/api/feishu"

    body = json.dumps({"action": "getFieldIds"}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            err = json.loads(body)
            print("API 错误:", err.get("error", body), file=sys.stderr)
        except Exception:
            print("API 错误:", body, file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print("请求失败:", e.reason, file=sys.stderr)
        sys.exit(1)

    if data.get("code") != 0:
        print("接口返回异常:", data, file=sys.stderr)
        sys.exit(1)

    fields = data.get("fields", [])
    env_lines = data.get("envLines", [])

    print("表格 ID:", data.get("tableId", ""))
    print("\n字段列表 (field_name -> 列名):")
    for f in fields:
        name = f.get("name") or f.get("field_name") or ""
        env_key = f.get("envKey") or "(未匹配到逻辑名)"
        print(f"  {f.get('field_name')}  ->  {name}  ->  {env_key}")

    if env_lines:
        print("\n请在 Vercel 环境变量中设置（或写入 .env.local）：")
        for line in env_lines:
            print(line)
    else:
        print("\n未匹配到预设列名（姓名/组别/得分/用时/答题日期/点赞题号），请根据上面字段列表手动设置 FEISHU_FIELD_*。")


if __name__ == "__main__":
    main()
