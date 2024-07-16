'use server';
import { uploadFile } from "./fileServices";

const API_URL = 'http://ask.juwaini.com/api';

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: number;
  answer: string;
  topics: number[];
  email: string;
  likes: number;
  dislikes: number;
  attachment: string[];
  isopen: boolean;
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
// get questions by the user agency, to be used only by user.role = staff
export async function getUserAgencyQuestions(
  agencyId: number,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ questions: Question[]; total: number }> {
  try {
    const response = await fetch(
      `${API_URL}/questions/by-agency/${agencyId}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedQuestions = data.slice(start, end);
    return { questions: paginatedQuestions, total: data.length };
  } catch (error) {
    console.error('Error in getUserAgencyQuestions:', error);
    return { questions: [], total: 0 };
  }
}

// get all questions for user.role = super_admin
export async function getAllUserQuestions(
  page: number = 1,
  pageSize: number = 1000,
): Promise<{ questions: Question[]; total: number }> {
  try {
    const response = await fetch(`${API_URL}/questions/all/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user questions');
    }

    const data = await response.json();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedQuestions = data.slice(start, end);
    return { questions: paginatedQuestions, total: data.length };
  } catch (error) {
    console.error('Error in getAllUserQuestions:', error);
    return { questions: [], total: 0 };
  }
}

export async function submitAnswer(
  questionId: number,
  answer: string,
  attachments: File[],
): Promise<void> {
  try {
    const attachmentUrls = await Promise.all(
      attachments.map(async (file) => {
        try {
          return await uploadFile(file);
        } catch (uploadError) {
          console.error(`Failed to upload file: ${file.name}`, uploadError);
          throw uploadError;
        }
      })
    );

    const data = {
      answer,
      attachment: attachmentUrls,
    };

    const response = await fetch(
      `${API_URL}/questions/${questionId}/submit-answer/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to submit answer:', errorText);
      throw new Error(`Failed to submit answer: ${errorText}`);
    }
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    throw new Error('Error submitting answer');
  }
}


export async function listUserAgencyTopics(): Promise<Topic[]> {
  const response = await fetch(`${API_URL}/topics/user-agency/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }

  const data = await response.json();
  return data;
}

export async function addUserAgencyTopic(
  title: string,
  title_ms: string,
): Promise<Topic> {
  const response = await fetch(`${API_URL}/topics/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, title_ms }),
  });

  if (!response.ok) {
    throw new Error('Failed to add topic');
  }

  const data = await response.json();
  return data;
}

export async function assignAgencyToQuestion(
  questionId: number,
  agencyId: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/questions/${questionId}/agency/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agency_id: agencyId }),
  });

  if (!response.ok) {
    throw new Error('Failed to assign agency to question');
  }
}

export async function addAgency(name: string, name_ms: string): Promise<void> {
  const response = await fetch(`${API_URL}/agencies/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, name_ms }),
  });

  if (!response.ok) {
    throw new Error('Failed to add agency');
  }
}
