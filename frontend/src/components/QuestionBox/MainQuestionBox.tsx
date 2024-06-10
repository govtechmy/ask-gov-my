'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import OverflowContainerQuestBox from "./OverflowContainerQuestBox";
import { getRandomQuestionsFromDB } from "@/API Services/questionServices";
import { fetchAgencyQuestions } from "@/API Services/AgencyServices";

interface Question {
    id: string;
    agency: string;
    description: string;
    title: string;
}

interface MainQuestionBoxProps {
    agencyName?: string;
}

const MainQuestionBox: React.FC<MainQuestionBoxProps> = ({ agencyName }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestions = async () => {
        try {
            let fetchedQuestions: Question[];
            if (agencyName) {
                fetchedQuestions = await fetchAgencyQuestions(agencyName);
            } else {
                fetchedQuestions = await getRandomQuestionsFromDB();
            }
            setQuestions(fetchedQuestions);
        } catch (err) {
            setError("Failed to fetch questions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [agencyName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error} {agencyName ? <Link href="/AgencyListPage"><div>Go to Agency List Page</div></Link> : null} to choose your agency.</p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <h1>Top Questions From Citizens</h1>
            {agencyName && <p>Displaying questions for {agencyName}</p>}
            {questions.length > 0 ? (
                questions.map((question) => (
                    <Link
                        key={question.id}
                        href={{
                            pathname: '/QuestionDetailPage',
                            query: { id: question.id }
                        }}
                        passHref
                    >
                        <div style={{ textDecoration: 'none', color: 'inherit' }}>
                            <OverflowContainerQuestBox
                                id={question.id}
                                title={question.title}
                                description={question.description}
                            />
                        </div>
                    </Link>
                ))
            ) : (
                <p>No questions found {agencyName ? `for ${agencyName}` : ''}</p>
            )}
            <div className="text-center">paging</div>
            {/* do paging later on after link with plane.so */}
        </div>
    );
};

export default MainQuestionBox;
