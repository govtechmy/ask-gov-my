'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import AnswerQuestionModal from './AnswerQuestionModal';

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

interface QuestionCardProps {
  question: Question;
}

const AnswerQuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const t = useTranslations('Agency');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }) +
      ', ' +
      date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  };

  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(' ');
    return words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '...'
      : text;
  };

  return (
    <>
      <div
        className="bg-white items-center rounded-md border p-4 shadow-sm flex justify-between cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center">
          <div className="text-base font-medium text-black-900">
            {truncateText(question.question, 20)}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="font-normal text-sm text-dim-500">
            {formatDate(question.date)}
          </div>
        </div>
      </div>
      <AnswerQuestionModal
        question={question}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AnswerQuestionCard;
