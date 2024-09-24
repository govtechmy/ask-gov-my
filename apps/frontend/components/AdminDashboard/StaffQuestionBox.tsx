"use client";

import React from "react";
import AnswerQuestionCard from "./AnswerQuestionCard";
import { Question } from "@/types/types";
import { useSearchParams, useRouter } from "next/navigation";

interface QuestionBoxProps {
  data: {
    questions: Question[];
    currentPage: number;
    totalPages: number;
  };
}

const StaffQuestionBox: React.FC<QuestionBoxProps> = ({ data }) => {
  const { questions, currentPage, totalPages } = data;
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div>
      {questions.length === 0 ? (
        <p className="text-center">
          No questions available. Please adjust your filters or search criteria.
        </p>
      ) : (
        <>
          {questions.map((question) => (
            <div className="py-1" key={question.id}>
              <AnswerQuestionCard question={question} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default StaffQuestionBox;
