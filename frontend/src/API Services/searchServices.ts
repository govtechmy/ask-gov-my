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
    "MINISTRY_OF_FINANCE": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
    "MINISTRY_OF_EDUCATION": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
    "MINISTRY_OF_TRANSPORTATION": "d13c5167-f77d-43d6-8efc-35f2985316a3",
    "MINISTRY_OF_HEALTH": "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
    "MINISTRY_OF_ECONOMY": "108f76f0-7b0a-4b4f-828e-7c840156a3f9",
    "MINISTRY_OF_TOURISM_ARTS_AND_CULTURE": "214d9194-ff01-46fc-9436-97586581f057",
    "MINISTRY_OF_WOMEN_FAMILY_AND_COMMUNITY_DEVELOPMENT": "2dc0554f-7951-46ee-9fe4-57541f133038",
    "MINISTRY_OF_NATURAL_RESOURCES_AND_ENVIRONMENTAL_SUSTAINABILITY": "9ac53fde-ce7c-4d86-ab69-7f53a9a91b56",
    "MINISTRY_OF_YOUTH_AND_SPORTS": "f68f639d-56df-4e7a-a0af-8062b66198b8",
    "MINISTRY_OF_HIGHER_EDUCATION": "4576929f-1438-4ae9-970b-30f087b8365e",
    "MINISTRY_OF_PLANTATION_AND_COMMODITIES": "64236d33-b92b-4383-ac97-a4451a981cbe",
    "MINISTRY_OF_HOUSING_AND_LOCAL_GOVERNMENT": "371218a4-f4f2-4e8e-88ac-128ccc03e4c1",
    "MINISTRY_OF_HUMAN_RESOURCES": "183a3cab-0d49-468f-8915-aadbe2ecab20",
    "MINISTRY_OF_INVESTMENT_TRADE_AND_INDUSTRY": "74137394-b689-4fd7-88a9-e3b2f7558758"
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
    console.log("response ok from plane")
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

// index questions in Elasticsearch
for (const question of questions) {
    console.log(`indexing question ${question.id} to elasticsearch`)
    await client.index({
    index: 'questions',
    id: question.id,
    document: question,
    });
}

console.log(`Indexed ${questions.length} questions to Elasticsearch.`);
}

export async function searchQuestions(query: string) {
    const result = await client.search({
        index: 'questions',
        size: 5, // limit to 5 results
        body: {
            query: {
                query_string: {
                    query: `*${query}*`,
                    fields: ['name', 'description_html', 'agency', 'labels']
                }
            }
        }
    });

    return result.hits.hits.map((hit: any) => hit._source);
}