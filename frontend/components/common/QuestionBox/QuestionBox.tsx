'use client';

import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import Pagination from '@/components/ui/pagination';
import { Question, Agency } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/lib/i18n';

interface QuestionBoxProps {
  questions: Question[];
  agencyMap: Record<string, string>;
  agencyList: Agency[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  importFunction: Function;
  value?: number | string;
  secondValue?: string;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({
  questions: initialQuestions,
  agencyMap,
  agencyList,
  currentPage,
  totalPages,
  importFunction,
  value,
  secondValue,
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const itemsPerPage = 6;

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const {
        questions: newQuestions,
        totalItems: newTotalItems,
        totalPages: newTotalPages,
      } = secondValue
        ? await importFunction(value, secondValue, page, itemsPerPage)
        : value
          ? await importFunction(value, page, itemsPerPage)
          : await importFunction(page, itemsPerPage);
      
      setQuestions(newQuestions);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-col gap-6">
        {questions.map(question => (
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
      />
    </div>
  );
};

export default QuestionBox;