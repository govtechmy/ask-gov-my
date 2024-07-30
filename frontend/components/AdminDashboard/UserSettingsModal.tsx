'use client';

import React, { useEffect, useState } from 'react';
import { editUser } from '@/actions/userServices';
import { Agency, User } from '@/types/types';
import DropdownRole from './DropdownRole';

interface UserSettingsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
  handleEditUserToast: Function;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  user,
  isOpen,
  onClose,
  agencies,
  handleEditUserToast,
}) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [agency, setAgency] = useState<number | null>(user.agency);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email);
    setRole(user.role);
    setAgency(user.agency);
  }, [user]);

  const handleSubmit = async () => {
    try {
      await editUser(user.id, name, email, role, agency);
      handleEditUserToast();
      setSuccess('User updated successfully');

      setError(null);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setSuccess(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg w-[600px]">
        <div className="flex border-b-[1px] border-outline-200 items-center justify-between">
          <div className="text-black-900 font-semibold text-lg leading-[26px] ml-6 mb-[16px] mt-6 mr-3 h-[26px]">
            User setting
          </div>
          <div className="text-dim-500 text-sm pt-[8px] font-normal mr-6 flex items-center">
            Last updated on{' '}
            {new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </div>
        </div>
        <div>
          <div className=" m-6 ">
            <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
              Full name
            </div>
            <input
              type="text"
              className="bg-white h-10 w-[552px] border-[1px] border-outline-200 rounded-md pl-4
                shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] mb-6
                text-black-900 font-normal text-base focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]"
              value={name}
              required
              onChange={e => setName(e.target.value)}
            />
            <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
              Email
            </div>
            <input
              type="email"
              className="bg-white h-10 w-[552px] border-[1px] border-outline-200 rounded-md 
                shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] mb-6
                text-black-900 font-normal text-base pl-4 focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />
            <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
              Role
            </div>
            <DropdownRole agencies={agencies} setRole={setRole} user={user} />
          </div>
        </div>
        <div>
          <div className="py-6 flex justify-end pr-6 border-t-[1px] border-outline-200">
            <button
              className="mr-3 h-[44px] w-[77px] border-[1px] border-outline-200 shadow-button rounded-md 
              text-base items-center justify-center flex hover:cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="w-[77px] h-[44px] rounded-lg items-center justify-center flex text-base font-normal  text-white-forcewhite 
             bg-gradient-to-t from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF]
              border-[1px] border-[#702FF9] hover:cursor-pointer shadow-button"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
          {success && <div className="text-green-500 mt-4">{success}</div>}
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;
