'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { uploadFile } from '@/actions/fileServices';
import { submitAnswer, saveQuestionAsDraft } from '@/actions/userServices';
import Modal from './Modal';

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

interface AnswerQuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
}

const AnswerQuestionModal: React.FC<AnswerQuestionModalProps> = ({
  question,
  isOpen,
  onClose,
}) => {
  const [answer, setAnswer] = useState(question.answer || '');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<string[]>(
    question.attachments || [],
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAnswer(question.answer || '');
  }, [question.answer]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedAttachment = (index: number) => {
    setUploadedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const attachmentUrls: string[] = [];
      for (const file of attachments) {
        const url = await uploadFile(file);
        attachmentUrls.push(url);
      }

      await submitAnswer(question.id, answer, [
        ...uploadedAttachments,
        ...attachmentUrls,
      ]);
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

  const handleSaveDraft = async () => {
    try {
      const attachmentUrls: string[] = [];
      for (const file of attachments) {
        const url = await uploadFile(file);
        attachmentUrls.push(url);
      }

      await saveQuestionAsDraft(question.id, answer, [
        ...uploadedAttachments,
        ...attachmentUrls,
      ]);
      setSuccess('Draft saved successfully');
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
          Question posted {new Date(question.date).toLocaleDateString()} &nbsp;
          | &nbsp; ID: {question.id}
        </div>
        <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Write a concise response to this question:
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Write a concise response to this question"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supporting attachments:
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Supported formats: JPG, PNG, PDF. Maximum size: 25MB per file.
          </p>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center p-2 border rounded">
              <span className="mr-2">{file.name}</span>
              <button
                onClick={() => handleRemoveAttachment(index)}
                className="text-red-500"
              >
                &times;
              </button>
            </div>
          ))}
          {uploadedAttachments.map((url, index) => (
            <div key={index} className="flex items-center p-2 border rounded">
              <span className="mr-2">{url.split('/').pop()}</span>
              <button
                onClick={() => handleRemoveUploadedAttachment(index)}
                className="text-red-500"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleSaveDraft}
          >
            Save as Draft
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
