'use client';

import React, { useState } from 'react';
import { addUser } from '@/actions/userServices';
import DropdownRole from './DropdownRole';
import { Agency } from '@/types/types';
import {
  handleNameChange,
  handleEmailChange,
} from '@/actions/userInputValidation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { generateHexColor } from '@/actions/utils';

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
            <Label>Full name</Label>
            <Input
              type="text"
              value={name}
              required
              onChange={e => handleNameChange(e, setName, setNameError)}
            ></Input>
            {nameError && (
              <div className="text-red-500 text-sm mb-4">{nameError}</div>
            )}
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              required
              onChange={e => handleEmailChange(e, setEmail, setEmailError)}
            ></Input>
            {emailError && (
              <div className="text-red-500 text-sm mb-4">{emailError}</div>
            )}
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
            <Button variant={'secondary'} onClick={onClose}>
              Cancel
            </Button>
            <Button variant={'primary'} onClick={handleSubmit}>
              Save
            </Button>
          </div>
          {success && <div className="text-green-500 mt-4">{success}</div>}
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
