// Vercel Serverless Function - 飞书API代理
// 标准格式：module.exports 导出 handler 函数
module.exports = async (req, res) => {
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

  // 兼容 body 未解析的情况（部分环境 POST body 可能为字符串）
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { action, ...params } = body;

  try {
    // 从 Vercel 环境变量读取飞书配置
    // 这些环境变量需要在 Vercel 项目设置中配置：
    // - FEISHU_APP_ID
    // - FEISHU_APP_SECRET
    // - FEISHU_APP_TOKEN
    const FEISHU_CONFIG = {
      appId: process.env.FEISHU_APP_ID,
      appSecret: process.env.FEISHU_APP_SECRET,
      appToken: process.env.FEISHU_APP_TOKEN || 'EDjSb0Tl2ap5aTsbuXgcPpS9nTb' // 默认值
    };

    // 固定的表格 ID
    const TABLE_ID = 'tbl4BqBwE4MeNIL4';

    // 验证必需的配置项
    if (!FEISHU_CONFIG.appId || !FEISHU_CONFIG.appSecret || !FEISHU_CONFIG.appToken) {
      console.error('❌ 飞书配置缺失 - 请检查 Vercel 环境变量设置:', {
        hasAppId: !!FEISHU_CONFIG.appId,
        hasAppSecret: !!FEISHU_CONFIG.appSecret,
        hasAppToken: !!FEISHU_CONFIG.appToken,
        envKeys: Object.keys(process.env).filter(key => key.startsWith('FEISHU_'))
      });
      return res.status(500).json({ 
        error: '飞书配置未设置，请在 Vercel 项目设置中配置环境变量',
        code: 'CONFIG_MISSING',
        missing: {
          FEISHU_APP_ID: !FEISHU_CONFIG.appId,
          FEISHU_APP_SECRET: !FEISHU_CONFIG.appSecret,
          FEISHU_APP_TOKEN: !FEISHU_CONFIG.appToken
        }
      });
    }

    // 辅助函数：获取 access_token
    const getAccessToken = async () => {
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
      if (data.code !== 0) {
        throw new Error(data.msg || '获取 access_token 失败');
      }
      return data.tenant_access_token;
    };

    // 如果请求体直接包含 fields，当作直接保存请求处理
    if (body.fields && typeof body.fields === 'object') {
      console.log('💾 直接保存记录 - 字段名:', Object.keys(body.fields));
      console.log('💾 直接保存记录 - 完整数据:', JSON.stringify(body, null, 2));
      
      // 获取 access_token
      const accessToken = await getAccessToken();
      
      // 构建 recordData
      const recordData = {
        fields: body.fields
      };
      
      // 调用飞书 API 保存
      const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${TABLE_ID}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordData)
      });

      const data = await response.json();
      console.log('📦 飞书API响应状态:', response.status);
      console.log('📦 飞书API响应数据:', JSON.stringify(data, null, 2));
      
      if (data.code !== 0) {
        console.error('❌ 飞书API错误:', data.msg || data.error || '未知错误');
      }
      
      return res.status(200).json(data);
    }

    // 兼容旧的 action 模式（保留以支持其他可能的调用）
    if (action === 'getToken') {
      const accessToken = await getAccessToken();
      return res.status(200).json({ code: 0, tenant_access_token: accessToken });
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

    if (action === 'getFields') {
      // 获取表格字段定义
      const { accessToken, tableId } = params;
      console.log('📋 获取表格字段定义 - 表格ID:', tableId);
      const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/fields`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.code === 0 && data.data && data.data.items) {
        console.log('📋 表格字段列表:');
        data.data.items.forEach(field => {
          console.log(`  - ${field.field_name} (${field.field_id}, 类型: ${field.type})`);
        });
      }
      return res.status(200).json(data);
    }

    if (action === 'saveRecord') {
      // 兼容旧的 saveRecord action 模式
      const { accessToken, tableId, recordData } = params;
      const targetTableId = tableId || TABLE_ID;
      const targetAccessToken = accessToken || await getAccessToken();
      
      console.log('💾 保存记录 (action模式) - 表格ID:', targetTableId);
      console.log('💾 保存记录 - 字段名:', Object.keys(recordData.fields || {}));
      console.log('💾 保存记录 - 完整数据:', JSON.stringify(recordData, null, 2));
      
      const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${targetTableId}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${targetAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordData)
      });

      const data = await response.json();
      console.log('📦 飞书API响应状态:', response.status);
      console.log('📦 飞书API响应数据:', JSON.stringify(data, null, 2));
      
      if (data.code !== 0) {
        console.error('❌ 飞书API错误:', data.msg || data.error || '未知错误');
        if (data.msg && data.msg.includes('FieldNameNotFound')) {
          console.error('❌ 字段名不匹配！当前字段名:', Object.keys(recordData.fields || {}));
        }
      }
      
      return res.status(200).json(data);
    }

    // 如果没有匹配的 action，且也没有 fields，返回错误
    return res.status(400).json({ error: 'Invalid request. Expected { fields: {...} } or valid action.' });
  } catch (error) {
    console.error('Feishu API proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
