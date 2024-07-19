'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Search from '@/icons/search';
import AddUserModal from './AddUserModal';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Agency {
  id: number;
  name: string;
  name_ms: string;
  acronym: string;
  total_likes?: number;
  logo_url?:string;
}

interface UserNavbarProps {
  setSearchTerm: (term: string) => void;
  agencies: Agency[];
  onAddUser: () => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ setSearchTerm, agencies, onAddUser }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'all';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  useEffect(() => {}, [activeTab]);

  return (
    <div className="flex items-center justify-between pt-3 pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
      <div className="flex space-x-8">
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${activeTab === 'all' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('all')}
        >
          All Users
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${activeTab === 'superadmin' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('superadmin')}
        >
          Super Admins
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${activeTab === 'staff' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('staff')}
        >
          Staff
        </button>
      </div>
      <div className="flex space-x-4 items-center">
        <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-md flex items-center h-8 w-[260px] border px-3 py-2 text-sm">
          <input
            type="search"
            placeholder="Search by name or email"
            className={cn(
              'font-normal placeholder:text-dim-500 flex h-11 w-full rounded-md bg-transparent py-3 text-sm pl-2',
            )}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search strokeWidth={1.88} className="stroke-[#FFFFFF]" />
        </div>
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          + Add User
        </button>
      </div>
      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        agencies={agencies}
        onAddUser={onAddUser}
      />
    </div>
  );
};

export default UserNavbar;
