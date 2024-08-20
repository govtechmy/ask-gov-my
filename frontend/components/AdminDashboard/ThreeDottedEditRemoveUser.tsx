'use client';

import ThreeDotted from '@/icons/threedotted';
import { useEffect, useState } from 'react';
import Pencil from '@/icons/pencil';
import TrashIcon from '@/icons/trashicon';
import { User, Agency } from '@/types/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { deleteUser, editUser } from '@/actions/userServices';
import DropdownRole from './DropdownRole';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ThreeProps {
  user: User;
  onUpdate: () => void;
  agencies: Agency[];
  handleDeleteUserToast: () => void;
  handleEditUserToast: () => void;
}

const ThreeDottedEditRemoveUser: React.FC<ThreeProps> = ({
  user,
  onUpdate,
  agencies,
  handleDeleteUserToast,
  handleEditUserToast,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalEditUserOpen, setIsModalEditUserOpen] = useState(false);
  const [isModalDeleteUserOpen, setIsModalDeleteUserOpen] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<'staff' | 'super_admin'>(
    user.role as 'staff' | 'super_admin',
  );
  const [agency, setAgency] = useState<number | null>(user.agency);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDropdownClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email);
    setRole(user.role as 'staff' | 'super_admin');
    setAgency(user.agency);
  }, [user]);

  async function markAsDelete() {
    const response = await deleteUser(user.id);
    if (response.success) {
      handleDeleteUserToast();
      setIsModalDeleteUserOpen(false);
    } else {
      console.error(response.message || 'Unknown error occurred');
    }
  }

  const handleSubmit = async () => {
    try {
      await editUser(user.id, name, email, role, agency);
      handleEditUserToast();
      setSuccess('User updated successfully');
      setError(null);
      setIsModalEditUserOpen(false);
      onUpdate();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setSuccess(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="size-9">
        <Button
          className={cn('top-[-16px] right-[18px]')}
          variant={'icon-threedot'}
          size={'icon'}
          onClick={handleDropdownClick}
        >
          <ThreeDotted />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <Dialog
          open={isModalEditUserOpen}
          onOpenChange={setIsModalEditUserOpen}
        >
          <DialogTrigger asChild className="text-black-900 text-sm">
            <Button variant={'tertiary-dropdown'}>
              <Pencil />
              Edit
            </Button>
          </DialogTrigger>

          <DialogContent hideCloseButton className="w-[600px] p-0 gap-0">
            <DialogHeader>
              <DialogTitle className="p-6 pb-4">
                User setting
                <div className="text-dim-500 text-sm font-normal flex items-center">
                  Last updated on{' '}
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>
              </DialogTitle>
              <DialogDescription className="p-6 border-y-[1px] border-outline-200">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      value={name}
                      placeholder="Enter your full name"
                      onChange={e => setName(e.target.value)}
                      className="bg-white shadow-button"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      value={email}
                      type="email"
                      placeholder="Enter your email"
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <DropdownRole
                    agencies={agencies}
                    setRole={setRole}
                    setAgency={setAgency}
                    roleEmpty={false}
                    user={user}
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="p-6 flex justify-end">
              <Button
                variant={'secondary'}
                onClick={() => setIsModalEditUserOpen(false)}
              >
                Cancel
              </Button>
              <Button variant={'primary'} onClick={handleSubmit}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isModalDeleteUserOpen}
          onOpenChange={setIsModalDeleteUserOpen}
        >
          <DialogTrigger>
            <DialogTrigger asChild className="text-danger-600 text-sm">
              <Button variant={'tertiary-dropdown'}>
                <TrashIcon />
                Delete
              </Button>
            </DialogTrigger>
          </DialogTrigger>

          <DialogContent hideCloseButton className="w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete User?</DialogTitle>
              <DialogDescription>
                Are you sure to delete user? Once deleted, it can&apos;t be
                retrieved.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant={'secondary'}
                onClick={() => setIsModalDeleteUserOpen(false)}
              >
                Cancel
              </Button>
              <Button variant={'danger-primary'} onClick={markAsDelete}>
                Confirm & Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};

export default ThreeDottedEditRemoveUser;
