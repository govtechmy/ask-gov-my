'use server'
import { NextApiRequest, NextApiResponse } from "next";
// this file will act as a middlepart for the components and API / mockup db in next

// todo list: 
// 1) install prisma db in next.js for mockup db
// 2) create basic db schema
// model Question {
//   id  Int @id @default(autoincrement())
//   name String
//   comment String
// }
// 3) create function to create a new question
// 4) create function to show all question from db


// todo list for API integration
// create function to get all questions list for home page( maybe max 10 question per page)
// create function to ask a question

import { db } from "@/db/prismaService";

export async function fetchQuestions() {
    return await db.question.findMany();
  }
  
export async function submitQuestion(title: string, description: string) {
  return await db.question.create({
    data: { title, description },
  });
}

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const slug = process.env.NEXT_PUBLIC_SLUG;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const headers = {
  'X-API-Key': apiKey,
}

// export async function fetchQuestions() {
//   const url = `https://api.plane.so/api/v1/workspaces/${slug}/projects/${projectId}/issues/`;
//   const response = await fetch(url, { headers });

//   if (!response.ok) {
//     throw new Error(`Error: ${response.statusText}`);
//   }

//   const data = await response.json();
//   return data;
// }

// export async function submitQuestion(title: string, description: string) {
//   const slug = process.env.NEXT_PUBLIC_SLUG;
//   const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
//   const url = `https://api.plane.so/api/v1/workspaces/${slug}/projects/${projectId}/issues/`;
  
//   const body = JSON.stringify({
//     title,
//     description,
//   });
  
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body,
//   });

//   if (!response.ok) {
//     throw new Error(`${response.statusText}`);
//   }
//   const data = await response.json();
  
//   return data
// }
