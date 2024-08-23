'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { getAllUserQuestions } from '@/actions/userServices';
import AdminQuestionBox from '@/components/AdminDashboard/AdminQuestionBox';
import QuestionNavbar from '@/components/AdminDashboard/QuestionNavbar';
import { Question } from '@/types/types';

const ManageQuestions: React.FC = () => {
  const t = useTranslations('Adminlogin');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { questions } = await getAllUserQuestions();
        setQuestions(questions);
        setFilteredQuestions(questions); // Initialize filteredQuestions with all questions
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []); // No dependencies, so it only runs once on mount

  useEffect(() => {
    const filteredQuestions = questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredQuestions(filteredQuestions);
  }, [searchTerm, questions]); // Runs whenever searchTerm or questions change

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container max-w-screen-lg mx-auto justify-between px-6">
      <QuestionNavbar
        unassignedCount={questions.filter(q => q.agency === null).length}
        setSearchTerm={setSearchTerm}
      />
      <div className="pt-6">
        <AdminQuestionBox questions={filteredQuestions} />
      </div>
    </div>
  );
};

export default ManageQuestions;
