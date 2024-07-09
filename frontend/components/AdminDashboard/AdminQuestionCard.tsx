'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AGENCY_TO_UUID } from '@/lib/agency';
import { assignAgencyToQuestion } from '@/actions/userServices';
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
}

interface QuestionCardProps {
  question: Question;
}

const AdminQuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const t = useTranslations('Agency');
  const [selectedAgency, setSelectedAgency] = useState<string>('Unassigned');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (question.agency !== null) {
      const agencyAcronym = Object.keys(AGENCY_TO_UUID).find(
        key => AGENCY_TO_UUID[key] === question.agency!.toString(),
      );
      if (agencyAcronym) {
        setSelectedAgency(agencyAcronym);
      }
    }
  }, [question.agency]);

  const handleAgencyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newAgencyAcronym = e.target.value;
    const newAgencyId =
      newAgencyAcronym === 'Unassigned'
        ? null
        : AGENCY_TO_UUID[newAgencyAcronym];
    setSelectedAgency(newAgencyAcronym);

    if (newAgencyId !== null) {
      try {
        await assignAgencyToQuestion(question.id, parseInt(newAgencyId));
      } catch (error) {
        console.error('Failed to assign agency to question:', error);
      }
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
          <select
            className="border rounded p-1"
            value={selectedAgency}
            onChange={handleAgencyChange}
          >
            <option value="Unassigned">Unassigned</option>
            {Object.keys(AGENCY_TO_UUID).map(agencyAcronym => (
              <option key={agencyAcronym} value={agencyAcronym}>
                {agencyAcronym}
              </option>
            ))}
          </select>
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
        <h2 className="text-xl font-semibold mb-4 mt-2">Question Details</h2>
        <p className="mb-4">{question.question}</p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign to agency:
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedAgency}
            onChange={handleAgencyChange}
          >
            <option value="Unassigned">Unassigned</option>
            {Object.keys(AGENCY_TO_UUID).map(agencyAcronym => (
              <option key={agencyAcronym} value={agencyAcronym}>
                {agencyAcronym}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </>
  );
};

export default AdminQuestionCard;
