import Close from '@/icons/close';
import Info from '@/icons/info';
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const ToastQuestionMarkAsSpam: React.FC<ToastProps> = ({
  message,
  show,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <>
      {show && (
        <div
          className="fixed bottom-6 right-6 bg-white-focuswhite200 
          text-[#A16207] rounded-lg items-center justify-between shadow-button
          transition-opacity duration-300 opacity-100 h-[48px] w-[312px] border-[1px] border-outline-200 overflow-hidden"
        >
          <div className="relative flex items-center">
            <div className="absolute top-[43px] left-0 h-[3px] bg-[#CA8A04] animate-underlineDecline"></div>

            <div className="absolute top-0 flex items-center h-[45px] w-[310px] rounded-t-[5px] rounded-b-[5px]">
              <div className="pl-[19px] pr-[15px]">
                <Info
                  className="stroke-[#A16207]"
                  classNameDot="fill-[#A16207]"
                  classNameBox="rotate-180"
                ></Info>
              </div>

              <div className="px-3 text-sm font-medium w-[216px]">
                {message}
              </div>
              <div className="p-3">
                <button onClick={onClose} className="ml-auto">
                  <Close />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
    @keyframes underlineDecline {
      from {
        width: 100%;
        right: 0;
      }
      to {
        width: 0%;
        right: 0;
      }
    }
    .animate-underlineDecline {
      animation: underlineDecline 3s linear forwards;
    }
  `}
      </style>
    </>
  );
};

export default ToastQuestionMarkAsSpam;
