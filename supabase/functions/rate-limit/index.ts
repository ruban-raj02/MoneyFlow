import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limit configuration
const RATE_LIMITS = {
  // Anonymous/IP-based limits
  anonymous: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  },
  // Authenticated user limits (more generous)
  authenticated: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
}

// In-memory store for rate limiting (resets on function cold start)
// For production, use Redis or a database table
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string, userId?: string): string {
  return userId ? `user:${userId}` : `ip:${ip}`
}

function checkRateLimit(key: string, isAuthenticated: boolean): { allowed: boolean; remaining: number; resetTime: number } {
  const limits = isAuthenticated ? RATE_LIMITS.authenticated : RATE_LIMITS.anonymous
  const now = Date.now()
  
  let entry = rateLimitStore.get(key)
  
  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(key)
    entry = undefined
  }
  
  if (!entry) {
    entry = {
      count: 1,
      resetTime: now + limits.windowMs,
    }
    rateLimitStore.set(key, entry)
    return { allowed: true, remaining: limits.maxRequests - 1, resetTime: entry.resetTime }
  }
  
  entry.count++
  
  if (entry.count > limits.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }
  
  return { allowed: true, remaining: limits.maxRequests - entry.count, resetTime: entry.resetTime }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get client IP from headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               'unknown'

    // Check for authenticated user
    const authHeader = req.headers.get('Authorization')
    let userId: string | undefined
    
    if (authHeader?.startsWith('Bearer ')) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      )
      
      const token = authHeader.replace('Bearer ', '')
      const { data, error } = await supabase.auth.getClaims(token)
      
      if (!error && data?.claims) {
        userId = data.claims.sub as string
      }
    }

    const isAuthenticated = !!userId
    const rateLimitKey = getRateLimitKey(ip, userId)
    const { allowed, remaining, resetTime } = checkRateLimit(rateLimitKey, isAuthenticated)

    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': String(isAuthenticated ? RATE_LIMITS.authenticated.maxRequests : RATE_LIMITS.anonymous.maxRequests),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
    }

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
          },
        }
      )
    }

    // Parse request body if present
    let body = null
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      try {
        body = await req.json()
      } catch {
        // No body or invalid JSON - that's okay
      }
    }

    // Return success response with rate limit info
    return new Response(
      JSON.stringify({
        success: true,
        rateLimit: {
          remaining,
          limit: isAuthenticated ? RATE_LIMITS.authenticated.maxRequests : RATE_LIMITS.anonymous.maxRequests,
          resetTime: Math.ceil(resetTime / 1000),
        },
        authenticated: isAuthenticated,
        body,
      }),
      { headers }
    )
  } catch (error) {
    console.error('Rate limit error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})