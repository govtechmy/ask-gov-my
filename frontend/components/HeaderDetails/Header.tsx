'use client';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import Link from 'next/link';

const Header = () => {
  return (
    <div className="w-full bg-white p-2 border-[1px] border-outline-200">
      <div className="container flex mx-auto">
        <div className="flex justify-between w-full">
          <Link href="/">
            <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center hover:cursor-pointer">
              <Asklogo />
              AskMyGov
            </div>
          </Link>
          <div className="flex gap-3">
            <ThemeToggle />
            <LocaleSwitch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
