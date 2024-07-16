'use server';
const API_URL = 'http://ask.juwaini.com/api';
import { AGENCY_TO_UUID } from '@/lib/agency';
import { localePrefix } from '@/lib/i18n';

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

interface Topic {
  title_ms: string;
  id: number;
  title: string;
  agency: {
    id: number;
    name: string;
    acronym: string;
  };
}

interface QuestionSubmission {
  question: string;
  email: string;
}

export interface Agency {
  id: number;
  name: string;
  name_ms?: string;
  acronym: string;
  total_likes?: number;
}

export async function getAllQuestions(
  page: number = 1,
  pageSize: number = 1000,
): Promise<{ questions: Question[]; total: number }> {
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
    console.error('Error in getAllQuestions:', error);
    return { questions: [], total: 0 };
  }
}

export async function getAllTopics(): Promise<Topic[]> {
  const response = await fetch(`${API_URL}/topics/`);

  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }

  const data = await response.json();
  return data;
}
export async function getTopicByAgency(agencyId: number): Promise<Topic[]> {
  const topics = await getAllTopics();
  const filteredTopics = topics.filter(topic => topic.agency.id === agencyId);
  return filteredTopics;
}

export async function getTopicsDetail(
  topicIds: number[],
  locale: string,
): Promise<string[]> {
  const topics = await getAllTopics();
  const topicIdToTitleMap: { [key: number]: string } = {};

  if (locale == 'en') {
    topics.forEach(topic => {
      topicIdToTitleMap[topic.id] = topic.title;
    });
  } else {
    topics.forEach(topic => {
      topicIdToTitleMap[topic.id] = topic.title_ms;
    });
  }

  //topic.title_ms for malay , no ms for en
  return topicIds.map(id => topicIdToTitleMap[id] || 'Unknown Topic');
}

export async function getQuestionsByAgency(
  agencyId: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ questions: Question[]; total: number }> {
  const response = await fetch(`${API_URL}/questions/by-agency/${agencyId}`);
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

export async function getQuestionById(
  questionId: string,
): Promise<Question | null> {
  const response = await fetch(`${API_URL}/questions/${questionId}/`);
  if (response.ok) {
    return response.json();
  }
  return null;
}

export async function submitQuestion(data: QuestionSubmission): Promise<void> {
  const url = `${API_URL}/submit-question/`;

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

  return response.json();
}

export async function getAgencyList(): Promise<{ id: string; name: string }[]> {
  return Object.entries(AGENCY_TO_UUID).map(([name, id]) => ({ id, name }));
}

export async function likeQuestion(questionId: string): Promise<void> {
  const url = `${API_URL}/questions/${questionId}/like/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to like question');
  }
}

export async function dislikeQuestion(questionId: string): Promise<void> {
  const url = `${API_URL}/questions/${questionId}/dislike/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to dislike question');
  }
}

export async function getTrendingAgencies(): Promise<Agency[]> {
  try {
    const response = await fetch(`${API_URL}/agencies/trending/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending agencies');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getTrendingAgencies:', error);
    return [];
  }
}
