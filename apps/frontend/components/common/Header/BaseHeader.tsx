'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import ThemeToggle from '../theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import { context } from '@/components/context/ContextSearchBar';
import InputNavbar from '../SearchNavbar/inputnavbar';
import { StyledDisplay } from '@/components/ui/display';

interface HeaderProps {
  isAdmin?: boolean;
  alwaysShowInput?: boolean;
  agencyAcronym?: string;
}

const BaseHeader: React.FC<HeaderProps> = ({
  isAdmin = false,
  alwaysShowInput = false,
  agencyAcronym,
}) => {
  const {
    headerContent,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    displayAllMatches,
    setDisplayAllMatches,
  } = useContext<any>(context);

  return (
    <div id="header" className={`sticky top-0 z-50 ${isAdmin ? '' : 'w-full'}`}>
      <div
        className={`w-full bg-white ${isAdmin ? 'border-[1px] border-outline-200' : 'p-2 border-[1px] border-outline-200 h-16'} flex items-center`}
      >
        <div className={`${isAdmin ? 'p-2' : 'container'} flex w-full`}>
          <div className="flex justify-between w-full items-center">
            <Link href={agencyAcronym ? `/${agencyAcronym}` : '/'}>
              <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center hover:cursor-pointer">
                <Asklogo />
                <div className="flex">
                  Ask
                  {agencyAcronym ? (
                    <div className="text-[#702FF9] dark:text-[#9E70FF]">
                      {agencyAcronym.toUpperCase()}
                    </div>
                  ) : (
                    <div className="hidden sm:block">MyGov</div>
                  )}
                </div>
                {isAdmin && (
                  <StyledDisplay variant={'nameHeader'}>ADMIN</StyledDisplay>
                )}
              </div>
            </Link>

            {(alwaysShowInput || headerContent === 'input') && (
              <InputNavbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                displayAllMatches={displayAllMatches}
                setDisplayAllMatches={setDisplayAllMatches}
              />
            )}

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

export default BaseHeader;
