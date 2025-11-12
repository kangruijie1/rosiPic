// 图片代理 - 处理图片资源请求
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).send('缺少图片 URL');
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(response.status).send('图片加载失败');
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存 24 小时
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('图片代理错误:', error);
    res.status(500).send('图片加载失败');
  }
}
