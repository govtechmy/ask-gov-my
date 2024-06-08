'use server'
import { db } from "@/db/prismaService";

// export async function fetchQuestions() {
//     return await db.question.findMany();
//   }
  
// export async function submitQuestion(title: string, description: string) {
//   return await db.question.create({
//     data: { title, description },
//   });
// }

interface Agency {
  id: number;
  name: string;
  slug: string;
  projectId: string;
  apiKey: string;
}

export async function fetchAgencyQuestions(agencyName: string) {
  const agency: Agency | null = await db.agency.findUnique({
    where: { name: agencyName },
  });

  if (agency === null) {
    throw new Error(`Agency ${agencyName} not found`);
  }

  const questions = await db.question.findMany({
    where: { agency: agencyName },
  });

  if (questions.length > 0) {
    return questions;
  } else {
    return null
  }
}

export async function getAgencies() {
  const agencies = await db.agency.findMany();
  return agencies;
}


