import Close from '@/icons/close';
import React, { useState } from 'react';
import ToastQuestionMarkAsUnSpam from './ToastQuestionMarkAsUnSpam';
import { unSpamQuestion } from '@/actions/userServices';
import { Question } from '@/types/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
}

const ModalMarkAsUnSpam: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  question,
}) => {
  if (!isOpen) return null;

  const [showToast, setShowToast] = useState(false);

  const ToastQuestionMarkAsUnSpamTrigger = () => {
    setShowToast(true);
  };
  //REPAIR THIS ONE BELOW
  async function calltrigger() {
    await unSpamQuestion(question.id);
    question.state = 'backlog';
  }
  return (
    <div className="z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg h-[170px] w-[400px]">
        <div>
          <div className="text-black-900 text-lg font-semibold leading-[26px] px-6 pt-6">
            Mark question as not spam?
          </div>
          <div className="text-black-700 text-sm  font-normal pt-2 px-6">
            Are you sure to mark this question as not spam?
          </div>
        </div>
        <div className="flex">
          <button
            onClick={onClose}
            className="h-[44px] w-[77px] border-[1px] border-outline-200 shadow-button rounded-lg text-base items-center justify-center flex ml-[123px] mt-6 mr-[12px]"
          >
            Cancel
          </button>
          <button
            className="w-[164px] h-[44px] rounded-lg items-center justify-center flex mt-6 py-2
             text-base font-normal  text-white-forcewhite bg-gradient-to-t from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF]
              border-[1px] border-[#702FF9]"
            onClick={calltrigger}
          >
            Mark as Not Spam
          </button>
          {showToast && (
            <ToastQuestionMarkAsUnSpam
              message="Question marked as not spam"
              show={showToast}
              onClose={() => setShowToast(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalMarkAsUnSpam;
