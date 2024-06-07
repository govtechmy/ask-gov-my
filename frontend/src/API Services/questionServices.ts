import { db } from "@/db/prismaService";
const schedule = require('node-schedule');

 interface Agency {
  id: number;
  name: string;
  slug: string;
  projectId: string;
  apiKey: string;
}

 interface Question {
  id: string;
  name: string;
  description_html: string;
}


export async function fetchRandomQuestions() {
  const agencies: Agency[] = await db.agency.findMany();

  for (const agency of agencies) {
    const url = `https://api.plane.so/api/v1/workspaces/${agency.slug}/projects/${agency.projectId}/issues/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': agency.apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch questions for ${agency.name}: ${response.statusText}`);
      continue;
    }

    const data = await response.json();

    const questions: Question[] = data.results;

    if (questions.length > 0) {
      for (const question of questions) {
        await db.question.create({
          data: {
            agency: agency.name,
            title: question.name,
            description: question.description_html,
          },
        });
      }
    }
  }
}

export async function scheduleDailyFetch() {
    schedule.scheduleJob('0 0 * * *', async function() {    // schedule job to run at 12:00 AM every day
      console.log('Running fetchRandomQuestions job at midnight');
      await fetchRandomQuestions();
      console.log('Successfully fetched and saved random questions');
    });
  }
  
scheduleDailyFetch()

