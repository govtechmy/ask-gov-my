'use client';
import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './theme';
import LocaleSwitch from './locale-switch';
import Asklogo from '@/icons/asklogo';
import User from '@/icons/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HeaderDashboard = ({ locale }: { locale: string }) => {
  const [activeLink, setActiveLink] = useState<'questions' | 'manageagencies'>(
    'questions',
  );

  const handleSetActiveLink = (link: 'questions' | 'manageagencies') => {
    setActiveLink(link);
  };

  return (
    <div className="sticky">
      <div>
        <div className="bg-background flex justify-between py-2">
          <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
            <Asklogo />
            AskGovMY
            <div className="bg-zinc-800 dark:bg-black-900 rounded-md font-bold text-xs flex justify-center items-center text-background-50 w-[53px] h-[22px]">
              ADMIN
            </div>
            <Link href="/admin/dashboard/" passHref>
              <div
                className={`rounded-md font-medium text-sm flex justify-center items-center w-[88px] h-[32px] px-2 ${
                  activeLink === 'questions'
                    ? 'text-brand-600 bg-[#F4EFFF]'
                    : 'text-black-700'
                }`}
                onClick={() => handleSetActiveLink('questions')}
              >
                Questions
              </div>
            </Link>
            <Link href="/admin/dashboard/" passHref>
              <div
                className={`rounded-md font-medium text-sm flex justify-center items-center w-[145px] h-[32px] px-1 ${
                  activeLink === 'manageagencies'
                    ? 'text-brand-600 bg-[#F4EFFF]'
                    : 'text-black-700'
                }`}
                onClick={() => handleSetActiveLink('manageagencies')}
              >
                Manage Agencies
              </div>
            </Link>
          </div>

          <div className="flex gap-3">
            <ThemeToggle />
            <LocaleSwitch locale={locale} />
            <Select>
              <SelectTrigger className="w-[250px] h-[32px]">
                <SelectValue placeholder="Choose User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">
                  <div className="flex items-center flex-grow-0">
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
                  <div className="flex items-center flex-grow-0">
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
                  <div className="flex items-center flex-grow-0">
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
