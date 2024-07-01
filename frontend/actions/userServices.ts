const API_URL = "http://localhost:8000/api";

export interface LoginResponse {
  access: string;
  refresh: string;
}
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

export interface Topic {
  id: number;
  title: string;
  title_ms?: string; //can be null
  agency: {
    id: number;
    name: string;
    acronym: string;
  };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to log in');
  }

  const data: LoginResponse = await response.json();
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

export async function getUserAgencyQuestions( // this function is strictly use for logged in admin
  page: number = 1,
  pageSize: number = 10
): Promise<{ questions: Question[]; total: number }> {
  try {
    const token = getAccessToken();
    const response = await fetch(`${API_URL}/questions/user-agency/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();
    console.log(data)
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
  const token = getAccessToken();
  const response = await fetch(`${API_URL}/questions/${questionId}/submit-answer/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit answer');
  }
}

export async function listUserAgencyTopics(): Promise<Topic[]> {
  const token = getAccessToken();
  const response = await fetch(`${API_URL}/topics/user-agency/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }

  const data = await response.json();
  return data;
}

export async function addUserAgencyTopic(title: string, title_ms: string): Promise<Topic> {  // Include the new parameter
  const token = getAccessToken();
  const response = await fetch(`${API_URL}/topics/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, title_ms }),
  });

  if (!response.ok) {
    throw new Error('Failed to add topic');
  }

  const data = await response.json();
  return data;
}