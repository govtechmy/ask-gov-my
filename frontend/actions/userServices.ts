// userServices.ts
'use server';

const API_URL = "http://ask.juwaini.com/api";

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: number;
  answer: string;
  topics: number[];
  email: string;
}

export interface Topic {
  id: number;
  title: string;
  title_ms?: string; // can be null
  agency: {
    id: number;
    name: string;
    acronym: string;
  };
}

export async function getUserAgencyQuestions(page: number = 1, pageSize: number = 10): Promise<{ questions: Question[]; total: number }> {
  try {
    const response = await fetch(`${API_URL}/questions/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedQuestions = data.slice(start, end);
    return { questions: paginatedQuestions, total: data.length };
  } catch (error) {
    console.error("Error in getUserAgencyQuestions:", error);
    return { questions: [], total: 0 };
  }
}

export async function submitAnswer(questionId: number, data: Question): Promise<void> {
  const response = await fetch(`${API_URL}/questions/${questionId}/submit-answer/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit answer");
  }
}

export async function listUserAgencyTopics(): Promise<Topic[]> {
  const response = await fetch(`${API_URL}/topics/user-agency/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }

  const data = await response.json();
  return data;
}

export async function addUserAgencyTopic(title: string, title_ms: string): Promise<Topic> {
  const response = await fetch(`${API_URL}/topics/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, title_ms }),
  });

  if (!response.ok) {
    throw new Error("Failed to add topic");
  }

  const data = await response.json();
  return data;
}

export async function assignAgencyToQuestion(questionId: number, agencyId: number): Promise<void> {
  const response = await fetch(`${API_URL}/questions/${questionId}/agency/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ agency_id: agencyId }),
  });

  if (!response.ok) {
    throw new Error("Failed to assign agency to question");
  }
}

export async function addAgency(name: string, name_ms: string): Promise<void> {
  const response = await fetch(`${API_URL}/agencies/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, name_ms }),
  });

  if (!response.ok) {
    throw new Error("Failed to add agency");
  }
}
