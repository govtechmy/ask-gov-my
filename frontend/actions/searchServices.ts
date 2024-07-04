"use server";
import { Client } from "@elastic/elasticsearch";
import { AGENCY_TO_UUID } from "@/lib/agency";

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
            index: 'questions',
            size: 20, // limit to 20 results
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                query_string: {
                                    query: `*${query}*`,
                                    fields: ['question', 'agency.name', 'topics.title', 'answer']
                                }
                            },
                            {
                                match: {
                                    state: 'completed'
                                }
                            }
                        ]
                    }
                }
            }
        });

        return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
        console.error('Error searching questions:', error);
        return [];
    }
}

