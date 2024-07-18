'use client';

import React, { useContext, useEffect } from 'react';
import InputNavbar from '../ui/inputnavbar';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import Link from 'next/link';
import RightArrow from '@/icons/rightarrow';
import { useTranslations } from 'next-intl';
import { context } from '../ContextSearchBar';

interface SearchNavbarAgencyProps {
  agencyAcronym: string;
  agencyUUID: string;
}

const SearchNavbarAgency: React.FC<SearchNavbarAgencyProps> = ({
  agencyAcronym,
  agencyUUID,
}) => {
  const t = useTranslations('Agency');
  const {
    setHeaderContent,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    displayAllMatches,
    setDisplayAllMatches,
  } = useContext(context);

  useEffect(() => {
    const handleScroll = () => {
      const searchNavbarTitle = document.getElementById('search-navbar-title');
      if (searchNavbarTitle) {
        const rect = searchNavbarTitle.getBoundingClientRect();
        if (rect.bottom <= 0) {
          setHeaderContent('input');
        } else {
          setHeaderContent('');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

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
              <div className="h-[42px] w-[42px] flex-shrink-0 flex items-center justify-center">
                <JataNegaraIcon />
              </div>
              <div
                id="search-navbar-title"
                className="font-poppins text-black-900 font-semibold text-2xl px-3"
              >
                {t(agencyAcronym.toUpperCase())}
              </div>
            </div>
            ' '
            <div className=" w-full">
              <InputNavbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                displayAllMatches={displayAllMatches}
                setDisplayAllMatches={setDisplayAllMatches}
                agencyUUID={agencyUUID}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchNavbarAgency;
