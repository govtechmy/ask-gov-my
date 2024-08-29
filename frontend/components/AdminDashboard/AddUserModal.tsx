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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideCloseButton className="w-[600px] p-0 gap-0">
        <DialogHeader className="flex border-b-[1px] border-outline-200">
          <DialogTitle className="p-6 pb-4">Add new user</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-6 border-y-[1px] border-outline-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                type="text"
                value={name}
                required
                onChange={e => handleNameChange(e, setName, setNameError)}
              />
              {nameError && (
                <div className="text-red-500 text-sm mb-4">{nameError}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                required
                onChange={e => handleEmailChange(e, setEmail, setEmailError)}
              />
              {emailError && (
                <div className="text-red-500 text-sm mb-4">{emailError}</div>
              )}
            </div>

            <DropdownRole
              agencies={agencies}
              setRole={setRole}
              setAgency={setAgency}
              roleEmpty={roleEmpty}
            />
          </div>
        </DialogDescription>
        <DialogFooter className="p-6 flex justify-end">
          <Button variant={'secondary'} onClick={onClose}>
            Cancel
          </Button>
          <Button variant={'primary'} onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
        {success && <div className="text-green-500 mt-4 px-6">{success}</div>}
        {error && <div className="text-red-500 mt-4 px-6">{error}</div>}
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
