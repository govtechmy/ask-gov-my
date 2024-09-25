import Close from "./icons/close";
import React, { useEffect, useState, ReactNode } from "react";

interface ToastProps {
  icon: ReactNode;
  message: string;
  underlineColor: string;
  messageColor: string;
  show: boolean;
  onClose: () => void;
  time?: number;
}

const Toast: React.FC<ToastProps> = ({
  icon,
  message,
  underlineColor,
  messageColor,
  show,
  onClose,
  time = 2000,
}) => {
  const [visible, setVisible] = useState(false);
  const [animationState, setAnimationState] = useState<"enter" | "exit">(
    "enter"
  );

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimationState("enter");
      const timer = setTimeout(() => setAnimationState("exit"), time);
      return () => clearTimeout(timer);
    } else {
      setAnimationState("exit");
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show, time]);

  useEffect(() => {
    if (animationState === "exit") {
      const timer = setTimeout(onClose, 500);
      return () => clearTimeout(timer);
    }
  }, [animationState, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed z-50 bottom-6 right-6 bg-white-focuswhite200 rounded-lg shadow-button transition-opacity duration-300 opacity-100 h-[48px] border-[1px] border-outline-200 overflow-hidden min-w-[312px] max-w-[80%] ${
        animationState === "enter" ? "animate-slideIn" : "animate-slideOut"
      }`}
    >
      <div className="relative flex items-center h-full">
        <div
          className={`absolute top-[43px] left-0 h-[3px] ${underlineColor} animate-underlineDecline`}
          style={{ animationDuration: `${time}ms` }}
        />
        <div className={`flex items-center w-full px-4 gap-3 ${messageColor}`}>
          {icon}
          <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {message}
          </div>
          <button onClick={onClose} className="ml-auto flex-shrink-0">
            <Close className="stroke-dim-500" />
          </button>
        </div>
      </div>
      <style>{`
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
          animation: underlineDecline linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
