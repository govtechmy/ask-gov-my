'use client';
import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Search from '@/icons/search';
import AddUserModal from './AddUserModal';
import { cn } from '@/lib/utils';
import PlusIcon from '@/icons/plusicon';
import AgencyListDropdownUsers from './AgencyListDropdownUsers';
import { Agency } from '@/types/types';
import Toast from '../ui/toast';
import TickCheckCircle from '@/icons/tickcheckcircle';
import { useRouter } from '@/lib/i18n';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface UserNavbarProps {
  agencies: Agency[];
}

const UserNavbar: React.FC<UserNavbarProps> = ({ agencies }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get('tab') || 'all';
  const searchTerm = searchParams.get('searchTerm') || '';
  const selectedAgencyId = searchParams.get('agencyId') || '';

  const [activeTab, setActiveTabState] = useState(currentTab);
  const [searchValue, setSearchValue] = useState(searchTerm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddUserToast, setShowAddUserToast] = useState(false);

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
    [router, searchParams],
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

  const renderTabButton = (tab: string) => (
    <button
      key={tab}
      className={cn(
        'font-medium text-sm pb-3 -mb-5',
        activeTab === tab
          ? 'text-black-900 border-b-2 border-askmygovbrand-600'
          : 'text-dim-500',
      )}
      onClick={() => {
        if (activeTab !== tab) setActiveTab(tab);
      }}
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  );

  return (
    <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
      <div className="flex space-x-5">
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${
            activeTab === 'all'
              ? 'text-black-900 border-b-2 border-[#702FF9]'
              : 'text-dim-500'
          }`}
          onClick={() => {
            if (activeTab !== 'all') setActiveTab('all');
          }}
        >
          All
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${
            activeTab === 'superadmin'
              ? 'text-black-900 border-b-2 border-[#702FF9]'
              : 'text-dim-500'
          }`}
          onClick={() => {
            if (activeTab !== 'superadmin') setActiveTab('superadmin');
          }}
        >
          Superadmin
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${
            activeTab === 'staff'
              ? 'text-black-900 border-b-2 border-[#702FF9]'
              : 'text-dim-500'
          }`}
          onClick={() => {
            if (activeTab !== 'staff') setActiveTab('staff');
          }}
        >
          Staff
        </button>
      </div>
      <div className="flex items-center relative">
        <AgencyListDropdownUsers
          agencies={agencies}
          selectedAgencyId={selectedAgencyId}
          handleAgencyChange={handleAgencyChange}
        />
        <div>
          <Input
            type="search"
            placeholder="Search by name or email"
            className="h-8 min-w-[250px] rounded-lg"
            onChange={handleSearchChange}
          ></Input>
          <Search
            className="absolute right-[8px] top-[6px] text-outline-400"
            height="16"
            width="16"
          />
        </div>
        <Button
          variant={'primary'}
          className="h-8"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon
            className="stroke-white-forcewhite"
            width="16"
            height="16"
          ></PlusIcon>
          New user
        </Button>
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
