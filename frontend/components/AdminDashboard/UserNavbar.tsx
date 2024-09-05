'use client'
import React, { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Search from '@/icons/search';
import AddUserModal from './AddUserModal';
import { cn } from '@/lib/utils';
import PlusIcon from '@/icons/plusicon';
import AgencyListDropdownUsers from './AgencyListDropdownUsers';
import { Agency } from '@/types/types';
import Toast from '../ui/toast';
import TickCheckCircle from '@/icons/tickcheckcircle';

interface UserNavbarProps {
  currentTab: string;
  searchTerm: string;
  agencies: Agency[];
}

const UserNavbar: React.FC<UserNavbarProps> = ({ currentTab, searchTerm, agencies }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTabState] = useState(currentTab || 'all');
  const [searchValue, setSearchValue] = useState(searchTerm || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showAddUserToast, setShowAddUserToast] = useState(false);
  const selectedAgencyId = searchParams.get('agencyId') || '';

  const setActiveTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      params.delete('page');
      params.delete('searchTerm');
      setSearchValue('');
      router.push(`${window.location.pathname}?${params.toString()}`);
      setActiveTabState(tab);
    },
    [router, searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchValue(term);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('searchTerm', term);
    } else {
      params.delete('searchTerm');
    }
    params.delete('page');
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const handleAgencyChange = (agencyId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (agencyId) {
      params.set('agencyId', agencyId);
    } else {
      params.delete('agencyId');
    }
    params.delete('page');
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const handleAddUserToast = () => {
    setShowAddUserToast(true);
  };

  return (
    <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
      <div className="flex space-x-5">
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${
            activeTab === 'all' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${
            activeTab === 'superadmin' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'
          }`}
          onClick={() => setActiveTab('superadmin')}
        >
          Superadmin
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${
            activeTab === 'staff' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'
          }`}
          onClick={() => setActiveTab('staff')}
        >
          Staff
        </button>
      </div>
      <div className="flex items-center">
        <AgencyListDropdownUsers
          agencies={agencies}
          selectedAgencyId={selectedAgencyId}
          handleAgencyChange={handleAgencyChange}
        />
        <div
          className={cn(
            'bg-[#FFFFFF] dark:bg-[#18181B] rounded-md flex items-center h-8 w-[260px] border px-3 py-2 text-sm',
            {
              'shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]': isFocused,
            }
          )}
        >
          <input
            type="search"
            placeholder="Search by name or email"
            value={searchValue}
            className="font-normal placeholder:text-dim-500 flex h-11 w-full rounded-md bg-transparent py-3 text-sm pl-2 focus:outline-none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleSearchChange}
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
        handleAddUserToast={handleAddUserToast}
      />

      {showAddUserToast && (
        <Toast
          message="New user has been added!"
          icon={<TickCheckCircle />}
          underlineColor="bg-[#16A34A]"
          messageColor="text-[#15803D] dark:text-[#16A34A]"
          show={showAddUserToast}
          onClose={() => setShowAddUserToast(false)}
        />
      )}
    </div>
  );
};

export default UserNavbar;
