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
  handleAddUserToast: Function;
  handleFailAddUserToast: Function;
  handleErrorToast: Function;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  agencies,
  handleAddUserToast,
  handleFailAddUserToast,
  handleErrorToast,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'staff' | 'super_admin' | 'unassigned'>(
    'unassigned',
  );
  const [agency, setAgency] = useState<number | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [roleEmpty, setRoleEmpty] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (role === 'unassigned') {
      setRoleEmpty(true);
      return;
    }
    if (nameError || emailError) {
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
      } else {
        handleFailAddUserToast();
      }
    } catch (error) {
      handleErrorToast();
      throw error;
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideCloseButton className="w-[600px] p-0 gap-0">
        <DialogHeader>
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
                className={nameError ? 'border-danger-300' : ''}
              />
              {nameError && (
                <div className="text-danger-600 text-sm mb-4">{nameError}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                required
                onChange={e => handleEmailChange(e, setEmail, setEmailError)}
                className={emailError ? 'border-danger-300' : ''}
              />
              {emailError && (
                <div className="text-danger-600 text-sm mb-4">{emailError}</div>
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
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
