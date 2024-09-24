"use client";

import React, { useState } from "react";
import AdminQuestionCard from "./AdminQuestionCard";
import { Question, Agency } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/i18n";
interface AdminQuestionBoxProps {
  data: {
    questions: Question[];
    totalPages: number;
    currentPage: number;
  };
  agencyMap: Record<string, string>;
  agencies: Agency[];
}

const AdminQuestionBox: React.FC<AdminQuestionBoxProps> = ({
  data: { questions, totalPages, currentPage },
  agencyMap,
  agencies,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div>
      {questions.map((question) => (
        <div className="py-1" key={question.id}>
          <AdminQuestionCard
            key={question.id}
            question={question}
            activeQuestionId={activeQuestionId}
            setactiveQuestionId={setActiveQuestionId}
            agencyMap={agencyMap}
            agencies={agencies}
          />
        </div>
      ))}
    </div>
  );
};

export default AdminQuestionBox;
