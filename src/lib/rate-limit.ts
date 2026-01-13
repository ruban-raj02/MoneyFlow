import { supabase } from "@/integrations/supabase/client";

interface RateLimitResponse {
  success: boolean;
  rateLimit: {
    remaining: number;
    limit: number;
    resetTime: number;
  };
  authenticated: boolean;
  body?: any;
}

interface RateLimitError {
  error: string;
  message: string;
  retryAfter: number;
}

/**
 * Check rate limit before making an API call
 * Returns rate limit info or throws if rate limited
 */
export async function checkRateLimit(): Promise<RateLimitResponse> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rate-limit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        ...(sessionData.session?.access_token && {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        }),
      },
    }
  );

  if (response.status === 429) {
    const error: RateLimitError = await response.json();
    throw new Error(`Rate limited. Retry after ${error.retryAfter} seconds.`);
  }

  if (!response.ok) {
    throw new Error('Failed to check rate limit');
  }

  return response.json();
}

/**
 * Wrapper to make rate-limited API calls
 */
export async function rateLimitedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // First check rate limit
  await checkRateLimit();

  // Then make the actual request
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  return response.json();
}