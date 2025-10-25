
const handleJumpRequest = async (request) => {
  try {
    const body = await request.json()
    const { timestamp, userAgent, referrer, jumpCount } = body
    
    console.log('跳转请求:', {
      timestamp: new Date(timestamp).toISOString(),
      userAgent,
      referrer,
      jumpCount,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })
    
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

export default {
  async fetch(request) {
    const { method, url } = request
    
    if (method === 'OPTIONS') {
      return handleOptionsRequest()
    }
    
    if (method === 'POST' && url.endsWith('/api/jump')) {
      return handleJumpRequest(request)
    }
    
    return new Response('Not Found', { status: 404 })
  }
}
