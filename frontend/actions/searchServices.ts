'use server';
import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';
import { AGENCY_TO_UUID } from '@/lib/agency';
dotenv.config();

const elasticsearchURL = process.env.ELASTICSEARCH_URL;
const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY;

const client = new Client({
  node: elasticsearchURL,
  auth: {
    apiKey: elasticsearchApiKey,
  },
});

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
}

export async function searchQuestions(query: string) {
  try {
    const result = await client.search({
      index: 'questions',
      size: 100, // limit to 100 results
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: `*${query}*`,
                  fields: [
                    'question',
                    'agency.name',
                    'topics.title',
                    'answer',
                    'agency.acronym',
                  ],
                },
              },
              {
                match: {
                  state: 'completed',
                },
              },
            ],
          },
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  } catch (error) {
    console.error('Error searching questions:', error);
    return [];
  }
}
