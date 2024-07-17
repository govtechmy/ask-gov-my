'use client';
import Calendar from '@/icons/calendar';
import React, { useEffect } from 'react';
import Search from '@/icons/search';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';

const UserNavbar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'all';

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
        <Select>
          <SelectTrigger className="w-[120px] h-8 bg-[#FFFFFF] dark:bg-[#18181B]">
            <SelectValue placeholder="Agency: All" />
          </SelectTrigger>
          <SelectContent className="bg-[#FFFFFF] dark:bg-[#18181B] w-[120px]">
            <SelectItem value="all">Agency: All</SelectItem>
            <SelectItem value="miti">MITI</SelectItem>
            <SelectItem value="moh">MOH</SelectItem>
          </SelectContent>
        </Select>

        <button className="px-3 border rounded-md h-8 items-center bg-[#FFFFFF] dark:bg-[#18181B]">
          <div className="flex items-center">
            <Calendar />
            <div className="pl-2">Date</div>
          </div>
        </button>

        <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-md flex items-center h-8 w-[260px] border px-3 py-2 text-sm">
          <input
            type="search"
            placeholder="Search by ID, keywords"
            className={cn(
              'font-normal placeholder:text-dim-500 flex h-11 w-full rounded-md bg-transparent py-3 text-sm pl-2',
            )}
          />
          <Search strokeWidth={1.88} className="stroke-[#FFFFFF]" />
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
