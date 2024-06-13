'use server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//using db for this is only temporary to build components and pages as direct request everytime a page reload is very slow

const AGENCY = {
    "finance-ministry": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
    "education-ministry": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
    "transport-ministry": "d13c5167-f77d-43d6-8efc-35f2985316a3"
};

const API_KEY = 'plane_api_1cbdb318805f491b842a89c4a078ea9f';

interface Question {
  id: string;
  agency: string;
  description_html: string;
  name: string;
  labels: string[];
}


export async function fetchQuestions(): Promise<void> {
  for (const [agencyName, projectId] of Object.entries(AGENCY)) {
      const url = `https://api.plane.so/api/v1/workspaces/govtech/projects/${projectId}/issues/`;
      
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'X-API-Key': API_KEY,
          },
      });

      if (response.ok) {
          const data = await response.json();
          const questions: Question[] = data.results;

          for (const question of questions) {
              const existingQuestion = await prisma.question.findUnique({
                  where: { id: question.id },
              });
//using db for this is only temporary to build components and pages as direct request everytime a page reload is very slow
              if (!existingQuestion) {
                  await prisma.question.create({
                      data: {
                          id: question.id,
                          agency: agencyName,
                          name: question.name,
                          description_html: question.description_html,
                          labels: question.labels,
                      },
                  });
              }
          }
      } else {
          console.error(`Failed to fetch questions for agency: ${agencyName}`);
      }
  }
}

export async function getAllQuestions(page: number = 1, pageSize: number = 10): Promise<{ questions: Question[], total: number }> {
  const questions = await prisma.question.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
  });
  const total = await prisma.question.count();
  return { questions, total };
}

fetchQuestions()