'use client';

import React, { useState, useEffect } from 'react';
import AnswerQuestionCard from './AnswerQuestionCard';
import { useSearchParams } from 'next/navigation';
import { Question } from '@/types/types';
import Pagination from '../ui/pagination';

interface QuestionBoxProps {
  questions: Question[];
}

const StaffQuestionBox: React.FC<QuestionBoxProps> = ({ questions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [paginatedQuestions, setPaginatedQuestions] = useState<Question[]>([]);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

  useEffect(() => {
    let filtered = questions;
    if (activeTab === 'unanswered') {
      filtered = questions.filter(
        question => question.answer === null && question.state !== 'spam',
      );
    } else if (activeTab === 'answered') {
      filtered = questions.filter(
        question => question.answer !== null && question.state !== 'spam',
      );
    } else if (activeTab === 'draft') {
      filtered = questions.filter(question => question.state === 'draft');
    } else if (activeTab === 'all') {
      filtered = questions.filter(
        question => question.state === 'draft' || question.state !== 'spam',
      );
    }
    setFilteredQuestions(filtered);
    setCurrentPage(1); // reset to first page when tab changes
  }, [questions, activeTab]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentQuestions = filteredQuestions.slice(startIdx, endIdx);

  return (
    <div>
      {currentQuestions.map(question => (
        <div className="py-1" key={question.id}>
          <AnswerQuestionCard question={question} />
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={filteredQuestions.length}
        setPaginatedItems={setPaginatedQuestions}
        items={filteredQuestions}
      />
    </div>
  );
};

export default StaffQuestionBox;
