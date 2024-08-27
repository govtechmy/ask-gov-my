'use client';

import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import Pagination from '../ui/pagination';
import { Question, Agency } from '@/types/types';

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
  totalItems: initialTotalItems,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  importFunction,
  value,
  secondValue,
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
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
      setCurrentPage(page);
      setTotalItems(newTotalItems);
      setTotalPages(newTotalPages);
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
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
};

export default QuestionBox;
