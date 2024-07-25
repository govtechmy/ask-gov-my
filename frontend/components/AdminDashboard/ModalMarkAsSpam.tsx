import Close from '@/icons/close';
import React, { useState } from 'react';
import ToastQuestionMarkAsSpam from './ToastQuestionMarkAsSpam';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalMarkAsSpam: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [showToast, setShowToast] = useState(false);
  const ToastQuestionMarkAsSpamTrigger = () => {
    setShowToast(true);
  };

  return (
    <div className="z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg h-[170px] w-[400px]">
        <div className="relative">
          {/* <button
            onClick={onClose}
            className="absolute top-2 right-2 hover:cursor-pointer rounded-lg shadow-button h-8 w-8 flex items-center justify-center border-[1px] border-outline-200"
          >
            <Close className="stroke-black-900" />
          </button> */}
        </div>
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
            className="h-[44px] w-[77px] border-[1px] border-outline-200 shadow-button rounded-lg text-base items-center justify-center flex ml-[154px] mt-6 mr-[12px]"
          >
            cancel
          </button>
          <div
            className="w-[133px] h-[44px] bg-[#DC2626] text-white-forcewhite text-base rounded-lg items-center justify-center flex mt-6 "
            onClick={ToastQuestionMarkAsSpamTrigger}
          >
            Mark as Spam
          </div>
          {showToast && (
            <ToastQuestionMarkAsSpam
              message="Question marked as spam"
              show={showToast}
              onClose={() => setShowToast(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalMarkAsSpam;
