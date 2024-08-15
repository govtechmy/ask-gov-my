import Close from '@/icons/close';
import React, { useEffect, useState, ReactNode } from 'react';

interface ToastProps {
  icon: ReactNode;
  message: string;
  underlineColor: string;
  messageColor: string;
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  icon,
  message,
  underlineColor,
  messageColor,
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
      const timer = setTimeout(() => setAnimationState('exit'), 2000);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('exit');
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  useEffect(() => {
    if (animationState === 'exit') {
      const timer = setTimeout(onClose, 500);
      return () => clearTimeout(timer);
    }
  }, [animationState, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed z-50 bottom-6 right-6 bg-white-focuswhite200 rounded-lg shadow-button transition-opacity duration-300 opacity-100 h-[48px] w-[312px] border-[1px] border-outline-200 overflow-hidden ${animationState === 'enter' ? 'animate-slideIn' : 'animate-slideOut'}`}
    >
      <div className="relative flex items-center h-full">
        <div
          className={`absolute top-[43px] left-0 h-[3px] ${underlineColor} animate-underlineDecline`}
        />
        <div className={`flex items-center w-full px-4 gap-3 ${messageColor}`}>
          {icon}
          <div className="text-sm font-medium">{message}</div>
          <button onClick={onClose} className="ml-auto">
            <Close className="stroke-dim-500" />
          </button>
        </div>
      </div>
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default Toast;
