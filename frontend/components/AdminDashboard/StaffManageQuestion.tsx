'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { getAllUserQuestions } from '@/actions/userServices';
import StaffQuestionBox from '@/components/AdminDashboard/StaffQuestionBox';
import StaffQuestionNavbar from '@/components/AdminDashboard/StaffQuestionNavbar';
import { Question } from '@/types/types';

const StaffManageQuestions: React.FC = () => {
  const t = useTranslations('Adminlogin');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { questions } = await getAllUserQuestions();
        setQuestions(questions);
        setFilteredQuestions(questions); // Initialize filteredQuestions with all questions
        setUnassignedCount(questions.filter(q => q.agency === null).length);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          setError(error.message);
        } else {
          console.log('An unknown error occurred');
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const filteredQuestions = questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredQuestions(filteredQuestions);
  }, [searchTerm, questions]);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container max-w-screen-lg px-6 mx-auto justify-between">
      <StaffQuestionNavbar
        unassignedCount={unassignedCount}
        setSearchTerm={setSearchTerm}
      />
      <div className="pt-6">
        <StaffQuestionBox questions={filteredQuestions} />
      </div>
    </div>
  );
};

export default StaffManageQuestions;
