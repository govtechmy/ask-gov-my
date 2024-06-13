'use client'
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getQuestionById } from '@/API Services/questionServices';

const QuestionDetailPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [question, setQuestion] = useState<{ title: string, description: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            if (id) {
                try {
                    const fetchedQuestion = await getQuestionById(id);
                    setQuestion(fetchedQuestion);
                } catch (error) {
                    console.error("Error fetching question:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    return (
        <div className="container max-w-full">
            <div className="p-5">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    question ? (
                        <>
                            <h1 className="text-2xl font-bold">{question.title}</h1>
                            {question.description ? (
                                <div dangerouslySetInnerHTML={{ __html: question.description }} />
                            ) : (
                                <p>This question has not yet been answered.</p>
                            )}
                        </>
                    ) : (
                        <div>Question not found</div>
                    )
                )}
            </div>
            <div>Recommended Question Box</div>
            <div>
                Can&apos;t find what you&apos;re looking for? 
                <Link href="/questions/new">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Ask a Question</button>
                </Link>
            </div>
        </div>
    );
};

export default QuestionDetailPage;
