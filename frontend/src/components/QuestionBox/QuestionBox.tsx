'use client'
import QuestionCard from "./QuestionCard";
import { useRouter } from "next/navigation";

interface Question {
    id: string;
    name: string;
    description_html: string;
    agency: string;
    createdAt: string;
}

interface QuestionBoxProps {
    questions: Question[];
    totalPages: number;
    currentPage: number;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ questions, totalPages, currentPage }) => {
    const router = useRouter();

    const handlePageChange = (page: number) => {
        router.push(`/?page=${page}`);
    };

    return (
        <div className="flex flex-col gap-4">
            {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
            ))}
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 border rounded ${
                            index + 1 === currentPage ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionBox;