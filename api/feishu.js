// Vercel Serverless Function - 飞书API代理
// 此文件作为备选方案，如果 api/feishu/index.js 不工作，Vercel 会使用此文件
module.exports = async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, ...params } = req.body;

  try {
    const FEISHU_CONFIG = {
      appId: 'cli_a9f9f58238381bde',
      appSecret: '4d9U9oZgDtoL7PgSHZltgdx13NP8WDVE',
      appToken: 'EDjSb0Tl2ap5aTsbuXgcPpS9nTb'
    };

    if (action === 'getToken') {
      // 获取access_token
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
      return res.status(200).json(data);
    }

    if (action === 'getTables') {
      // 获取表格列表
      const { accessToken } = params;
      const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === 'saveRecord') {
      // 保存记录
      const { accessToken, tableId, recordData } = params;
      const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordData)
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Feishu API proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
