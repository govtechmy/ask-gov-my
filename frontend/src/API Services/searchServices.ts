'use server'
import { Client } from '@elastic/elasticsearch-serverless';

const URL = "https://askgov-fc58f6.es.us-east-1.aws.elastic.cloud"
const KEY = "rjSDb9NwRMmRrwB-Ve4CdA"

const client = new Client({
    node: URL,
    auth: {
        apiKey: "NWNHNVRaQUI3cVdKTXhCbHk4Sl86Um1LTmRKNjFSMjJXeUVtNGFVMEtldw=="
    },
});

const BACKEND_API_URL = "http://localhost:8000/api/questions/";

interface Question {
    id: number;
    question: string;
    agency: {
        id: number;
        name: string;
        acronym: string | null;
    };
    date: string;
    answer: string;
    topics: Array<{
        id: number;
        title: string;
    }>;
    email: string;
}

export async function fetchAndIndexQuestions() {
    try {
        const response = await fetch(BACKEND_API_URL, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch questions from backend');
        }

        const data = await response.json();
        const questions: Question[] = data;

        for (const question of questions) {
            console.log(`Indexing question ${question.id} to Elasticsearch`);
            await client.index({
                index: 'questions',
                id: String(question.id),
                document: question,
            });
        }

        console.log(`Indexed ${questions.length} questions to Elasticsearch.`);
    } catch (error) {
        console.error('Error fetching and indexing questions:', error);
    }
}

export async function searchQuestions(query: string) {
    try {
        const result = await client.search({
            index: 'questions',
            size: 5, // limit to 5 results
            body: {
                query: {
                    query_string: {
                        query: `*${query}*`,
                        fields: ['question', 'agency.name', 'topics.title', 'answer']
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
