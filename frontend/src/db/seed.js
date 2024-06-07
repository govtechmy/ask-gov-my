const { PrismaClient } = require('@prisma/client');
// const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

// async function main() {
//   const questions = Array.from({ length: 50 }, () => ({
//     title: faker.lorem.words(10),
//     description: faker.lorem.words(50),
//     createdAt: new Date(),
//   }));

//   for (const question of questions) {
//     await prisma.question.create({ data: question });
//   }

//   console.log('Seeded 50 questions');
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function main() {
  const agencies = [
    {
      name: 'Health Ministry',
      slug: 'health-ministry',
      projectId: '5f5c3f83-ee19-496b-9d9c-5db0ef363034',
      apiKey: 'plane_api_e7576b7abdb2435eb4b4d0459ed48084',
    },
    {
      name: 'Education Ministry',
      slug: 'education-ministry',
      projectId: '0072e97c-76e3-4e99-84d5-6e463b36c823',
      apiKey: 'plane_api_5130f8b5c18c44e1b1c778df87e50bd6',
    },
    {
      name: 'Finance Ministry',
      slug: 'finance-ministry',
      projectId: 'b8696b7c-cde2-4cf1-a490-bfa23b8734fc',
      apiKey: 'plane_api_c983e83b3d264d198920af2285faa0e1',
    },
  ];

  for (const agency of agencies) {
    await prisma.agency.create({ data: agency });
  }

  console.log('Seeded agencies');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });