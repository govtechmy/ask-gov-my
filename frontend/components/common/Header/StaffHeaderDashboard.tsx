'use client';

import { useState } from 'react';
import ThemeToggle from '../theme';
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
    <div className="container  max-w-screen-lg mx-auto px-6">
      <div className="flex justify-between pt-6 pb-3  ">
        <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
          <Asklogo />
          Ask
          <div className="text-[#702FF9] dark:text-[#9E70FF]">
            {/* {agencyAcronym.toUpperCase()} */}agencyAcronymTakImplement
          </div>
          <div className="bg-[#27272A] text-[#FFFFFF] dark:bg-[#F4F4F5] dark:text-[#18181B] rounded-md font-bold text-xs flex justify-center items-center w-[53px] h-[22px]">
            STAFF
          </div>
        </div>

        <div className="flex">
          <div className="items-center flex h-8 w-8">
            <ThemeToggle />
          </div>
          <div className="items-center flex pr-2">
            <LocaleSwitch />
          </div>

          <div className="bg-white border-[1px] border-outline-200 rounded-lg shadow-button flex-grow relative">
            <div className="flex items-center" onClick={toggleOpen}>
              <div className="w-8 h-8 flex items-center justify-center">
                <User />
              </div>
              <div className="pr-1 font-medium">Len E-Herng</div>
              <div className="font-normal text-gray-500">Staff</div>
              <div className="px-1 pr-2 text-dim-500">
                <ChevronDown
                  className={`h-5 w-5 transition-transform transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {open && (
              //design following dropdown, not button
              <div className="absolute top-[36px] right-0 bg-white rounded-lg border-[1px] border-outline-200 shadow-button">
                <button
                  className=" hover:cursor-pointer h-[42px] w-[110px] items-center justify-center flex"
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
    </div>
  );
};

export default StaffHeaderDashboard;
