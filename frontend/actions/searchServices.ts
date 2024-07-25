'use server';
import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';
import OpenAI from 'openai';
dotenv.config();

const elasticsearchURL = process.env.ELASTICSEARCH_URL;
const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

const client = new Client({
  node: elasticsearchURL,
  auth: {
    apiKey: elasticsearchApiKey,
  },
});

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

interface Question {
  id: number;
  question: string;
  date: string;
  answered_date: string;
  state: string;
  agency: {
    id: number;
    name: string;
    acronym: string;
    name_ms: string;
  };
  answer: string;
  topics: {
    id: number;
    name: string;
    name_ms: string;
  }[];
  email?: string;
  likes: number;
  dislikes: number;
  attachments?: string[];
  admin_isopen?: boolean;
  staff_isopen?: boolean;
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

export async function searchQuestions(query: string) {
  try {
    const embedding = await getEmbedding(query);

    const result = await client.search({
      index: 'questions',
      body: {
        query: {
          bool: {
            must: [
              {
                knn: {
                  field: 'vector',
                  query_vector: embedding,
                  num_candidates: 1000, // Number of candidates to consider
                },
              },
              {
                multi_match: {
                  query,
                  fields: [
                    'agency.name',
                    'agency.acronym',
                    'agency.name_ms',
                    'topics.name',
                    'topics.name_ms',
                  ],
                },
              },
              {
                term: {
                  state: 'completed',
                },
              },
            ],
          },
        },
      },
    });

    const filteredQuestions = result.hits.hits.map((hit: any) => hit._source);

    return filteredQuestions;
  } catch (error) {
    console.error('Error searching questions:', error);
    return [];
  }
}

export async function getRelatedQuestions(questionText: string) {
  try {
    const relatedQuestions = await searchQuestions(questionText);
    return relatedQuestions.slice(0, 4); // Return only the top 4 related questions
  } catch (error) {
    console.error('Error fetching related questions:', error);
    return [];
  }
}