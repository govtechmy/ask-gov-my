"use server";
import dotenv from "dotenv";
import { Client } from "@elastic/elasticsearch";
import OpenAI from "openai";
import { paginate } from "@/lib/server-helper";
import { PageResult, Question } from "@/types/types";
dotenv.config();

const elasticsearchURL = process.env.ELASTICSEARCH_URL;
const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY as string;
const openaiApiKey = process.env.OPENAI_API_KEY;

let client: Client | null = null;

function clientf(): Client {
  if (!client) {
    client = new Client({
      node: elasticsearchURL,
      auth: {
        apiKey: elasticsearchApiKey,
      },
    });
  }
  return client;
}

let openai: OpenAI | null = null;

function openaif(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: openaiApiKey,
    });
  }
  return openai;
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openaif().embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function searchQuestions(query: string): Promise<Question[]> {
  try {
    const embedding = await getEmbedding(query);

    const result = await clientf().search({
      index: "questions",
      body: {
        query: {
          bool: {
            must: [
              { term: { state: "completed" } },
              {
                bool: {
                  should: [
                    {
                      knn: {
                        field: "vector",
                        query_vector: embedding,
                        num_candidates: 50,
                        boost: 1,
                      },
                    },
                    {
                      multi_match: {
                        query,
                        fields: [
                          "agency.name",
                          "agency.acronym",
                          "agency.name_ms",
                          "topics.name",
                          "topics.name_ms",
                        ],
                        boost: 0.5,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        size: 20,
      },
    });

    const filteredQuestions = result.hits.hits.map((hit: any) => hit._source);

    return filteredQuestions;
  } catch (error) {
    console.error("Error searching questions:", error);
    return [];
  }
}
export async function searchQuestionsWithPagination(
  query: string,
  page: number = 1,
  pageSize: number = 4
): Promise<PageResult<Question>> {
  try {
    const embedding = await getEmbedding(query);

    const result = await clientf().search({
      index: "questions",
      body: {
        query: {
          bool: {
            must: [
              { term: { state: "completed" } },
              {
                bool: {
                  should: [
                    {
                      knn: {
                        field: "vector",
                        query_vector: embedding,
                        num_candidates: 50,
                        boost: 1,
                      },
                    },
                    {
                      multi_match: {
                        query,
                        fields: [
                          "agency.name",
                          "agency.acronym",
                          "agency.name_ms",
                          "topics.name",
                          "topics.name_ms",
                        ],
                        boost: 0.5,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        from: (page - 1) * pageSize,
        size: pageSize,
      },
    });

    const totalItems = result.hits.total
      ? typeof result.hits.total === "number"
        ? result.hits.total
        : result.hits.total.value
      : 0;

    const data = result.hits.hits.map((hit: any) => hit._source);

    return paginate(data, totalItems, page, pageSize);
  } catch (error) {
    console.error("Error searching questions with pagination:", error);
    return {
      results: [],
      page: {
        current: 1,
        max: 0,
        total: 0,
        limit: 0,
      },
    };
  }
}

export async function getRelatedQuestions(questionText: string) {
  try {
    const relatedQuestions = await searchQuestions(questionText);
    return relatedQuestions.slice(0, 4); // Return only the top 4 related questions
  } catch (error) {
    console.error("Error fetching related questions:", error);
    return [];
  }
}
