'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import PlusIcon from '@/icons/plusicon';
import AddAgencyModal from '@/components/AdminDashboard/AddAgencyModal';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/lib/i18n';

interface AgencyNavbarProps {
  searchTerm: string;
}

const AgencyNavbar: React.FC<AgencyNavbarProps> = ({ searchTerm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('searchTerm', term);
    } else {
      params.delete('searchTerm');
    }
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-semibold">Manage agencies</h1>
      <div className="flex">
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
            placeholder="Search by agency or ID"
            value={searchTerm}
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
          className="w-[125px] h-8 rounded-md items-center justify-center flex text-white-forcewhite font-medium text-sm ml-2
          bg-gradient-to-t from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF] border-[1px] border-[#702FF9]"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="h-4 w-4 flex items-center justify-center mr-[6px]">
            <PlusIcon className="stroke-white-forcewhite" />
          </div>
          <div>New agency</div>
        </div>
      </div>
      <AddAgencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AgencyNavbar;
