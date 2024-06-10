import { useEffect, useState } from "react";
import Link from "next/link";
import OverflowContainerQuestBox from "./OverflowContainerQuestBox";
import { fetchAgencyQuestions } from "@/API Services/AgencyServices";

interface Question {
    id: string;
    agency: string;
    description: string;
    title: string;
}

interface MainQuestionBoxAgencyProps {
    agencyName: string;
}

const MainQuestionBoxAgency: React.FC<MainQuestionBoxAgencyProps> = ({ agencyName }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    useEffect(() => {
        const fetchQuestions = async (agencyName: string) => {
            try {
                const data = await fetchAgencyQuestions(agencyName);
                setQuestions(data);
            } catch (err) {
                setError("Failed to fetch questions. Go to ");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions(agencyName);
    }, [agencyName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}<Link href="/AgencyListPage"><div>Agency List Page</div></Link> to choose your agency.</p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <h1>Top Questions From Citizens</h1>
            <p>Displaying questions for {agencyName}</p>
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
                <p>No questions found for {agencyName}</p>
            )}
            <div className="text-center">paging</div>
            {/* do paging later on after link with plane.so */}
        </div>
    );
};

export default MainQuestionBoxAgency;
