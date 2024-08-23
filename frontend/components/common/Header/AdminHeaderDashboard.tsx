'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import User from '@/icons/user';
import ChevronDown from '@/icons/ChevronDown';
import { cn } from '@/lib/utils';
import Gov from '@/icons/gov';
import UserGroup from '@/icons/usergroup';
import Logout from '@/icons/logout';
import { signOut } from 'next-auth/react';
import { buttonVariants } from '@/components/ui/button';
import QuestionCircle from '@/icons/questioncircle';
import { StyledDisplay } from '@/components/ui/display';

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const AdminHeaderDashboard: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);
  const handleLogout = () => signOut();

  const navLinks: NavLinkProps[] = [
    { href: '/admin/dashboard', icon: QuestionCircle, label: 'Questions' },
    { href: '/admin/dashboard/agency', icon: Gov, label: 'Agencies' },
    { href: '/admin/dashboard/user', icon: UserGroup, label: 'Users' },
  ];

  const pathName = usePathname();

  const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, label }) => (
    <Link
      className={cn(
        buttonVariants({ variant: 'tertiary-askmygov', size: 'sm' }),
        {
          'text-[#702FF9] bg-[#F4EFFF] dark:text-[#9E70FF] dark:bg-[#201636]':
            pathName === href,
          'text-black-700': pathName !== href,
        },
      )}
      href={href}
    >
      <Icon className="stroke-current" />
      {label}
    </Link>
  );

  return (
    <div className="container max-w-screen-lg mx-auto px-6">
      <div className="flex justify-between pt-6 pb-3">
        <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
          <Asklogo />
          AskGovMY
          <StyledDisplay variant={'nameHeader'}>ADMIN</StyledDisplay>
          {navLinks.map(link => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>

        <div className="flex gap-2">
          <ThemeToggle />
          <LocaleSwitch />

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
                  className="hover:cursor-pointer h-[42px] w-[110px] items-center justify-center flex"
                  onClick={handleLogout}
                >
                  <div className="pr-2">
                    <Logout className="stroke-[#DC2626] dark:stroke-[#FF5959]" />
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

export default AdminHeaderDashboard;
