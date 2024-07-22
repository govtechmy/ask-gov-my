'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { getAllUserQuestions } from '@/actions/userServices';
import AdminQuestionBox from '@/components/AdminDashboard/AdminQuestionBox';
import QuestionNavbar from '@/components/AdminDashboard/QuestionNavbar';
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

const ManageQuestions: React.FC = () => {
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
      q.question.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="flex flex-col flex-grow items-center justify-center py-12">
      <QuestionNavbar unassignedCount={unassignedCount} setSearchTerm={setSearchTerm} />
      <div className="w-full flex py-12">
        <AdminQuestionBox questions={filteredQuestions} />
      </div>
    </div>
  );
};

export default ManageQuestions;
