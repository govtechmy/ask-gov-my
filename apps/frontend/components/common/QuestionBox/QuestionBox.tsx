"use client";

import React from "react";
import QuestionCard from "./QuestionCard";
import { Question, Agency } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/i18n";
interface PaginatedQuestions {
  data: Question[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface QuestionBoxProps {
  questions: PaginatedQuestions;
  agencyMap: Record<string, string>;
  agencyList: Agency[];
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  questions,
  agencyMap,
  agencyList,
}) => {
  const { data, totalItems, currentPage, totalPages } = questions;
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
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-col gap-6">
        {data.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            agencyMap={agencyMap}
            agencyList={agencyList}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionBox;
