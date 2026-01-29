# 飞书接口问题梳理与改进方案

## 一、当前代码结构

### 1. 前端 (index.html 约 693–778 行)

- **API 地址**：`getFeishuApiUrl()`  
  - 本地（localhost / 127.0.0.1）→ `http://localhost:3000/api/feishu`  
  - 其他 → `/api/feishu`（相对路径）
- **请求体**：`POST`，`Content-Type: application/json`，body 为 `{ fields: { fldxxx: value, ... } }`
- **成功判断**：`result.code === 0 || result.success`

### 2. 后端 (api/feishu/index.js)

- **入口**：Vercel Serverless，路径 `/api/feishu`
- **支持两种用法**：  
  1. **直接保存**：请求体带 `body.fields`（对象）→ 用环境变量取 token，调飞书 API，原样返回飞书响应 `{ code, data, msg }`  
  2. **action 模式**：`body.action` 为 `getToken` / `getTables` / `getFields` / `saveRecord`，各自处理

---

## 二、问题梳理

### 问题 1：本地开发时 API 地址写死为 3000 端口

- 当前：只要 hostname 是 localhost/127.0.0.1，就固定请求 `http://localhost:3000/api/feishu`。
- 影响：若用 `npx serve`、`python -m http.server` 等跑在 8080/5500 等端口，页面和接口不在同源，且 3000 可能根本没起服务，导致“无法连接”或跨域。
- 结论：应尽量与当前页面同源，避免写死 3000。

### 问题 2：file:// 打开时相对路径无效

- 当前：非 localhost 时用 `/api/feishu`。若用 `file://` 打开页面，相对路径会变成 `file:///api/feishu`，请求无效。
- 结论：对 file 协议应给出明确提示或回退到可配置的 API 基地址。

### 问题 3：与 api/feishu 的“协议”已对齐，但错误信息未统一

- 前端已按 api/feishu 的“直接保存”约定发送 `{ fields }`，协议一致。
- 但 api/feishu 在配置错误等情况下返回 500，body 为 `{ error, code, missing }`；前端在 `!response.ok` 时用 `response.text()` 抛错，没有解析 JSON 展示 `error`/`code`，用户难以定位问题。
- 结论：应对 4xx/5xx 的 JSON body 做解析，并优先展示后端返回的 `error`/`msg`。

### 问题 4：成功判断冗余

- 飞书接口成功时只有 `code === 0`，没有 `success` 字段；`result.success` 为兼容写法，可保留，但主要依赖 `result.code === 0` 即可。

### 问题 5：Vercel 下 req.body 可能未解析（视运行环境而定）

- 部分 Vercel/Node 环境下，POST body 可能仍是字符串，若未解析则 `body.fields` 为 undefined，会走到“Invalid request”或其它分支。
- 结论：在 api/feishu 内对 `req.body` 做一次安全解析（若为字符串则 `JSON.parse`），保证 `body.fields` 可用。

---

## 三、改进方案

### 1. 前端 (index.html)

| 项 | 方案 |
|----|------|
| API 地址 | 本地开发时优先使用**当前页面 origin** + `'/api/feishu'`，避免写死 3000；仅当明确需要代理到另一端口时再使用配置或环境变量。 |
| file:// | 若检测到 `file://` 或无效 origin，提示“请通过本地服务器（如 `vercel dev` 或 `npx serve`）访问页面”，并可选回退到 `http://localhost:3000/api/feishu`。 |
| 错误处理 | 对 `!response.ok` 的响应先 `response.json().catch(() => ({}))`，若存在 `error`/`msg`/`code` 则优先展示，否则再回退到 status + text。 |
| 成功判断 | 保持 `result.code === 0 || result.success` 即可。 |

### 2. 后端 (api/feishu/index.js)

| 项 | 方案 |
|----|------|
| body 解析 | 若 `req.body` 为字符串，则先 `JSON.parse(req.body)` 再使用，保证 `body.fields` 和 `body.action` 存在。 |
| 响应格式 | 保持直接返回飞书 API 的 `{ code, data, msg }`，与前端约定一致；错误时继续返回 4xx/5xx + JSON body。 |

### 3. 本地开发与部署

- **推荐本地**：在项目根目录执行 `vercel dev`，浏览器访问其给出的地址（如 `http://localhost:3000`），这样前端与 `/api/feishu` 同源，无需写死端口。
- **部署**：Vercel 上 `vercel.json` 的 rewrites 已保证 `/api/*` 不重写到 index.html，`/api/feishu` 会正确走到 `api/feishu/index.js`。

---

## 四、小结

- 当前“飞书接口错误”的主要原因更可能是：**本地 API 地址/端口不一致** 或 **未在本地起带 `/api/feishu` 的服务**，而不是前端没有使用 api/feishu 的协议（前端已按 `{ fields }` 直接保存模式调用）。
- 通过**统一使用当前 origin 的 `/api/feishu`**、**完善错误解析与提示**、以及 **api/feishu 内对 body 做安全解析**，可以更好对齐 api/feishu 的逻辑并提升可排查性。
