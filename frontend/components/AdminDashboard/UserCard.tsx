'use client';

import React, { useState } from 'react';
import { Agency, User } from '@/types/types';
import AgencyLogoImporter from '../common/AgencyLogoImporter';
import ImageNext from 'next/image';
import ThreeDottedEditRemoveUser from './ThreeDottedEditRemoveUser';
import Toast from '../ui/toast';
import TickCheckCircle from '@/icons/tickcheckcircle';

interface UserCardProps {
  user: User;
  onUpdate: () => void;
  agencies: Agency[];
}

const UserCard: React.FC<UserCardProps> = ({ user, onUpdate, agencies }) => {
  const agency = agencies.find(agency => agency.id === user.agency);
  const [showDeleteUserToast, setShowDeleteUserToast] = useState(false);
  const [showEditUserToast, setShowEditUserToast] = useState(false);

  const handleDeleteUserToast = () => setShowDeleteUserToast(true);
  const handleEditUserToast = () => setShowEditUserToast(true);

  return (
    <>
      <div className="h-20 rounded-lg border-[1px] border-outline-200 flex justify-between hover:cursor-pointer w-full bg-white items-center group">
        <div className="flex pl-[18px] flex-grow">
          <div className="h-12 w-12 rounded-full bg-green-300 border-[1px] border-outline-200 items-center justify-center flex">
            {user.name?.charAt(0).toUpperCase() || ''}
            {user.name?.charAt(1).toUpperCase() || ''}
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
            <div className="h-7 text-brand-600 bg-brand-50 rounded-full px-2 py-1 items-center justify-center flex text-sm font-medium mr-[18px]">
              Superadmin
            </div>
          ) : (
            <div className="flex items-center pl-2">
              {agency?.logo_url ? (
                <div className="flex w-8 h-8 relative flex-shrink-0">
                  <AgencyLogoImporter
                    currentAgency={{}}
                    logo_url={agency.logo_url}
                  />
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
              <div className="text-gray-500 ml-3 w-full">{agency?.name}</div>
              <div className="h-7 text-dim-500 bg-washed-100 rounded-full px-2 py-1 items-center justify-center flex text-sm font-medium mr-[18px] ml-3">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
          )}

          <ThreeDottedEditRemoveUser
            user={user}
            onUpdate={onUpdate}
            agencies={agencies}
            handleDeleteUserToast={handleDeleteUserToast}
            handleEditUserToast={handleEditUserToast}
          />
        </div>
        {showDeleteUserToast && (
          <Toast
            message="User successfully deleted!"
            icon={<TickCheckCircle />}
            underlineColor="bg-[#16A34A]"
            messageColor="text-[#15803D] dark:text-[#16A34A]"
            show={showDeleteUserToast}
            onClose={() => setShowDeleteUserToast(false)}
          />
        )}
        {showEditUserToast && (
          <Toast
            message="User sucessfully edited!"
            icon={<TickCheckCircle />}
            underlineColor="bg-[#16A34A]"
            messageColor="text-[#15803D] dark:text-[#16A34A]"
            show={showEditUserToast}
            onClose={() => setShowEditUserToast(false)}
          />
        )}
      </div>
    </>
  );
};

export default UserCard;
