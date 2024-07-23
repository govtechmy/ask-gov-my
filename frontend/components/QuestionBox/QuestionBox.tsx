'use client';

import React, { useState, useMemo } from 'react';
import QuestionCard from './QuestionCard';
import RightArrow from '@/icons/rightarrow';
import LeftArrow from '@/icons/leftarrow';
import { Question } from '@/types/types';

interface QuestionBoxProps {
  questions: Question[];
  agencyList: any[];
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ questions, agencyList }) => {
  const [currentPage, setCurrentPage] = useState(1);
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

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Add first page button
    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`rounded-lg h-10 w-10 ${currentPage === 1 ? 'bg-[#F4EFFF] text-[#702FF9] dark:bg-[#201636] dark:text-[#9E70FF]' : 'bg-transparent text-black-700 dark:text-[#D4D4D8]'}`}
      >
        {1}
      </button>,
    );

    if (currentPage > 1) {
      // Add ellipsis if more than one page away from the start
      pageNumbers.push(
        <span key="ellipsis-start" className="px-2 py-2">
          ...
        </span>,
      );
    }

    let startPage, endPage;
    if (currentPage <= 2) {
      startPage = 2;
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    } else {
      startPage = Math.max(2, currentPage - 1);
      endPage = Math.min(currentPage + 1, totalPages - 1);
    }

    // Add intermediate page buttons
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`rounded-lg h-10 w-10 ${i === currentPage ? 'bg-[#F4EFFF] text-[#702FF9] dark:bg-[#201636] dark:text-[#9E70FF]' : 'bg-transparent text-black-700 dark:text-[#D4D4D8]'}`}
        >
          {i}
        </button>,
      );
    }

    if (currentPage < totalPages - 2) {
      // Add ellipsis if more than one page away from the end
      pageNumbers.push(
        <span key="ellipsis-end" className="px-2 py-2 rounded-lg">
          ...
        </span>,
      );
    }

    // Add last page button
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`rounded-lg h-10 w-10 ${totalPages === currentPage ? 'bg-[#F4EFFF] dark:bg-[#201636] text-[#702FF9] dark:text-[#9E70FF]' : 'bg-transparent text-black-700 dark:text-[#D4D4D8]'}`}
        >
          {totalPages}
        </button>,
      );
    }

    return <div className="flex rounded items-center">{pageNumbers}</div>;
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentQuestions = sortedQuestions.slice(startIdx, endIdx);

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-col gap-6">
        {currentQuestions.map(question => (
          <QuestionCard
            key={question.id}
            question={question}
            agencyList={agencyList}
          />
        ))}
      </div>
      <div className="mt-4 rounded-lg flex items-center justify-center pb-7">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-lg h-10 w-10 bg-[#FFFFFF] dark:bg-[#18181B] shadow-button text-[#FFFFFF] border-[1px] border-[#E4E4E7] dark:border-[#27272A] ${currentPage === 1 ? 'opacity-30' : 'opacity-100'}`}
        >
          <div className="h-10 w-10 rounded-lg flex items-center justify-center">
            <div className="flex items-center justify-center h-5 w-5">
              <LeftArrow className="stroke-[#18181B] dark:stroke-[#FFFFFF]" />
            </div>
          </div>
        </button>

        <div className="rounded-lg p-3">{renderPageNumbers()}</div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`rounded-lg h-10 w-10 bg-[#FFFFFF] dark:bg-[#18181B] shadow-button text-[#FFFFFF] border-[1px] border-[#E4E4E7] dark:border-[#27272A] ${currentPage === totalPages ? 'opacity-30' : 'opacity-100'}`}
        >
          <div className="h-10 w-10 rounded-lg flex items-center justify-center">
            <div className="flex items-center justify-center h-5 w-5">
              <RightArrow className="stroke-[#18181B] dark:stroke-[#FFFFFF]" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuestionBox;
