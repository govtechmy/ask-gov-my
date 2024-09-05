'use client';
import Calendar from '@/icons/calendar';
import React, { useState, useEffect } from 'react';
import Search from '@/icons/search';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

interface StaffQuestionNavbarProps {
  unansweredCount: number;
  currentTab: string;
  searchTerm: string;
  date: string;
}

const StaffQuestionNavbar: React.FC<StaffQuestionNavbarProps> = ({
  unansweredCount,
  currentTab,
  searchTerm,
  date
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchTerm);
  const [selectedDate, setSelectedDate] = useState(date);

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('page');
    params.delete('searchTerm');
    params.delete('date');
    setSearchValue('');
    setSelectedDate('');
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

  const handleDateChange = (newDate: string) => { //handleDateChange is to be used when the date dropdown is complete
    setSelectedDate(newDate);
    const params = new URLSearchParams(searchParams.toString());
    if (newDate) {
      params.set('date', newDate);
    } else {
      params.delete('date');
    }
    params.delete('page');
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center pt-3 pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
      <div className="flex space-x-8">
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${currentTab === 'all' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => handleTabChange('all')}
        >
          All Questions
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${currentTab === 'unanswered' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => handleTabChange('unanswered')}
        >
          Unanswered <span className="text-[#702FF9]">{unansweredCount}</span>
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${currentTab === 'answered' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => handleTabChange('answered')}
        >
          Answered
        </button>
        <button
          className={`font-medium text-sm pb-3 -mb-5 ${currentTab === 'draft' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => handleTabChange('draft')}
        >
          Draft
        </button>
      </div>
      <div className="flex space-x-4 items-center">
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
            className={cn('font-normal placeholder:text-dim-500 flex h-11 w-full rounded-md bg-transparent py-3 text-sm pl-2')}
            onChange={handleSearchChange}
          />
          <Search strokeWidth={1.88} className="stroke-[#FFFFFF]" />
        </div>
      </div>
    </div>
  );
};

export default StaffQuestionNavbar;
