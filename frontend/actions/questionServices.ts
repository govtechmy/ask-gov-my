'use server';

import { AGENCY_TO_UUID } from '@/lib/agency';

//important update for agency, style is X_OF_X

interface Question {
  id: string;
  agency: string;
  description_html: string;
  name: string;
  labels: string[];
  createdAt: string;
  agencyId: string;
}

interface ApiResponse {
  id: string;
  name: string;
  description_html: string;
  labels: string[];
  created_at: string;
}

export async function getAllQuestions(
  page: number = 1,
  pageSize: number = 10,
): Promise<{ questions: Question[]; total: number }> {
  let Questions: Question[] = [];

  for (const [agencyName, projectId] of Object.entries(AGENCY_TO_UUID)) {
    const response = await fetch(
      `https://api.plane.so/api/v1/workspaces/${process.env.PLANE_WORKSPACE_ID}/projects/${projectId}/issues/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.PLANE_API_KEY,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      data.results.forEach((res: ApiResponse) => {
        Questions.push({
          id: res.id,
          agency: agencyName,
          description_html: res.description_html,
          name: res.name,
          labels: res.labels,
          createdAt: res.created_at,
          agencyId: projectId,
        });
      });
    } else {
      console.error(`Failed to fetch questions for agency: ${agencyName}`);
    }
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedQuestions = Questions.slice(start, end);

  return { questions: paginatedQuestions, total: Questions.length };
}

export async function getQuestionsByAgency(
  agencyId: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ questions: Question[]; total: number }> {
  let Questions: Question[] = [];

  const agencyName =
    Object.keys(AGENCY_TO_UUID).find(
      key => AGENCY_TO_UUID[key as keyof typeof AGENCY_TO_UUID] === agencyId,
    ) || 'Unknown Agency';

  const response = await fetch(
    `https://api.plane.so/api/v1/workspaces/${process.env.PLANE_WORKSPACE_ID}/projects/${agencyId}/issues/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.PLANE_API_KEY,
      },
    },
  );

  if (response.ok) {
    const data = await response.json();
    data.results.forEach((res: ApiResponse) => {
      Questions.push({
        id: res.id,
        agency: agencyName,
        description_html: res.description_html,
        name: res.name,
        labels: res.labels,
        createdAt: res.created_at,
        agencyId,
      });
    });
  } else {
    console.error(`Failed to fetch questions for agency: ${agencyId}`);
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedQuestions = Questions.slice(start, end);

  return { questions: paginatedQuestions, total: Questions.length };
}

export async function getQuestionById(
  agencyId: string,
  questionId: string,
): Promise<Question | null> {
  const { questions } = await getQuestionsByAgency(agencyId);
  const question = questions.find(q => q.id === questionId);
  return question || null;
}

export async function submitQuestion(
  agencyId: string,
  question: string,
): Promise<void> {
  const url = `https://api.plane.so/api/v1/workspaces/${process.env.PLANE_WORKSPACE_ID}/projects/${agencyId}/inbox-issues/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.PLANE_API_KEY,
    },
    body: JSON.stringify({
      issue: {
        name: question,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit question');
  }
}

export async function getAgencyList(): Promise<{ id: string; name: string }[]> {
  return Object.entries(AGENCY_TO_UUID).map(([name, id]) => ({ id, name }));
}
