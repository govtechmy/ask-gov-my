'use client';

import React, { useState, useEffect } from 'react';
import AdminQuestionCard from './AdminQuestionCard';
import RightArrow from '@/icons/rightarrow';
import LeftArrow from '@/icons/leftarrow';
import { useSearchParams } from 'next/navigation';
import AnswerQuestionCard from './AnswerQuestionCard';

interface Question {
  id: number;
  question: string;
  date: string;
  answered_date: string;
  state: string;
  agency: number;
  answer: string;
  topics: number[];
  email?: string;
  likes: number;
  dislikes: number;
  attachments?: string[];
  admin_isopen?: boolean;
  staff_isopen?: boolean;
}

interface QuestionBoxProps {
  questions: Question[];
}

const AdminQuestionBox: React.FC<QuestionBoxProps> = ({ questions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

  useEffect(() => {
    let filtered = questions;
    if (activeTab === 'unassigned') {
      filtered = questions.filter(question => question.agency === null);
    } else if (activeTab === 'assigned') {
      filtered = questions.filter(question => question.agency !== null);
    }
    setFilteredQuestions(filtered);
    setCurrentPage(1); // reset to first page when tab changes
  }, [questions, activeTab]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`rounded-lg h-8 w-7 ${currentPage === 1 ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
      >
        {1}
      </button>,
    );

    if (currentPage > 1) {
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

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`rounded-lg h-8 w-7 ${i === currentPage ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
        >
          {i}
        </button>,
      );
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <span key="ellipsis-end" className="px-2 py-2 rounded-lg">
          ...
        </span>,
      );
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`rounded-lg h-8 w-7 ${totalPages === currentPage ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
        >
          {totalPages}
        </button>,
      );
    }

    return <div className="flex rounded items-center">{pageNumbers}</div>;
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentQuestions = filteredQuestions.slice(startIdx, endIdx);

  return (
    <div>
      {currentQuestions.map(question => (
        <div className="py-1">
          <AdminQuestionCard key={question.id} question={question} />
        </div>
      ))}

      {/* below is page handler */}
      <div className="mt-4 rounded-lg flex items-center justify-center pb-7">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-lg h-8 w-8 bg-whit shadow-button text-black-900 border-[1px] border-[#E4E4E7] ${currentPage === 1 ? ' opacity-30' : 'opacity-100'}`}
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center">
            <div className="flex items-center justify-center h-4 w-4">
              <LeftArrow />
            </div>
          </div>
        </button>

        <div className="rounded-lg p-3">{renderPageNumbers()}</div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`rounded-lg h-8 w-8 bg-whit shadow-button text-black-900 border-[1px] border-[#E4E4E7] ${currentPage === totalPages ? ' opacity-30' : 'opacity-100'}`}
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center">
            <div className="flex items-center justify-center h-4 w-4">
              <RightArrow />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminQuestionBox;
