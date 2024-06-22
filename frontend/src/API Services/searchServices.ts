'use server'
import { Client } from '@elastic/elasticsearch-serverless';

const URL = "https://fc58f6e02e90496b9c6caaa59a73ad9c.es.us-east-1.aws.elastic.cloud:443"
const KEY = "rjSDb9NwRMmRrwB-Ve4CdA"

const client = new Client({
    node: URL,
    auth: {
      apiKey: "SFl4VFBwQUI1blFNenNoNTZxeFQ6RmRSdVBUU3JUZFNoamVkZ3ZGU1VGZw=="
    },
  });

const AGENCY = {
"finance-ministry": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
"education-ministry": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
"transport-ministry": "d13c5167-f77d-43d6-8efc-35f2985316a3",
};
const API_KEY = "plane_api_1cbdb318805f491b842a89c4a078ea9f";


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
description_html: string;
name: string;
labels: string[];
created_at: string;
}

export async function fetchAndIndexQuestions() {
let questions: Question[] = [];

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
    data.results.forEach((res: ApiResponse) => {
        questions.push({
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

// Index questions in Elasticsearch
for (const question of questions) {
    await client.index({
    index: 'questions',
    id: question.id,
    document: question,
    });
}

console.log(`Indexed ${questions.length} questions to Elasticsearch.`);
}