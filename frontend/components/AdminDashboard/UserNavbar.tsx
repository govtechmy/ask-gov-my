'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Search from '@/icons/search';
import AddUserModal from './AddUserModal';
import { cn } from '@/lib/utils';
import PlusIcon from '@/icons/plusicon';
import AgencyListDropdownUsers from './AgencyListDropdownUsers';
import ToastNewUserAdded from './ToastNewUserAdded';
import { Agency } from '@/types/types';
import { getDynamicAgencyMap } from '@/actions/questionServices';

interface UserNavbarProps {
  setSearchTerm: (term: string) => void;
  agencies: Agency[];
  onAddUser: () => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({
  setSearchTerm,
  agencies,
  onAddUser,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'all';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };
  const [isFocused, setIsFocused] = useState(false);
  const [showAddUserToast, setshowAddUserToast] = useState(false);

  useEffect(() => {}, [activeTab]);

  const handleAddUserToast = () => {
    setshowAddUserToast(true);
  };

  const AGENCY_TO_UUID = getDynamicAgencyMap();

  return (
    <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
      <div className="flex space-x-5">
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${activeTab === 'all' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${activeTab === 'superadmin' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('superadmin')}
        >
          Superadmin
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${activeTab === 'staff' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('staff')}
        >
          Staff
        </button>
      </div>
      <div className="flex items-center">
        <AgencyListDropdownUsers AGENCY_TO_UUID={AGENCY_TO_UUID} />
        <div
          className={cn(
            'bg-[#FFFFFF] dark:bg-[#18181B] rounded-md flex items-center h-8 w-[260px] border px-3 py-2 text-sm',
            {
              'shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]':
                isFocused,
            },
          )}
        >
          <input
            type="search"
            placeholder="Search by name or email"
            className="font-normal placeholder:text-dim-500 flex h-11 w-full rounded-md bg-transparent py-3 text-sm pl-2 focus:outline-none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="h-4 w-4 items-center justify-center flex">
            <Search strokeWidth={1.88} className="stroke-[#A1A1AA]" />
          </div>
        </div>
        <div
          className="w-[106px] h-8 rounded-md items-center justify-center flex text-white-forcewhite font-medium text-sm ml-2
            bg-gradient-to-t from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF] border-[1px] border-[#702FF9] hover:cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className=" h-4 w-4 flex items-center justify-center mr-[6px]">
            <PlusIcon className="stroke-white-forcewhite"></PlusIcon>
          </div>
          <div>New user</div>
        </div>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agencies={agencies}
        onAddUser={onAddUser}
        handleAddUserToast={handleAddUserToast}
      />
      {/* onAddUser is not in props. adding in. recheck coz seems not used tho*/}

      {showAddUserToast && (
        <ToastNewUserAdded
          message="New user has been added!"
          show={showAddUserToast}
          onClose={() => setshowAddUserToast(false)}
        />
      )}
    </div>
  );
};

export default UserNavbar;
