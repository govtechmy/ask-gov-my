'use client'
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import IdentifyWebsite from "@/components/IdentifyWebsite";
import SearchNavbar from "@/components/SearchNavBar";
import Footer from "@/components/Footer";
import { getQuestionById } from '@/API Services/questionServices';


const QuestionDetailPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [question, setQuestion] = useState<{title: string, description: string} | null>(null);
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
            }
        };

        fetchQuestion();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!question) {
        return <div>Question not found</div>;
    }

    return (
        <div className="container max-w-full">
            <div className="sticky top-0 left-0 w-full bg-white">
                <div>
                    <IdentifyWebsite />
                    <SearchNavbar />
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-2xl font-bold">{question.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: question.description }} />
            </div>
            <div>Navigation Panel</div>
            <div>Recommended Question Box</div>
            <div>
                Can&apos;t find what you&apos;re looking for? 
                <Link href="/questions/new">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Ask a Question</button>
                </Link>
            </div>
            <Footer />
        </div>
    );
};

export default QuestionDetailPage;
