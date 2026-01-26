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

  const { action, ...params } = req.body;

  try {
    // 从环境变量读取飞书配置
    const FEISHU_CONFIG = {
      appId: process.env.FEISHU_APP_ID,
      appSecret: process.env.FEISHU_APP_SECRET,
      appToken: process.env.FEISHU_APP_TOKEN
    };

    // 验证必需的配置项
    if (!FEISHU_CONFIG.appId || !FEISHU_CONFIG.appSecret || !FEISHU_CONFIG.appToken) {
      console.error('❌ 飞书配置缺失:', {
        hasAppId: !!FEISHU_CONFIG.appId,
        hasAppSecret: !!FEISHU_CONFIG.appSecret,
        hasAppToken: !!FEISHU_CONFIG.appToken
      });
      return res.status(500).json({ 
        error: '飞书配置未设置，请在管理员页面配置环境变量',
        code: 'CONFIG_MISSING'
      });
    }

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
      // 保存记录
      const { accessToken, tableId, recordData } = params;
      console.log('💾 保存记录 - 表格ID:', tableId);
      console.log('💾 保存记录 - 字段名:', Object.keys(recordData.fields || {}));
      console.log('💾 保存记录 - 完整数据:', JSON.stringify(recordData, null, 2));
      
      const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${tableId}/records`, {
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
        if (data.msg && data.msg.includes('FieldNameNotFound')) {
          console.error('❌ 字段名不匹配！当前字段名:', Object.keys(recordData.fields || {}));
        }
      }
      
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Feishu API proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
