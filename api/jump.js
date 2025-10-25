// 高性能跳转API处理
// 这个文件用于处理跳转请求，可以部署到任何支持JavaScript的服务器

const handleJumpRequest = async (request) => {
  try {
    const body = await request.json()
    const { timestamp, userAgent, referrer, jumpCount } = body
    
    // 记录跳转数据
    console.log('跳转请求:', {
      timestamp: new Date(timestamp).toISOString(),
      userAgent,
      referrer,
      jumpCount,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })
    
    // 返回成功响应
    return new Response(JSON.stringify({
      success: true,
      message: '跳转请求已记录',
      timestamp: Date.now()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
      }
    })
    
  } catch (error) {
    console.error('跳转请求处理失败:', error)
    
    return new Response(JSON.stringify({
      success: false,
      message: '请求处理失败',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// 处理OPTIONS预检请求
const handleOptionsRequest = () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    }
  })
}

// 主处理函数
export default {
  async fetch(request) {
    const { method, url } = request
    
    // 处理CORS预检请求
    if (method === 'OPTIONS') {
      return handleOptionsRequest()
    }
    
    // 处理跳转请求
    if (method === 'POST' && url.endsWith('/api/jump')) {
      return handleJumpRequest(request)
    }
    
    // 404处理
    return new Response('Not Found', { status: 404 })
  }
}
