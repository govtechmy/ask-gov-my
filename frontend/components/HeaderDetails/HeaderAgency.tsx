'use client';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import Link from 'next/link';
import React, { useContext } from 'react';
import { context } from '../ContextSearchBar';
import InputNavbar from '../ui/inputnavbar';

interface HeaderAgencyProps {
  agencyAcronym: string;
}

const HeaderAgency: React.FC<HeaderAgencyProps> = ({ agencyAcronym }) => {
  const {
    headerContent,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    displayAllMatches,
    setDisplayAllMatches,
  } = useContext(context);

  return (
    <div id="header" className="sticky top-0 z-50">
      <div className="w-full bg-white p-2 border-[1px] border-outline-200 h-16 flex items-center">
        <div className="container flex">
          <div className="flex justify-between w-full items-center">
            <Link href="/">
              <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center hover:cursor-pointer">
                <Asklogo />
                <div className="flex">
                  Ask
                  <div className="text-[#702FF9] dark:text-[#9E70FF]">
                    {agencyAcronym.toUpperCase()}
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-center flex-grow">
              {headerContent === 'input' ? (
                <InputNavbar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  displayAllMatches={displayAllMatches}
                  setDisplayAllMatches={setDisplayAllMatches}
                />
              ) : (
                ''
              )}
            </div>
            <div className="p-2"></div>
            <div className="flex gap-3 items-center">
              <ThemeToggle />
              <LocaleSwitch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAgency;
