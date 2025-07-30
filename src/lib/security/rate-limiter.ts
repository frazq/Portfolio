import { Redis } from 'ioredis';

class RateLimiter {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async isAllowed(
    identifier: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - window;

    // Remove expired entries
    await this.redis.zremrangebyscore(key, 0, windowStart);

    // Count current requests
    const current = await this.redis.zcard(key);

    if (current < limit) {
      // Add current request
      await this.redis.zadd(key, now, `${now}-${Math.random()}`);
      await this.redis.expire(key, Math.ceil(window / 1000));

      return {
        allowed: true,
        remaining: limit - current - 1,
        resetTime: now + window
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetTime: now + window
    };
  }
}
