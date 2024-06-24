"use client";
import { useState } from "react";
import QuestionCard from "./QuestionCard";

interface Question {
  id: string;
  name: string;
  description_html: string;
  agency: string;
  createdAt: string;
  agencyId: string;
}

interface QuestionBoxProps {
  questions: Question[];
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ questions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentQuestions = questions.slice(startIdx, endIdx);

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-col gap-6">
        {currentQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="m-4 rounded border border-gray-300 px-4 py-2"
        >
          Previous
        </button>
        <div className="">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`rounded border px-4 py-2 ${
                index + 1 === currentPage
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="m-4 rounded border border-gray-300 px-4 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionBox;
