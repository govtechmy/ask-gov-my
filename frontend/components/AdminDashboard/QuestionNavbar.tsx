'use client';
import React, { useState } from 'react';
import Calendar from '@/icons/calendar';
import Search from '@/icons/search';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface QuestionNavbarProps {
  unassignedCount: number;
  currentTab: string;
  searchTerm: string;
  date: string;
}

const QuestionNavbar: React.FC<QuestionNavbarProps> = ({ unassignedCount, currentTab, searchTerm, date }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchTerm);
  const [selectedDate, setSelectedDate] = useState(date); 

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('page');
    params.delete('searchTerm');
    params.delete('date')
    setSearchValue(''); 
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

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

  const handleDateChange = (date: string) => { //DD/MM/YYYY
    setSelectedDate(date);
    const params = new URLSearchParams(searchParams.toString());
    if (date) {
      params.set('date', date); 
    } else {
      params.delete('date');
    }
    params.delete('page');
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center pt-3 pb-[9px] border-b border-[#E4E4E7] dark:border-[#27272A]">
      <div className="flex space-x-8">
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${currentTab === 'all' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => handleTabChange('all')}
        >
          All Questions
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${currentTab === 'unassigned' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => handleTabChange('unassigned')}
        >
          Unassigned <span className="text-[#702FF9]">{unassignedCount}</span>
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${currentTab === 'assigned' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => handleTabChange('assigned')}
        >
          Assigned
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${currentTab === 'spam' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => handleTabChange('spam')}
        >
          Spam
        </button>
      </div>
      <div className="flex space-x-4 items-center">
        <div className="border-[1px] border-outline-200 h-8 rounded-md bg-white p-2 items-center flex text-dim-500">
          Agency:<div className="text-black-900 px-1">All</div>
        </div>
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
            value={searchValue}
            className={cn(
              'font-normal placeholder:text-dim-500 flex h-11 w-full rounded-md bg-transparent py-3 text-sm pl-2',
            )}
            onChange={handleSearchChange}
          />
          <Search strokeWidth={1.88} className="stroke-[#A1A1AA]" />
        </div>
      </div>
    </div>
  );
};

export default QuestionNavbar;
