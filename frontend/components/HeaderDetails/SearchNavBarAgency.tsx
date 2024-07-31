'use client';

import React, { useContext, useEffect, useState } from 'react';
import InputNavbar from '../ui/inputnavbar';
import Link from 'next/link';
import RightArrow from '@/icons/rightarrow';
import { useTranslations } from 'next-intl';
import { context } from '../ContextSearchBar';
import AgencyLogoImporter from '../AgencyLogoImporter';
import { Agency } from '@/types/types';
import AgencyName from '../AgencyName';

interface SearchNavbarAgencyProps {
  agencyAcronym: string;
  agencyUUID: string;
  currentAgency: Agency;
}

const SearchNavbarAgency: React.FC<SearchNavbarAgencyProps> = ({
  agencyAcronym,
  agencyUUID,
  currentAgency,
}) => {
  const {
    setHeaderContent,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    displayAllMatches,
    setDisplayAllMatches,
  } = useContext(context);
  const [showInputNavbar, setShowInputNavbar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const searchNavbarTitle = document.getElementById('search-navbar-title');
      if (searchNavbarTitle) {
        const rect = searchNavbarTitle.getBoundingClientRect();
        if (rect.bottom <= 0) {
          setHeaderContent('input');
          setShowInputNavbar(false);
        } else {
          setHeaderContent('');
          setShowInputNavbar(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    console.log(currentAgency);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setHeaderContent]);

  return (
    <div className="bg-gradient-radial from-[#D4C0FF] to-[#F4EFFF] dark:from-[#4F1FB4] dark:to-[#201636]">
      <div className="container py-2 h-56 flex flex-col items-start">
        <div className="flex items-center h-56 w-full">
          <div className="">
            <div className="flex items-center gap-1">
              <Link href={'/'}>
                <div className="font-medium text-dim-500 text-sm">Home</div>
              </Link>
              <div>
                <RightArrow className="stroke-[#A1A1AA]" />
              </div>
              <div className="font-medium text-black-800 text-sm">
                {agencyAcronym.toUpperCase()}
              </div>
            </div>
            <div className="flex items-center pb-6 pt-3 text-2xl text-left">
              <div className="flex-shrink-0 flex items-center justify-center relative h-[42px] w-[42px]">
                <AgencyLogoImporter
                  currentAgency={currentAgency}
                ></AgencyLogoImporter>
              </div>
              <div
                id="search-navbar-title"
                className="font-poppins text-black-900 font-semibold text-2xl px-3"
              >
                <AgencyName agency={currentAgency} />
              </div>
            </div>
            <div className="w-full">
              {showInputNavbar && (
                <InputNavbar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  displayAllMatches={displayAllMatches}
                  setDisplayAllMatches={setDisplayAllMatches}
                  agencyUUID={agencyUUID}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchNavbarAgency;
