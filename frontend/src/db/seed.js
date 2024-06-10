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

// async function main() {
//   const agencies = [
//     {
//       name: 'Health Ministry',
//       slug: 'health-ministry',
//       projectId: '5f5c3f83-ee19-496b-9d9c-5db0ef363034',
//       apiKey: 'plane_api_e7576b7abdb2435eb4b4d0459ed48084',
//     },
//     {
//       name: 'Education Ministry',
//       slug: 'education-ministry',
//       projectId: '0072e97c-76e3-4e99-84d5-6e463b36c823',
//       apiKey: 'plane_api_5130f8b5c18c44e1b1c778df87e50bd6',
//     },
//     {
//       name: 'Finance Ministry',
//       slug: 'finance-ministry',
//       projectId: 'b8696b7c-cde2-4cf1-a490-bfa23b8734fc',
//       apiKey: 'plane_api_c983e83b3d264d198920af2285faa0e1',
//     },
//     {
//       name: 'Transport Ministry',
//       slug: 'transport-ministry',
//       projectId: '6c882539-41c9-4e0c-9546-16bb4c3e9da2',
//       apiKey: 'plane_api_bbcab7b02fcc4f898c259ee0c1323e2f',
//     },
//     {
//       name: 'Tourism Ministry',
//       slug: 'tourism-ministry',
//       projectId: '791a3faa-c718-419d-8f76-bb76c3ac5da4',
//       apiKey: 'plane_api_95d62625d5414eb8b4a5b5316fa3bace',
//     },
//   ];

//   for (const agency of agencies) {
//     await prisma.agency.create({ data: agency });
//   }

//   console.log('Seeded agencies');
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


// const agencies = [
//   {
//     name: 'Health Ministry',
//     slug: 'health-ministry',
//     projectId: '5f5c3f83-ee19-496b-9d9c-5db0ef363034',
//     apiKey: 'plane_api_e7576b7abdb2435eb4b4d0459ed48084',
//   },
//   {
//     name: 'Education Ministry',
//     slug: 'education-ministry',
//     projectId: '0072e97c-76e3-4e99-84d5-6e463b36c823',
//     apiKey: 'plane_api_5130f8b5c18c44e1b1c778df87e50bd6',
//   },
//   {
//     name: 'Finance Ministry',
//     slug: 'finance-ministry',
//     projectId: 'b8696b7c-cde2-4cf1-a490-bfa23b8734fc',
//     apiKey: 'plane_api_c983e83b3d264d198920af2285faa0e1',
//   },
//   {
//     name: 'Transport Ministry',
//     slug: 'transport-ministry',
//     projectId: '6c882539-41c9-4e0c-9546-16bb4c3e9da2',
//     apiKey: 'plane_api_bbcab7b02fcc4f898c259ee0c1323e2f',
//   },
//   {
//     name: 'Tourism Ministry',
//     slug: 'tourism-ministry',
//     projectId: '791a3faa-c718-419d-8f76-bb76c3ac5da4',
//     apiKey: 'plane_api_95d62625d5414eb8b4a5b5316fa3bace',
//   },
// ];

// async function seedQuestions() {
//   for (const agency of agencies) {
//     for (let i = 0; i < 5; i++) {
//       const title = `Random Question ${i + 1} for ${agency.name}`;
//       const postUrl = `https://api.plane.so/api/v1/workspaces/${agency.slug}/projects/${agency.projectId}/issues/`;
//       console.log(`seeding question number ${i} for ${agency.name}`)
//       try {
//         const response = await fetch(postUrl, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-API-Key': agency.apiKey,
//           },
//           body: JSON.stringify({ name: title }),
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to post question for ${agency.name}: ${response.statusText}`);
//         }

//         const postData = await response.json();

//         await prisma.question.create({
//           data: {
//             id: postData.id,
//             agency: agency.name,
//             title: postData.name,
//             description: "", // Initialize with an empty string
//           },
//         });
//       } catch (error) {
//         console.error(error.message);
//       }
//     }
//   }

//   console.log('Seeded questions');
// }


// seedQuestions()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


async function fetchQuestions() {
  const agencies = await prisma.agency.findMany();

  for (const agency of agencies) {
    const url = `https://api.plane.so/api/v1/workspaces/${agency.slug}/projects/${agency.projectId}/issues/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': agency.apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch questions for ${agency.name}: ${response.statusText}`);
      continue;
    }

    const data = await response.json();
    const questions = data.results;

    if (questions.length > 0) {
      for (const question of questions) {
        const existingQuestion = await prisma.question.findUnique({
          where: { id: question.id },
        });

        if (!existingQuestion) {
          console.log(`Fetching question ${question.id}`)
          await prisma.question.create({
            data: {
              id: question.id,
              agency: agency.name,
              title: question.name,
              description: "", // Initialize with an empty string
            },
          });
        }
      }
    }
  }
  await fetchQuestionDescriptions();
}

async function fetchQuestionDescriptions() {
  const questions = await prisma.question.findMany();

  for (const question of questions) {
    if (question.description !== "") {
      continue;
    }

    const agency = await prisma.agency.findUnique({
      where: { name: question.agency },
    });

    if (!agency) {
      console.error(`Agency ${question.agency} not found for question ${question.id}`);
      continue;
    }

    const commentUrl = `https://api.plane.so/api/v1/workspaces/${agency.slug}/projects/${agency.projectId}/issues/${question.id}/comments`;
    const response = await fetch(commentUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': agency.apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch description for question ${question.id}: ${response.statusText}`);
      continue;
    }

    const commentData = await response.json();
    const commentHtml = commentData.results[0]?.comment_html || '';
    console.log(`Updating question ${question.id} description`)
    await prisma.question.update({
      where: { id: question.id },
      data: { description: commentHtml },
    });
  }
}

async function main() {
  try {
    await fetchQuestions();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
