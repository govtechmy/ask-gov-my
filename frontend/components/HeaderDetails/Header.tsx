'use client';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import Link from 'next/link';
import React, { useContext } from 'react';
import { context } from '../ContextSearchBar';

const Header = () => {
  const { headerMessage } = useContext(context);

  return (
    <div id="header" className="sticky top-0 z-50">
      <div className="w-full bg-white p-2 border-[1px] border-outline-200">
        <div className="container flex mx-auto">
          <div className="flex justify-between w-full">
            <Link href="/">
              <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center hover:cursor-pointer">
                <Asklogo />
                AskMyGov
              </div>
            </Link>
            <div className="flex items-center justify-center flex-grow">
              {headerMessage}
            </div>
            <div className="flex gap-3">
              <ThemeToggle />
              <LocaleSwitch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
