'use client';

import React, { useState } from 'react';
import UserSettingsModal from './UserSettingsModal';
import { Agency, User } from '@/types/types';
import AgencyLogoImporter from '../AgencyLogoImporter';
import ImageNext from 'next/image';

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
        className="h-20  rounded-lg border-[1px] border-outline-200 flex justify-between hover:cursor-pointer w-full bg-white items-center"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex pl-[18px]">
          <div className="h-12 w-12 rounded-full bg-green-300 border-[1px] border-outline-200 items-center justify-center flex">
            {user.name?.[0] || ''}
            {user.name?.[1] || ''}
          </div>
          <div className="pl-3">
            <div className="font-medium text-base text-black-900">
              {user.name}
            </div>
            <div className="font-normal text-base text-dim-500">
              {user.email}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {user.role === 'super_admin' ? (
            <div
              className="h-7 text-brand-600 bg-brand-50 rounded-full px-2 py-1 items-center- justify-center flex
             text-sm font-medium mr-[18px]"
            >
              Superadmin
            </div>
          ) : (
            <div className="flex items-center">
              {agency?.logo_url ? (
                <div className="flex w-8 h-8 relative flex-shrink-0">
                  <AgencyLogoImporter
                    currentAgency={{}}
                    logo_url={agency.logo_url}
                  ></AgencyLogoImporter>
                </div>
              ) : (
                <div className="w-8 h-8 relative flex-shrink-0">
                  <div className="absolute h-full w-full rounded-full border-[1px] border-outline-200 bg-transparent"></div>
                  <div className="flex items-center justify-center h-full w-full overflow-hidden rounded-full">
                    <ImageNext
                      src="/jata-200-transparent.png"
                      width={200}
                      height={200}
                      alt="JataNegara"
                    />
                  </div>
                </div>
              )}
              <div className="text-gray-500 ml-3">{agency?.name}</div>
              <div
                className="h-7 text-dim-500 bg-washed-100 rounded-full px-2 py-1 items-center- justify-center flex
             text-sm font-medium mr-[18px] ml-3"
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
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

{
  /* <div className="flex items-center">
<div className="w-12 h-12 mr-4 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
  {user.name ? user.name[0] : user.email[0]}
</div>
<div>
  <div className="text-base font-medium text-black-900">
    {user.name}
  </div>
  <div className="text-sm text-gray-500">{user.email}</div>
</div>
</div> */
}
