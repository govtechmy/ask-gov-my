"use server";
import { fetchAndIndexQuestions } from "./searchServices";
const API_URL = "http://localhost:8000/api";

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: {
    id: number;
    name: string;
    acronym_en: string | null;
  };
  answer: string;
  topics: Array<{
    id: number;
    title: string;
  }>;
  email: string;
}

export async function getAllQuestions(
  page: number = 1,
  pageSize: number = 10
): Promise<{ questions: Question[]; total: number }> {
  fetchAndIndexQuestions()
  try {
    const response = await fetch(`${API_URL}/questions/`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedQuestions = data.slice(start, end);

    return { questions: paginatedQuestions, total: data.length };
  } catch (error) {
    console.error("Error in getAllQuestions:", error);
    return { questions: [], total: 0 };
  }
}

export async function getQuestionsByAgency(
  agencyId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{ questions: Question[]; total: number }> {
  const response = await fetch(`${API_URL}/questions-by-agency/${agencyId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const data = await response.json();
  const Questions: Question[] = data;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedQuestions = Questions.slice(start, end);

  return { questions: paginatedQuestions, total: data.count };
}

export async function getQuestionById(questionId: string): Promise<Question | null> {
  const response = await fetch(`${API_URL}/questions/${questionId}/`);
  if (response.ok) {
    return response.json();
  }
  return null;
}

export async function submitQuestion(agencyId: string, data:Question): Promise<void> {
  const url = `${API_URL}/submit-question/${agencyId}/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit question');
  }
}

export async function getAgencyList(): Promise<{ id: string; name: string }[]> {
  const response = await fetch(`${API_URL}/agencies/`);
  return response.json();
}
