import React from 'react';

import { markQuestionAsSpam } from '@/actions/userServices';
import { User } from '@/types/types';
import { deleteUser } from '@/actions/userServices';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  handleDeleteUserToast: Function;
}

const MarkAsDeleteModal: React.FC<ModalProps> = ({
  isOpen,
  user,
  onClose,
  handleDeleteUserToast,
}) => {
  if (!isOpen) return null;

  async function markAsDelete() {
    const response = await deleteUser(user.id);
    if (response.success) {
      handleDeleteUserToast();
      onClose();
    } else {
      console.error(response.message || 'Unknown error occurred');
      // Handle the error case as needed, e.g., showing an error message to the user
    }
  }
  return (
    <div className="z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg h-[190px] w-[400px]">
        <div>
          <div className="text-black-900 text-lg font-semibold leading-[26px] px-6 pt-6">
            Delete user?
          </div>
          <div className="text-black-700 text-sm  font-normal pt-2 px-6">
            Are you sure to delete user? Once deleted, it can&apos;t be
            retrieved.
          </div>
        </div>
        <div className="flex">
          <button
            onClick={onClose}
            className="h-[44px] w-[77px] border-[1px] border-outline-200 shadow-button rounded-lg text-base items-center justify-center flex ml-[133px] mt-6 mr-[12px] hover:cursor-pointer"
          >
            Cancel
          </button>
          <div
            className="w-[154px] h-[44px] bg-[#DC2626] text-white-forcewhite text-base rounded-lg items-center justify-center flex mt-6 hover:cursor-pointer"
            onClick={markAsDelete}
          >
            Confirm & Delete
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAsDeleteModal;
