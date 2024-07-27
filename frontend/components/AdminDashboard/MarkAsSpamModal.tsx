import Close from '@/icons/close';
import React, { useState } from 'react';
import ToastQuestionMarkAsSpam from './ToastQuestionMarkAsSpam';
import { markQuestionAsSpam } from '@/actions/userServices';
import { Question } from '@/types/types';
import { on } from 'nodemailer/lib/xoauth2';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  handleMarkAsSpamToast: Function;
}

const MarkAsSpamModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  question,
  handleMarkAsSpamToast,
}) => {
  if (!isOpen) return null;

  async function markAsSpam() {
    await markQuestionAsSpam(question.id);
    question.state = 'spam';
    handleMarkAsSpamToast();
    onClose();
  }
  return (
    <div className="z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg h-[170px] w-[400px]">
        <div>
          <div className="text-black-900 text-lg font-semibold leading-[26px] px-6 pt-6">
            Mark question as spam?
          </div>
          <div className="text-black-700 text-sm  font-normal pt-2 px-6">
            Are you sure to mark this question as spam?
          </div>
        </div>
        <div className="flex">
          <button
            onClick={onClose}
            className="h-[44px] w-[77px] border-[1px] border-outline-200 shadow-button rounded-lg text-base items-center justify-center flex ml-[154px] mt-6 mr-[12px] hover:cursor-pointer"
          >
            cancel
          </button>
          <div
            className="w-[133px] h-[44px] bg-[#DC2626] text-white-forcewhite text-base rounded-lg items-center justify-center flex mt-6 hover:cursor-pointer"
            //onClick={ToastQuestionMarkAsSpamTrigger}
            //fail
            onClick={markAsSpam}
          >
            Mark as Spam
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAsSpamModal;
