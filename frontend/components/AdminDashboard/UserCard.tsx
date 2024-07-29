'use client';

import React, { useState } from 'react';
import UserSettingsModal from './UserSettingsModal';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import { Agency, User } from '@/types/types';

interface UserCardProps {
  user: User;
  onUpdate: () => void;
  agencies: Agency[];
}

const UserCard: React.FC<UserCardProps> = ({ user, onUpdate, agencies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const agency = agencies.find(agency => agency.id === user.agency);

  return (
    <>
      <div
        className="bg-white items-center rounded-md border p-4 shadow-sm flex justify-between cursor-pointer w-full"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center">
          <div className="w-12 h-12 mr-4 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
            {user.name ? user.name[0] : user.email[0]}
          </div>
          <div>
            <div className="text-base font-medium text-black-900">
              {user.name}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
        <div className="flex items-center">
          {user.role === 'super_admin' ? (
            <div className="text-blue-500">Superadmin</div>
          ) : (
            <div className="flex items-center">
              {agency?.logo_url ? (
                <img
                  src={agency.logo_url}
                  alt="Agency Logo"
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <JataNegaraIcon className="w-6 h-6 rounded-full mr-2" />
              )}
              <div className="text-gray-500 mr-2">{agency?.name}</div>
              <div className="text-gray-500">{user.role}</div>
            </div>
          )}
        </div>
      </div>
      <UserSettingsModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onUpdate();
        }}
        agencies={agencies}
      />
    </>
  );
};

export default UserCard;
