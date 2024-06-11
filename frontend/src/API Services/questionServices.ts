'use server'
import { db } from "@/db/prismaService";
const schedule = require('node-schedule');
import { redirect } from "next/navigation";

interface Agency {
  id: number;
  name: string;
  slug: string;
  projectId: string;
  apiKey: string;
}

interface Question {
  id: string;
  agency: string;
  description: string;
  name: string;
}

export async function submitQuestion(agencyName: string, title: string) {
  const agency: Agency | null = await db.agency.findUnique({
    where: { name: agencyName },
  });

  if (!agency) {
    throw new Error(`Agency ${agencyName} not found`);
  }

  // post the question to the backend first without description
  const postUrl = `https://api.plane.so/api/v1/workspaces/${agency.slug}/projects/${agency.projectId}/issues/`;
  const postResponse = await fetch(postUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': agency.apiKey,
    },
    body: JSON.stringify({ name: title }),
  });

  if (!postResponse.ok) {
    throw new Error(`Failed to post question: ${postResponse.statusText}`);
  }

  const postData = await postResponse.json();
  const questionId = postData.id;

    const question = await db.question.create({  // save the question to the database exclude the description
      data: {
        id: questionId,
        agency: agency.name,
        title: postData.name,
        description: ""
      },
    });

  redirect(`/QuestionDetailPage?id=${question.id}`);
}


export async function fetchQuestions() {
  const agencies: Agency[] = await db.agency.findMany();

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
    const questions: Question[] = data.results;

    if (questions.length > 0) {
      for (const question of questions) {
        const existingQuestion = await db.question.findUnique({ // check if the question already exists in the database
          where: { id: question.id },
        });

        if (!existingQuestion) {
          await db.question.create({
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
  await fetchQuestionDescription();
}

 async function fetchQuestionDescription() { // function to fetch all the question descriptions
  const questions: Question[] = await db.question.findMany();

  for (const question of questions) {
    if (question.description !== "") {  // skip updating if the description already exists
      continue;
    }

    const agency: Agency | null = await db.agency.findUnique({   // find the related agency based on question.agency
      where: { name: question.agency },
    });

    if (!agency) {
      console.error(`Agency ${question.agency} not found for question ${question.id}`);
      continue;
    }

    // make API call to fetch the description
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

    await db.question.update({  // update the question description in the database
      where: { id: question.id },
      data: { description: commentHtml },
    });
  }
}

export async function getQuestionById(id: string) {
  const question = await db.question.findUnique({
    where: {
      id: id
    }
  });

  if (!question) {
    throw new Error(`Question with id ${id} not found`);
  }

  if (!question.description) {
    const agency: Agency | null = await db.agency.findUnique({
      where: { name: question.agency },
    });

    if (!agency) {
      throw new Error(`Agency ${question.agency} not found`);
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
      throw new Error(`Failed to fetch description for question ${question.id}`);
    }

    const commentData = await response.json();
    const commentHtml = commentData.results[0]?.comment_html || '';

    await db.question.update({
      where: { id: question.id },
      data: { description: commentHtml },
    });

    question.description = commentHtml; // Update the question object with the new description
  }

  return question;
}

export async function getRandomQuestionsFromDB() {
  const questions = await db.question.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10, // fetch last 10 questions
  });
  return questions;
}

export async function scheduleDailyFetch() {
  schedule.scheduleJob('0 0 * * *', async function() { // schedule job to run at 12:00 AM every day
    console.log('Running fetchRandomQuestions job at midnight');
    await fetchQuestions();
    console.log('Successfully fetched and saved random questions');
  });
}

scheduleDailyFetch();
