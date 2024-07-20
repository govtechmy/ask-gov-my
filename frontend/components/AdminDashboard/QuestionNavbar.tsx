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

interface QuestionNavbarProps {
  unassignedCount: number;
  setSearchTerm: (term: string) => void;
}

const QuestionNavbar: React.FC<QuestionNavbarProps> = ({ unassignedCount, setSearchTerm }) => {
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
          All Questions
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${activeTab === 'unassigned' ? 'text-black-900 border-b-2 border-[#702FF9] ' : 'text-dim-500'}`}
          onClick={() => setActiveTab('unassigned')}
        >
          Unassigned <span className="text-[#702FF9]">{unassignedCount}</span>
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${activeTab === 'assigned' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('assigned')}
        >
          Assigned
        </button>
      </div>
      <div className="flex space-x-4 items-center">
        <Select>
          <SelectTrigger className="w-[120px] h-8 bg-[#FFFFFF] dark:bg-[#18181B]">
            <SelectValue placeholder="Agency: All" />
          </SelectTrigger>
          <SelectContent className="bg-[#FFFFFF] dark:bg-[#18181B] w-[120px]">
            <SelectItem value="user1" className="">
              Agency: All
            </SelectItem>
            <SelectItem value="user1" className="">
              MITI
            </SelectItem>
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
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search strokeWidth={1.88} className="stroke-[#FFFFFF]" />
        </div>
      </div>
    </div>
  );
};

export default QuestionNavbar;