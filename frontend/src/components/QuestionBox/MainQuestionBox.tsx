'use client'
import { useEffect, useState } from "react";
import OverflowContainerQuestBox from "./OverflowContainerQuestBox";
import { getRandomQuestionsFromDB } from "@/API Services/questionServices";

interface Question {
    id: string;
    agency: string;
    description: string;
    title: string;
  }
  
const MainQuestionBox = () => {

    const [questions, setQuestions] = useState<Question[]>([]);

    const fetchQuestions = async () => {
        try {
            const fetchedQuestions: Question[] = await getRandomQuestionsFromDB();
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error("Error fetching questions: ", error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <h1>Top Questions From Citizens</h1>
            {questions.map((question) => (
                <OverflowContainerQuestBox 
                    key={question.id} 
                    id={question.id}
                    title={question.title} 
                    description={question.description} 
                />
            ))}
            <div className="text-center">paging</div>
            {/* do paging later on after link with plane.so */}
        </div> 
    );
};

export default MainQuestionBox;