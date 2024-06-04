const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  const questions = Array.from({ length: 50 }, () => ({
    title: faker.lorem.words(10),
    description: faker.lorem.words(50),
    createdAt: new Date(),
  }));

  for (const question of questions) {
    await prisma.question.create({ data: question });
  }

  console.log('Seeded 50 questions');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
