'use client';

import { useState } from 'react';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import User from '@/icons/user';
import ChevronDown from '@/icons/ChevronDown';

const StaffHeaderDashboard = () => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="flex justify-between py-6 container">
      <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
        <Asklogo />
        AskGovMY
        <div className="bg-[#27272A] text-[#FFFFFF] dark:bg-[#F4F4F5] dark:text-[#18181B] rounded-md font-bold text-xs flex justify-center items-center w-[53px] h-[22px]">
          STAFF
        </div>
      </div>

      <div className="flex gap-3">
        <ThemeToggle />
        <LocaleSwitch />
        <div className="bg-white border-[1px] border-outline-200 rounded-lg shadow-button">
          <div className="flex items-center cursor-pointer" onClick={toggleOpen}>
            <div className="pr-1 w-4 h-4">
              <User />
            </div>
            <div className="pr-1 font-medium">Staff Name</div>
            <div className="font-normal text-gray-500">Staff</div>
            <div className="p-1">
              <ChevronDown
                className={`h-4 w-4 transition-transform transform ${open ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

          {open && (
            <div className="py-2 px-3 bg-white rounded-lg">
              <button className="hover:bg-gray-200 py-1 px-2">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffHeaderDashboard;
