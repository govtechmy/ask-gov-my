'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { uploadFile } from '@/actions/fileServices';
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

interface AnswerQuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
}

const AnswerQuestionModal: React.FC<AnswerQuestionModalProps> = ({ question, isOpen, onClose }) => {
  const t = useTranslations('Agency');
  const [answer, setAnswer] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setAttachments(files);
  };

  const handleSubmit = async () => {
    try {
      const attachmentUrls: string[] = [];
      for (const file of attachments) {
        const url = await uploadFile(file);
        attachmentUrls.push(url);
      }

      await submitAnswer(question.id, answer, attachmentUrls);
      setSuccess('Answer submitted successfully');
      setError(null);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setSuccess(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="text-sm text-gray-500 mb-4">
          Question posted {new Date(question.date).toLocaleDateString()} &nbsp; | &nbsp; ID: {question.id}
        </div>
        <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">Write a concise response to this question:</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write a concise response to this question"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Supporting attachments:</label>
          <p className="text-xs text-gray-500 mb-1">Supported formats: JPG, PNG, PDF. Maximum size: 25MB per file.</p>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleSubmit}
          >
            Publish now
          </button>
        </div>
        {success && <div className="text-green-500 mt-4">{success}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </Modal>
  );
};

export default AnswerQuestionModal;
