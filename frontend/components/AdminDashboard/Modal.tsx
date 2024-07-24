import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg w-[700px]">{children}</div>
    </div>
  );
};

export default Modal;
