import Close from '@/icons/close';
import Info from '@/icons/info';
import React, { useEffect, useState } from 'react';

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
  const [visible, setVisible] = useState(false);
  const [animationState, setAnimationState] = useState<'enter' | 'exit'>(
    'enter',
  );

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimationState('enter');
    } else {
      setAnimationState('exit');
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500); // Duration of closing animation
      return () => clearTimeout(timer);
    }
  }, [show]);

  useEffect(() => {
    if (animationState === 'enter') {
      const timer = setTimeout(() => {
        setAnimationState('exit');
      }, 2000); // Time before starting to close
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  useEffect(() => {
    if (animationState === 'exit') {
      const timer = setTimeout(() => {
        onClose();
      }, 500); // Wait for slide out animation to finish
      return () => clearTimeout(timer);
    }
  }, [animationState, onClose]);

  return (
    <>
      {visible && (
        <div
          className={`fixed bottom-6 right-6 bg-white-focuswhite200 
          text-[#A16207] rounded-lg items-center justify-between shadow-button
          transition-opacity duration-300 opacity-100 h-[48px] w-[312px] border-[1px] border-outline-200 overflow-hidden
          ${animationState === 'enter' ? 'animate-slideIn' : 'animate-slideOut'}
          `}
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
          @keyframes slideIn {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes slideOut {
            from {
              transform: translateY(0);
              opacity: 1;
            }
            to {
              transform: translateY(100%);
              opacity: 0;
            }
          }
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
          .animate-slideIn {
            animation: slideIn 0.2s ease-in-out forwards;
          }
          .animate-slideOut {
            animation: slideOut 0.2s ease-in-out forwards;
          }
          .animate-underlineDecline {
            animation: underlineDecline 2s linear forwards;
          }
        `}
      </style>
    </>
  );
};

export default ToastQuestionMarkAsSpam;
