'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Search from '@/icons/search';
import AddUserModal from './AddUserModal';
import { cn } from '@/lib/utils';
import PlusIcon from '@/icons/plusicon';
import AgencyListDropdownUsers from './AgencyListDropdownUsers';
import { Agency } from '@/types/types';
import { getDynamicAgencyMap } from '@/actions/questionServices';
import Toast from '../ui/toast';
import TickCheckCircle from '@/icons/tickcheckcircle';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

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
  const [activeTab, setActiveTabState] = useState(
    searchParams.get('tab') || 'all',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddUserToast, setShowAddUserToast] = useState(false);

  const AGENCY_TO_UUID = getDynamicAgencyMap();
  const tabs = ['all', 'superadmin', 'staff'];

  const setActiveTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', tab);
      router.push(`${window.location.pathname}?${params.toString()}`);
      setActiveTabState(tab);
    },
    [router],
  );

  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'all';
    if (currentTab !== activeTab) {
      setActiveTabState(currentTab);
    }
  }, [searchParams, activeTab]);

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
      <div className="flex space-x-5">{tabs.map(renderTabButton)}</div>
      <div className="flex items-center gap-2">
        <AgencyListDropdownUsers AGENCY_TO_UUID={AGENCY_TO_UUID} />
        <div className="flex items-center relative">
          <Input
            type="search"
            placeholder="Search by name or email"
            className="h-8 min-w-[250px] rounded-lg"
            onChange={e => setSearchTerm(e.target.value)}
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
        onAddUser={onAddUser}
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
