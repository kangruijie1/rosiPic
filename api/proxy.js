// API 代理 - 处理 JSON 接口请求
export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, User-Agent');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const targetUrl = req.query.url || req.body?.url;

    if (!targetUrl) {
      return res.status(400).json({ error: '缺少 URL 参数' });
    }

    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
        'User-Agent': 'okhttp/4.9.1'
      }
    };

    // 如果是 POST 请求，添加 body
    if (req.method === 'POST' && req.body?.data) {
      fetchOptions.body = req.body.data;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({ error: error.message });
  }
}
