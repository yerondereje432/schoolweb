// Lightweight in-memory rate limiter.
//
// This is intentionally simple: it tracks attempts per key (e.g. IP address)
// in a Map that lives in server memory. It resets whenever the serverless
// function cold-starts, and does NOT share state across multiple concurrent
// Vercel instances.
//
// For a school site's traffic volume this is a meaningful improvement over
// having no rate limiting at all, and stops casual/scripted abuse. If HUSSS
// traffic grows significantly, or this becomes a higher-value target, swap
// this for Vercel KV / Upstash Redis (a few lines of change — same
// interface) for a distributed limiter that works across all instances.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically clean up old entries so this Map doesn't grow forever
// during a long-lived server process.
function cleanup() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/**
 * Returns { allowed: true } if the action is within the rate limit, or
 * { allowed: false, retryAfterSeconds } if the caller should be blocked.
 *
 * @param key       Unique identifier for the actor, e.g. `login:<ip>`
 * @param limit     Max attempts allowed within the window
 * @param windowMs  Window length in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds?: number } {
  if (Math.random() < 0.01) cleanup();

  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { allowed: true };
}
