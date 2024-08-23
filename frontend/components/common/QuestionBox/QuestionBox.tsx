'use client';

import React, { useState, useMemo } from 'react';
import QuestionCard from './QuestionCard';
import Pagination from '@/components/ui/pagination';
import { Question, Agency } from '@/types/types';

interface QuestionBoxProps {
  questions: Question[];
  agencyMap: Record<string, string>;
  agencyList: Agency[];
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  questions,
  agencyMap,
  agencyList,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedQuestions, setPaginatedQuestions] = useState<Question[]>([]);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => b.likes - a.likes);
  }, [questions]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-col gap-6">
        {paginatedQuestions.map(question => (
          <QuestionCard
            key={question.id}
            question={question}
            agencyMap={agencyMap}
            agencyList={agencyList}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={questions.length}
        setPaginatedItems={setPaginatedQuestions}
        items={sortedQuestions}
      />
    </div>
  );
};

export default QuestionBox;
