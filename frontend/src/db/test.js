const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const questions = await prisma.question.findMany();
  console.log(questions);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
