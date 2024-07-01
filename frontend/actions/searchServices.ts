"use server";
import { Client } from "@elastic/elasticsearch";

const URL = "https://askgov-fc58f6.es.us-east-1.aws.elastic.cloud";

const client = new Client({
  node: URL,
  auth: {
    apiKey: "NWNHNVRaQUI3cVdKTXhCbHk4Sl86Um1LTmRKNjFSMjJXeUVtNGFVMEtldw==",
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
}

export async function searchQuestions(query: string) {
  try {
    const result = await client.search({
      index: "questions",
      size: 5, // limit to 5 results
      body: {
        query: {
          query_string: {
            query: `*${query}*`,
            fields: ["question", "topics.title", "answer"],
          },
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  } catch (error) {
    console.error("Error searching questions:", error);
    return [];
  }
}
