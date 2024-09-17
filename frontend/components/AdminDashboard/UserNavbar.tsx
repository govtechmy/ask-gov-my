'use client';
import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Search from '@/icons/search';
import AddUserModal from './AddUserModal';
import { cn } from '@/lib/utils';
import PlusIcon from '@/icons/plusicon';
import { Agency } from '@/types/types';
import Toast from '../ui/toast';
import TickCheckCircle from '@/icons/tickcheckcircle';
import AlarmTriangle from '@/icons/alarmtriangle';
import { usePathname, useRouter } from '@/lib/i18n';
import { Input } from '../ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { AgencySearchList } from './AgencySearchList';
import { Button } from '@/components/ui/button';
import ChevronDown from '@/icons/ChevronDown';

interface UserNavbarProps {
  agencies: Agency[];
}

const UserNavbar: React.FC<UserNavbarProps> = ({ agencies }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get('tab') || 'all';
  const searchTerm = searchParams.get('searchTerm') || '';
  const selectedAgencyId = searchParams.has('agencyId')
    ? Number.parseInt(searchParams.get('agencyId') as string)
    : null;

  const [activeTab, setActiveTabState] = useState(currentTab);
  const [searchValue, setSearchValue] = useState(searchTerm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddUserToast, setShowAddUserToast] = useState(false);
  const [showFailAddUserToast, setShowFailAddUserToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [openAgencyPopover, setOpenAgencyPopover] = useState(false);

  const selectedAgency = agencies.find(
    agency => agency.id === selectedAgencyId,
  );

  const setActiveTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      params.delete('page');
      params.delete('searchTerm');
      setSearchValue('');
      router.push(`${pathname}?${params.toString()}`);
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
    router.push(`${pathname}?${params.toString()}`);
  };

  const filterByAgency = (agencyId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    params.set('agencyId', agencyId.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeAgencyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    params.delete('agencyId');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleAddUserToast = () => {
    setShowAddUserToast(true);
  };
  const handleFailAddUserToast = () => {
    setShowFailAddUserToast(true);
  };
  const handleErrorToast = () => {
    setShowErrorToast(true);
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
      <div className="flex items-center gap-2 relative">
        <Popover open={openAgencyPopover} onOpenChange={setOpenAgencyPopover}>
          <PopoverTrigger asChild>
            <Button size="sm">
              <span className="text-dim-500 mr-1">Agency</span>
              <span>{selectedAgency?.acronym || 'All'}</span>
              <ChevronDown className="ml-auto h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 rounded-[14px] md:min-w-[320px]"
            align="start"
          >
            <AgencySearchList
              agencies={agencies}
              onSelect={agency => {
                setOpenAgencyPopover(false);
                if (!agency) {
                  removeAgencyFilter();
                  return;
                }
                filterByAgency(agency.id);
              }}
              nullItemLabel="All"
            />
          </PopoverContent>
        </Popover>
        <div>
          <Input
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
        handleFailAddUserToast={handleFailAddUserToast}
        handleErrorToast={handleErrorToast}
      />

      {showAddUserToast && (
        <Toast
          message="New user has been added!"
          icon={<TickCheckCircle />}
          underlineColor="bg-success-600"
          messageColor="text-success-700"
          show={showAddUserToast}
          onClose={() => setShowAddUserToast(false)}
        />
      )}
      {showFailAddUserToast && (
        <Toast
          message="Failed to save. Please try again"
          icon={<AlarmTriangle />}
          underlineColor="bg-danger-600"
          messageColor="text-danger-600"
          show={showFailAddUserToast}
          onClose={() => setShowFailAddUserToast(false)}
          time={8000}
        />
      )}
      {showErrorToast && (
        <Toast
          message="Unexpected Error Occured. Please Refresh Page."
          icon={<AlarmTriangle />}
          underlineColor="bg-danger-600"
          messageColor="text-danger-600"
          show={showErrorToast}
          onClose={() => setShowErrorToast(false)}
          time={8000}
        />
      )}
    </div>
  );
};

export default UserNavbar;
