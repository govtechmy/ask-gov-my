'use client';

import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { editUser } from '@/actions/userServices';
import { Agency, User } from '@/types/types';

interface UserSettingsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  user,
  isOpen,
  onClose,
  agencies,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-semibold mb-4">User Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name:
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role:
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={role}
            onChange={e => setRole(e.target.value as 'staff' | 'super_admin')}
          >
            <option value="staff">Staff</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        {role === 'staff' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agency:
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={agency || ''}
              onChange={e => setAgency(Number(e.target.value))}
            >
              <option value="">Select Agency</option>
              {agencies.map(agency => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
        {success && <div className="text-green-500 mt-4">{success}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </Modal>
  );
};

export default UserSettingsModal;
