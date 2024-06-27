'use server';

import { Client } from '@elastic/elasticsearch-serverless';

const URL = "https://askgov-fc58f6.es.us-east-1.aws.elastic.cloud";

const client = new Client({
    node: URL,
    auth: {
        apiKey: "NWNHNVRaQUI3cVdKTXhCbHk4Sl86Um1LTmRKNjFSMjJXeUVtNGFVMEtldw=="
    },
});

const BACKEND_API_URL = "http://localhost:8000/api/questions/";

export async function fetchAndIndexQuestions() {
    try {
        const response = await fetch(BACKEND_API_URL, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch questions from backend');
        }

        const data = await response.json();
        const questions = data;

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

fetchAndIndexQuestions();
