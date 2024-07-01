'use client';
import Calendar from '@/icons/calendar';
import React, { useState } from 'react';
import { Input } from './ui/input';
import Search from '@/icons/search';
import { cn } from '@/lib/utils';

const AdminNavbar = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex space-x-8">
        <button
          className={`font-medium text-sm pb-6 -mb-5 ${activeTab === 'all' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('all')}
        >
          All questions
        </button>
        <button
          className={`font-medium text-sm pb-6 -mb-5 ${activeTab === 'unassigned' ? 'text-black-900 border-b-2 border-[#702FF9] ' : 'text-dim-500'}`}
          onClick={() => setActiveTab('unassigned')}
        >
          Unassigned <span className="text-[#702FF9]">250</span>
        </button>
        <button
          className={`font-medium text-sm pb-6 -mb-5 ${activeTab === 'assigned' ? 'text-black-900 border-b-2 border-[#702FF9]' : 'text-dim-500'}`}
          onClick={() => setActiveTab('assigned')}
        >
          Assigned
        </button>
      </div>
      <div className="flex space-x-4 items-center">
        <button className="px-3 border rounded-md h-[32px] items-center">
          <div className="flex items-center">
            <Calendar />
            <div className="pl-2">Date</div>
          </div>
        </button>

        <div className="flex items-center h-[32px] w-full rounded-md border bg-background px-3 py-2 text-sm">
          <input
            type="search"
            placeholder="Search by ID, keywords"
            className={cn(
              'font-normal placeholder:text-dim-500 flex h-11 w-full rounded-md bg-transparent py-3 text-sm pl-2',
            )}
          />
          <Search strokeWidth={1.88} currentColor="#52525B" />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
