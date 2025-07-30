import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL!);

export async function GET() {
  const startTime = Date.now();

  try {
    // Database health check
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;

    // Redis health check
    const redisStart = Date.now();
    await redis.ping();
    const redisLatency = Date.now() - redisStart;

    // Check disk space
    const diskSpace = await checkDiskSpace();

    // Check memory usage
    const memoryUsage = process.memoryUsage();

    // Check scraper status
    const scrapingStatus = await checkScrapingStatus();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: { status: 'up', latency: dbLatency },
        redis: { status: 'up', latency: redisLatency },
        scraping: scrapingStatus
      },
      system: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
        },
        diskSpace
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

async function checkDiskSpace() {
  // Implementation for checking disk space
  return { free: 0, total: 0 };
}

async function checkScrapingStatus() {
  // Check if scrapers are running and last successful run
  return { status: 'idle' };
}
