"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import OverflowContainerQuestBox from "./OverflowContainerQuestBox";
import { fetchAgencyQuestions, getAgencies } from "@/API Services/AgencyServices";
import { Agency } from "@prisma/client";

interface Question {
    id: string;
    agency: string;
    description: string;
    title: string;
}

const MainQuestionBoxAgency = () => {
    const [selectedAgency, setSelectedAgency] = useState<string>('Health Ministry');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [agencies, setAgencies] = useState<Agency[]>([]);

    useEffect(() => {
        async function fetchAgenciesData() {
            try {
                const fetchedAgencies = await getAgencies();
                setAgencies(fetchedAgencies);
            } catch (error) {
                console.error("Error fetching agencies:", error);
            }
        }
        fetchAgenciesData();
    }, []);

    useEffect(() => {
        fetchQuestions(selectedAgency);
    }, [selectedAgency]);

    const fetchQuestions = async (agencyName: string) => {
        try {
            const fetchedQuestions: Question[] | null = await fetchAgencyQuestions(agencyName);
            if (fetchedQuestions !== null) {
                setQuestions(fetchedQuestions);
            } else {
                setQuestions([]);
            }
        } catch (error) {
            console.error("Error fetching questions: ", error);
        }
    };

    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <h1>Top Questions From Citizens</h1>
            <p>Displaying questions for Health Ministry</p>
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
                        <p style={{ textDecoration: 'none', color: 'inherit' }}>
                            <OverflowContainerQuestBox
                                id={question.id}
                                title={question.title}
                                description={question.description}
                            />
                        </p>
                    </Link>
                ))
            ) : (
                <p>No questions found for Health Ministry</p>
            )}
            <div className="text-center">paging</div>
            {/* do paging later on after link with plane.so */}
        </div>
    );
};

export default MainQuestionBoxAgency;
