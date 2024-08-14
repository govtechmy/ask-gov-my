'use client';

import React, { useState } from 'react';
import { addUser } from '@/actions/userServices';
import DropdownRole from './DropdownRole';
import { Agency } from '@/types/types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
  onAddUser: any;
  handleAddUserToast: Function;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  agencies,
  onAddUser,
  handleAddUserToast,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'staff' | 'super_admin' | 'unassigned'>(
    'unassigned',
  );
  const [agency, setAgency] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [roleEmpty, setRoleEmpty] = useState<boolean>(false);

  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gov\.my$/;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (!nameRegex.test(value)) {
      setNameError('Name cannot contain special symbols or numbers');
    } else {
      setNameError(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError('Email must end with @gov.my');
    } else {
      setEmailError(null);
    }
  };

  const generateHexColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const handleSubmit = async () => {
    if (nameError || emailError) {
      setError('Please fix the errors before submitting');
      return;
    }
    if (role === 'unassigned') {
      setRoleEmpty(true);
      return;
    }
    try {
      const userColor = generateHexColor(name);
      const response = await addUser(
        name,
        email,
        role,
        role === 'super_admin' ? null : agency,
        userColor,
      );
      if (response.success) {
        handleAddUserToast();
        setError(null);
        onClose();
      } else {
        setError(response.message || 'Failed to add user');
        setSuccess(null);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      setSuccess(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="z-20 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg w-[600px]">
        <div className="flex border-b-[1px] border-outline-200">
          <div className="text-black-900 font-semibold text-lg leading-[26px] ml-6 mb-[16px] mt-6 mr-3 h-[26px] w-[350px]">
            Add new user
          </div>
        </div>
        <div>
          <div className="m-6">
            <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
              Full name
            </div>
            <input
              type="text"
              className="bg-white h-10 w-[552px] border-[1px] border-outline-200 rounded-md pl-4
                shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] mb-1
                text-black-900 font-normal text-base focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]"
              value={name}
              required
              onChange={handleNameChange}
            />
            {nameError && (
              <div className="text-red-500 text-sm mb-4">{nameError}</div>
            )}
            <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
              Email
            </div>
            <input
              type="email"
              className="bg-white h-10 w-[552px] border-[1px] border-outline-200 rounded-md 
                shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] mb-1
                text-black-900 font-normal text-base pl-4 focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]"
              value={email}
              required
              onChange={handleEmailChange}
            />
            {emailError && (
              <div className="text-red-500 text-sm mb-4">{emailError}</div>
            )}
            <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
              Role
            </div>
            <DropdownRole
              agencies={agencies}
              setRole={setRole}
              setAgency={setAgency}
              roleEmpty={roleEmpty}
            />
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

export default AddUserModal;
