'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import User from '@/icons/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

  return (
    <div className="sticky">
      <div>
        <div className="flex justify-between py-2">
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
              className={`rounded-md font-medium text-sm flex justify-center items-center w-[145px] h-8 px-1 ${
                activeLink === 'manageagencies'
                  ? 'text-[#702FF9] bg-[#F4EFFF] dark:text-[#9E70FF] dark:bg-[#201636]'
                  : 'text-black-700'
              }`}
              onClick={() => handleSetActiveLink('manageagencies')}
            >
              <Link href="/admin/dashboard/?page=manageagencies">
                Manage Agencies
              </Link>
            </div>
            <div
              className={`rounded-md font-medium text-sm flex justify-center items-center w-[145px] h-8 px-1 ${
                activeLink === 'manageusers'
                  ? 'text-[#702FF9] bg-[#F4EFFF] dark:text-[#9E70FF] dark:bg-[#201636]'
                  : 'text-black-700'
              }`}
              onClick={() => handleSetActiveLink('manageusers')}
            >
              <Link href="/admin/dashboard/?page=manageusers">
                Manage Users
              </Link>
            </div>
          </div>

          <div className="flex gap-3">
            <ThemeToggle />
            <LocaleSwitch />
            <Select>
              <SelectTrigger className="w-[250px] h-8 bg-[#FFFFFF] dark:bg-[#18181B]">
                <SelectValue placeholder="Choose User" />
              </SelectTrigger>
              <SelectContent className="bg-[#FFFFFF] dark:bg-[#18181B]">
                <SelectItem value="superadmin">
                  <div className="flex items-center flex-grow-0 bg-[#FFFFFF] dark:bg-[#18181B]">
                    <User />
                    <div className="px-1 font-medium text-sm text-black-900">
                      Akeem Irfan
                    </div>
                    <div className="px-1 font-normal text-sm text-dim-500">
                      Super Power
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="user">
                  <div className="flex items-center flex-grow-0 bg-[#FFFFFF] dark:bg-[#18181B]">
                    <User />
                    <div className="px-1 font-medium text-sm text-black-900">
                      Harris Azmi
                    </div>
                    <div className="px-1 font-normal text-sm text-dim-500">
                      Super Admin
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="hacker">
                  <div className="flex items-center flex-grow-0 bg-[#FFFFFF] dark:bg-[#18181B]">
                    <User />
                    <div className="px-1 font-medium text-sm text-black-900">
                      Lenny
                    </div>
                    <div className="px-1 font-normal text-sm text-dim-500">
                      Super Hacker
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;
