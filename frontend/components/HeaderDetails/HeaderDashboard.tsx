'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import User from '@/icons/user';
import ChevronDown from '@/icons/ChevronDown';
import { cn } from '@/lib/utils';
import Gov from '@/icons/gov';
import UserGroup from '@/icons/usergroup';
import Logout from '@/icons/logout';
import { signOut } from 'next-auth/react';

const HeaderDashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState<
    'questions' | 'manageagencies' | 'manageusers'
  >('questions');

  useEffect(() => {
    const currentPage = searchParams.get('page') as
      | 'questions'
      | 'manageagencies'
      | 'manageusers';
    if (currentPage) {
      setActiveLink(currentPage);
    }
  }, [searchParams]);

  const handleSetActiveLink = (
    link: 'questions' | 'manageagencies' | 'manageusers',
  ) => {
    setActiveLink(link);
    const params = new URLSearchParams(window.location.search);
    params.set('page', link);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    signOut(); // Call signOut to logout the user
  };

  return (
    <div className="container  max-w-screen-lg mx-auto px-6">
      <div className="flex justify-between pt-6 pb-3  ">
        <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
          <Asklogo />
          AskGovMY
          <div className="bg-[#27272A] text-[#FFFFFF] dark:bg-[#F4F4F5] dark:text-[#18181B] rounded-md font-bold text-xs flex justify-center items-center w-[53px] h-[22px]">
            ADMIN
          </div>
          <div
            className={`rounded-md font-medium text-sm flex justify-center items-center w-[88px] h-8 px-2 ${
              activeLink === 'questions'
                ? 'text-[#702FF9] bg-[#F4EFFF] dark:text-[#9E70FF] dark:bg-[#201636]'
                : 'text-black-700'
            }`}
            onClick={() => handleSetActiveLink('questions')}
          >
            <Link href="/admin/dashboard/?page=questions">Questions</Link>
          </div>
          <div
            className={`rounded-md font-medium text-sm flex justify-center items-center h-8 px-1 ${
              activeLink === 'manageagencies'
                ? 'text-[#702FF9] bg-[#F4EFFF] dark:text-[#9E70FF] dark:bg-[#201636]'
                : 'text-black-700'
            }`}
            onClick={() => handleSetActiveLink('manageagencies')}
          >
            <Link href="/admin/dashboard/?page=manageagencies">
              <div className="flex items-center">
                <div className="px-2">
                  <Gov className="stroke-current"></Gov>
                </div>
                <div className="pr-2">Agencies</div>
              </div>
            </Link>
          </div>
          <div
            className={`rounded-md font-medium text-sm flex justify-center items-center h-8 px-1 ${
              activeLink === 'manageusers'
                ? 'text-[#702FF9] bg-[#F4EFFF] dark:text-[#9E70FF] dark:bg-[#201636]'
                : 'text-black-700'
            }`}
            onClick={() => handleSetActiveLink('manageusers')}
          >
            <Link href="/admin/dashboard/?page=manageusers">
              <div className="flex items-center">
                <div className="px-2">
                  <UserGroup className="stroke-current"></UserGroup>
                </div>
                <div className="pr-2">Users</div>
              </div>
            </Link>
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
              <div className="pr-1 font-medium">Harris Azmi</div>
              <div className="font-normal text-gray-500">Super Admin</div>
              <div className="px-1 pr-2 text-dim-500">
                <ChevronDown
                  className={`h-5 w-5 transition-transform transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {open && (
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

export default HeaderDashboard;
