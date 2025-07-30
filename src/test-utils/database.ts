import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

export async function setupTestDatabase() {
  // Run migrations
  const { execSync } = require('child_process');
  execSync('npx prisma migrate reset --force --skip-seed', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  });
}

export async function cleanupTestDatabase() {
  await prisma.property.deleteMany();
  await prisma.propertyAlert.deleteMany();
  // @ts-ignore
  await prisma.user.deleteMany();
}

export async function createTestProperty(overrides = {}) {
  return prisma.property.create({
    data: {
      url: 'https://test.com/property/1',
      title: 'Test Property',
      price: 500000,
      area: 60,
      rooms: 3,
      address: 'ul. Testowa 1, Warszawa',
      city: 'Warszawa',
      source: 'OTODOM',
      investmentScore: 75,
      ...overrides,
    },
  });
}

export async function createTestUser(overrides = {}) {
    // @ts-ignore
  return prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      ...overrides,
    },
  });
}
