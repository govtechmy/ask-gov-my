"use client"
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
        <div className="flex flex-col gap-4 justify-center">
            <div className="grid grid-cols-3 gap-6">
                {questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                ))}
            </div>
            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded border-gray-300 m-4"
                >
                    Previous
                </button>
                <div className="">
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
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded border-gray-300 m-4"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default QuestionBox;
