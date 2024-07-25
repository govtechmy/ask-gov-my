import Close from '@/icons/close';
import Info from '@/icons/info';
import TickCheckCircle from '@/icons/tickcheckcircle';
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const ToastQuestionMarkAsUnSpam: React.FC<ToastProps> = ({
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
          text-[#A16207] rounded-lg items-center  shadow-button
          transition-opacity duration-300 opacity-100 h-[48px] w-[312px] border-[1px] border-outline-200 overflow-hidden
          ${animationState === 'enter' ? 'animate-slideIn' : 'animate-slideOut'}
          `}
        >
          <div className="relative flex items-center">
            <div className="absolute top-[43px] left-0 h-[3px] bg-[#16A34A] animate-underlineDecline"></div>

            <div className="absolute top-0 flex items-center h-[45px] w-[310px] rounded-t-[5px] rounded-b-[5px]">
              <div className="ml-[15px] h-6 w-6 flex items-center justify-center ">
                <TickCheckCircle className="stroke-[#15803D] dark:stroke-[#16A34A]"></TickCheckCircle>
              </div>

              <div className="px-3 text-sm font-medium w-[240px] text-[#15803D] dark:text-[#16A34A]">
                {message}
              </div>
              <div className="">
                <button onClick={onClose} className="">
                  <Close className="stroke-dim-500" />
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

export default ToastQuestionMarkAsUnSpam;
