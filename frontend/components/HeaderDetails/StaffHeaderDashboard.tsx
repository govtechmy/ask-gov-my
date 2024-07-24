'use client';

import { useState } from 'react';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import User from '@/icons/user';
import ChevronDown from '@/icons/ChevronDown';
import Logout from '@/icons/logout';
import { signOut } from 'next-auth/react';

const StaffHeaderDashboard = () => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    signOut();
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
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleOpen}
          >
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
            <div className="absolute top-[36px] right-0 bg-white rounded-lg border-[1px] border-outline-200 shadow-button">
              <button
                className="hover:cursor-pointer h-[42px] w-[110px] items-center justify-center flex"
                onClick={handleLogout}
              >
                <div className="pr-2">
                  <Logout className="stroke-[#DC2626] dark:stroke-[#FF5959]"></Logout>
                </div>
                <div>Logout</div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffHeaderDashboard;
