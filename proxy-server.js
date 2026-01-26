// 简单的本地代理服务器 - 用于绕过 CORS 限制
// 使用方法：node proxy-server.js
// 然后在浏览器中访问 http://localhost:3000/index.html

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 代理飞书 API 请求
  if (req.url.startsWith('/api/feishu')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { action, accessToken, tableId, recordData } = JSON.parse(body || '{}');
        
        const FEISHU_CONFIG = {
          appId: 'cli_a9f9f58238381bde',
          appSecret: '4d9U9oZgDtoL7PgSHZltgdx13NP8WDVE',
          appToken: 'EDjSb0Tl2ap5aTsbuXgcPpS9nTb'
        };

        if (action === 'getToken') {
          console.log('🔑 获取 access_token...');
          const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              app_id: FEISHU_CONFIG.appId,
              app_secret: FEISHU_CONFIG.appSecret
            })
          });
          const data = await response.json();
          console.log('📡 飞书token响应:', data.code === 0 ? '成功' : data.msg);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
          return;
        }

        if (action === 'getTables') {
          console.log('📊 获取表格列表...');
          const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          console.log('📡 表格列表响应:', data.code === 0 ? `找到 ${data.data?.items?.length || 0} 个表格` : data.msg);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
          return;
        }

        if (action === 'saveRecord') {
          console.log('💾 保存记录到飞书...');
          console.log('📋 表格ID:', tableId);
          console.log('📝 记录数据:', JSON.stringify(recordData, null, 2));
          
          const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordData)
          });
          
          const data = await response.json();
          console.log('📡 飞书API响应:', JSON.stringify(data, null, 2));
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
          return;
        }

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid action' }));
      } catch (error) {
        console.error('代理错误:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // 提供静态文件服务
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ 本地代理服务器已启动！`);
  console.log(`📝 访问地址: http://localhost:${PORT}`);
  console.log(`\n💡 提示：`);
  console.log(`   - 在浏览器中打开 http://localhost:${PORT}`);
  console.log(`   - 完成答题后，数据会自动保存到飞书表格`);
  console.log(`   - 按 Ctrl+C 停止服务器\n`);
});
