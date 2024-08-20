'use client';

import React, { useState } from 'react';
import AnswerQuestionModal from './AnswerQuestionModal';
import { changeStaffIsOpen } from '@/actions/userServices';
import { Question } from '@/types/types';
import NewUpdateIcon from '@/icons/new';
import DraftUpdateIcon from '@/icons/draft';

interface QuestionCardProps {
  question: Question;
}

const AnswerQuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStaffOpen, setIsStaffOpen] = useState(question.staff_isopen);

  const handleCardClick = async () => {
    setIsModalOpen(true);
    if (!question.admin_isopen) {
      try {
        await changeStaffIsOpen(question.id);
        question.admin_isopen = true;
      } catch (error) {
        console.error('Failed to change admin_isopen:', error);
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
  return (
    <>
      <div
        className="bg-white items-center rounded-md border p-4 shadow-sm flex justify-between w-full group"
        onClick={handleCardClick}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 pr-1">
            {question.staff_isopen === false && question.state !== 'spam' && (
              <div className="w-16 h-8 items-center justify-center flex">
                <NewUpdateIcon
                  classNamePath="fill-[#F0FDF4] dark:fill-[#052E16]"
                  classNameCircle="fill-[#15803D] dark:fill-[#16A34A]"
                  classNamePath2="fill-[#15803D] dark:fill-[#16A34A]"
                />
              </div>
            )}
            {/* {question.staff_isopen === true &&
              question.state !== 'spam' &&
              question.state !== 'draft' && (
                <div className="h-[22px] w-[55px]"></div>
              )} */}
            {question.state === 'draft' && (
              <div className="w-16 h-8 items-center justify-center flex">
                <DraftUpdateIcon
                  classNamePath="fill-washed-100"
                  classNameCircle="fill-dim-500"
                  classNamePath2="fill-dim-500"
                ></DraftUpdateIcon>
              </div>
            )}
          </div>
          <div
            className="text-sm font-medium text-black-700 line-clamp-2 hover:cursor-pointer"
            onClick={handleCardClick}
          >
            {question.question}
          </div>
        </div>

        <div className="flex items-center"></div>

        <div className="font-normal text-sm text-dim-500 w-[180px] pl-3 flex-shrink-0">
          {formatDate(question.date)}
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
