'use server';
const API_URL = process.env.API_URL;
import { Question, Agency, Topic, QuestionSubmission } from '@/types/types';

export async function getAllQuestions(
  page: number = 1,
  pageSize: number = 1000,
): Promise<{ questions: Question[]; total: number }> {
  try {
    const response = await fetch(`${API_URL}/questions/`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
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
  const response = await fetch(`${API_URL}/topics/`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });

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

  if (locale === 'en') {
    topics.forEach(topic => {
      topicIdToTitleMap[topic.id] = topic.title;
    });
  } else {
    topics.forEach(topic => {
      topicIdToTitleMap[topic.id] = topic.title_ms;
    });
  }

  return topicIds.map(id => topicIdToTitleMap[id] || 'Unknown Topic');
}

export async function getQuestionsByAgency(
  agencyId: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ questions: Question[]; total: number }> {
  const response = await fetch(`${API_URL}/questions/by-agency/${agencyId}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
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
  const response = await fetch(`${API_URL}/questions/${questionId}/`, {
    method: 'GET',
    next: { revalidate: 0 },
  });
  if (response.ok) {
    return response.json();
  }
  return null;
}

export async function submitQuestion(data: QuestionSubmission): Promise<void> {
  const url = `${API_URL}/submit-question/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      let errorMessage = `Failed to submit question. Status: ${response.status}`;

      // error message from response body
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }
      } catch (e) {
        // ignore JSON parsing errors and keep the original error message
      }

      throw new Error(errorMessage);
    }

    // return response data
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getAgencyList(): Promise<Agency[]> {
  try {
    const response = await fetch(`${API_URL}/agencies`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agency list');
    }

    const data = await response.json();
    return data.map((agency: Agency) => ({
      id: agency.id,
      name: agency.name,
      name_ms: agency.name_ms,
      acronym: agency.acronym,
      logo_url: agency.logo_url,
    }));
  } catch (error) {
    console.error('Error in getAgencyList:', error);
    return [];
  }
}

export async function getDynamicAgencyMap(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${API_URL}/agencies`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agency list');
    }

    const data: Agency[] = await response.json();
    const agencyMap: Record<string, string> = {};

    data.forEach(agency => {
      if (agency.acronym) {
        agencyMap[agency.acronym] = agency.id.toString();
      }
    });

    return agencyMap;
  } catch (error) {
    console.error('Error in getDynamicAgencyMap:', error);
    return {};
  }
}

export async function likeQuestion(questionId: string): Promise<void> {
  const url = `${API_URL}/questions/${questionId}/like/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
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
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
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
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
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
