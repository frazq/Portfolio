import { Redis } from 'ioredis';

class CacheManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Cache strategies for different data types
  async cachePropertyList(filters: any, data: any): Promise<void> {
    const key = `properties:${this.hashFilters(filters)}`;
    await this.set(key, data, 300); // 5 minutes cache
  }

  async cacheMarketAnalysis(city: string, data: any): Promise<void> {
    const key = `market:${city}`;
    await this.set(key, data, 3600); // 1 hour cache
  }

  private hashFilters(filters: any): string {
    return Buffer.from(JSON.stringify(filters)).toString('base64');
  }
}
