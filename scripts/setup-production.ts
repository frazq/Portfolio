import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupProduction() {
  console.log('🚀 Setting up production database...');

  // Create indexes for performance
  await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_city ON properties(city);`;
  await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_price ON properties(price);`;
  await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_score ON properties(investment_score);`;
  await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_source ON properties(source);`;
  await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_active ON properties(is_active);`;
  await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_created ON properties(first_seen_at);`;

  // Geographic indexes
  await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_location ON properties USING GIST(ST_Point(longitude, latitude));`;

  // Create admin user
  await createAdminUser();

  // Seed initial data
  await seedCities();

  console.log('✅ Production setup completed!');
}

async function createAdminUser() {
  // Implementation for creating admin user
  console.log('Creating admin user...');
}

async function seedCities() {
  const polishCities = [
    { name: 'Warszawa', population: 1790658 },
    { name: 'Kraków', population: 779115 },
    { name: 'Łódź', population: 679941 },
    { name: 'Wrocław', population: 643782 },
    { name: 'Poznań', population: 534813 },
    // Add more cities
  ];

  for (const city of polishCities) {
    // @ts-ignore
    await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: city
    });
  }
}

setupProduction().catch(console.error).finally(() => prisma.$disconnect());
