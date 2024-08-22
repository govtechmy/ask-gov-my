'use client';

import React, { useState, useEffect } from 'react';
import AdminQuestionCard from './AdminQuestionCard';
import { useSearchParams } from 'next/navigation';
import { Question } from '@/types/types';
import { getDynamicAgencyMap, getAgencyList } from '@/actions/questionServices';
import Pagination from '../ui/pagination';
import { Agency } from '@/types/types';
interface QuestionBoxProps {
  questions: Question[];
}

const AdminQuestionBox: React.FC<QuestionBoxProps> = ({ questions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [paginatedQuestions, setPaginatedQuestions] = useState<Question[]>([]);
  const [agencyMap, setAgencyMap] = useState<Record<string, string>>({});
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';
  const [activeQuestionId, setactiveQuestionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      const agencyList = await getAgencyList();
      setAgencies(agencyList);
    };

    fetchAgencies();
  }, []);

  useEffect(() => {
    let filtered = questions;
    if (activeTab === 'unassigned') {
      filtered = questions.filter(
        question => question.agency === null && question.state !== 'spam',
      );
    } else if (activeTab === 'assigned') {
      filtered = questions.filter(
        question => question.agency !== null && question.state !== 'spam',
      );
    } else if (activeTab === 'spam') {
      filtered = questions.filter(question => question.state === 'spam');
    } else if (activeTab === 'all') {
      filtered = questions.filter(question => question.state !== 'spam');
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1); // reset to first page when tab changes
  }, [questions, activeTab]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {paginatedQuestions.map(question => (
        <div className="py-1" key={question.id}>
          <AdminQuestionCard
            key={question.id}
            question={question}
            activeQuestionId={activeQuestionId}
            setactiveQuestionId={setactiveQuestionId}
            agencyMap={agencyMap}
            agencies={agencies}
          />
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

export default AdminQuestionBox;
