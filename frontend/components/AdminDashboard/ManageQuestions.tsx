'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { getAllUserQuestions } from '@/actions/userServices';
import AdminQuestionBox from '@/components/AdminDashboard/AdminQuestionBox';
import QuestionNavbar from '@/components/AdminDashboard/QuestionNavbar';
import { Question } from '@/types/types';
import ToastQuestionMarkAsSpam from './ToastQuestionMarkAsSpam';
import ToastQuestionMarkAsUnSpam from './ToastQuestionMarkAsUnSpam'; // Import the new toast component

const ManageQuestions: React.FC = () => {
  const t = useTranslations('Adminlogin');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToastSpam, setShowToastSpam] = useState(false);
  const [showToastUnSpam, setShowToastUnSpam] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { questions } = await getAllUserQuestions();
        setQuestions(questions);
        setFilteredQuestions(questions); // Initialize filteredQuestions with all questions
        setUnassignedCount(questions.filter(q => q.agency === null).length);
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

  const ToastQuestionMarkAsSpamTrigger = () => {
    setShowToastSpam(true);
  };

  const ToastQuestionMarkAsUnSpamTrigger = () => {
    setShowToastUnSpam(true);
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container">
      <QuestionNavbar
        unassignedCount={unassignedCount}
        setSearchTerm={setSearchTerm}
      />
      <div className="pt-6">
        <AdminQuestionBox questions={filteredQuestions} />
      </div>
      <div
        className="test-div cursor-pointer p-4 bg-blue-500 text-white text-center mt-4"
        onClick={ToastQuestionMarkAsSpamTrigger}
      >
        Click me to trigger spam toast
      </div>
      <div
        className="test-div cursor-pointer p-4 bg-green-500 text-white text-center mt-4"
        onClick={ToastQuestionMarkAsUnSpamTrigger}
      >
        Click me to trigger not spam toast
      </div>
      {showToastSpam && (
        <ToastQuestionMarkAsSpam
          message="Question marked as spam"
          show={showToastSpam}
          onClose={() => setShowToastSpam(false)}
        />
      )}
      {showToastUnSpam && (
        <ToastQuestionMarkAsUnSpam
          message="Question marked as not spam"
          show={showToastUnSpam}
          onClose={() => setShowToastUnSpam(false)}
        />
      )}
    </div>
  );
};

export default ManageQuestions;
