'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitAnswer } from '@/actions/userServices';
import Modal from './Modal';

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: number | null;
  answer: string;
  topics: number[];
  email: string;
  likes: number;
  dislikes: number;
  attachment: string[];
  isopen: boolean;
}

interface QuestionCardProps {
  question: Question;
}

const AnswerQuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const t = useTranslations('Agency');
  const [answer, setAnswer] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setAttachments(files);
  };

  const handleSubmit = async () => {
    try {
      await submitAnswer(question.id, answer, attachments);
      setSuccess('Answer submitted successfully');
      setError(null);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-sm text-gray-500">
          Question posted on {formatDate(question.date)} &nbsp; | &nbsp; ID:{' '}
          {question.id}
        </div>
        <h2 className="text-xl font-semibold mb-4 mt-2">Answer Question</h2>
        <p className="mb-4">{question.question}</p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Answer:
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachments:
          </label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleSubmit}
          >
            Submit Answer
          </button>
        </div>
        {success && <div className="text-green-500 mt-4">{success}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </Modal>
    </>
  );
};

export default AnswerQuestionCard;
