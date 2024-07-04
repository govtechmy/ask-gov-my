'use client';

import React, { useState } from 'react';
import QuestionCard from './QuestionCard';

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: number;
  answer: string;
  topics: number[];
  email: string;
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

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Always display first page
    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`rounded border px-4 py-2 ${
          1 === currentPage
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-gray-300'
        }`}
      >
        {1}
      </button>,
    );

    // Display ellipsis after the first page if necessary
    if (currentPage > 3) {
      pageNumbers.push(
        <span key="ellipsis-start" className="px-2">
          ...
        </span>,
      );
    }

    // Determine range of pages to display
    let startPage, endPage;
    if (currentPage <= 2) {
      startPage = 2;
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 4);
      endPage = totalPages - 1;
    } else {
      startPage = Math.max(2, currentPage - 1);
      endPage = Math.min(currentPage + 1, totalPages - 1);
    }

    // Display pages within range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`rounded border px-4 py-2 ${
            i === currentPage
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300'
          }`}
        >
          {i}
        </button>,
      );
    }

    // Display ellipsis before the last page if necessary
    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <span key="ellipsis-end" className="px-2">
          ...
        </span>,
      );
    }

    // Always display last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`rounded border px-4 py-2 ${
            totalPages === currentPage
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300'
          }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pageNumbers;
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentQuestions = questions.slice(startIdx, endIdx);

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-col gap-6">
        {currentQuestions.map(question => (
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
        <div className="">{renderPageNumbers()}</div>
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
