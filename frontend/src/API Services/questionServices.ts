"use server";

import {
  fullArrayDummy,
} from "./dummy_data";

const AGENCY = {
  "FINANCE MINISTRY": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
  "EDUCATION MINISTRY": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
  "TRANSPORT MINISTRY": "d13c5167-f77d-43d6-8efc-35f2985316a3",
  "HEALTH MINISTRY": "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
  "TOURISM MINISTRY": "a43e382b-6445-43d2-bf03-eeeb74feb0c8",
};

const API_KEY = "plane_api_1cbdb318805f491b842a89c4a078ea9f";

interface Question {
  id: string;
  agency: string;
  description_html: string;
  name: string;
  labels: string[];
  createdAt: string;
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
  pageSize: number = 10
): Promise<{ questions: Question[]; total: number }> {
  let Questions: Question[] = [];

  if (process.env.NODE_ENV.toLowerCase() === 'local') {
    fullArrayDummy.forEach((ministry) => {
      ministry.results.forEach((res: ApiResponse) => { // Add type for 'res'
        Questions.push({
          id: res.id,
          agency: res.name,
          description_html: res.description_html,
          name: res.name,
          labels: res.labels,
          createdAt: res.created_at,
        });
      });
    });
  } else {
    for (const [agencyName, projectId] of Object.entries(AGENCY)) {
      const response = await fetch(`https://api.plane.so/api/v1/workspaces/govtech/projects/${projectId}/issues/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        data.results.forEach((res: ApiResponse) => { // Add type for 'res'
          Questions.push({
            id: res.id,
            agency: agencyName,
            description_html: res.description_html,
            name: res.name,
            labels: res.labels,
            createdAt: res.created_at,
          });
        });
      } else {
        console.error(`Failed to fetch questions for agency: ${agencyName}`);
      }
    }
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedQuestions = Questions.slice(start, end);

  return { questions: paginatedQuestions, total: Questions.length };
}

export async function getAgencyList(): Promise<{ id: string; name: string }[]> {
  return Object.entries(AGENCY).map(([name, id]) => ({ id, name }));
}
