'use client';

import React, { useContext, useEffect, useState } from 'react';
import Info from '@/icons/info';
import InputNavbar from './inputnavbar';
import { useTranslations } from 'next-intl';
import { context } from '@/components/context/ContextSearchBar';
import Link from 'next/link';
import RightArrow from '@/icons/rightarrow';
import { Agency } from '@/types/types';
import AgencyName from '../AgencyName';
import AgencyLogoImporter from '../AgencyLogoImporter';

interface SearchNavbarProps {
  agency?: {
    acronym: string;
    uuid: string;
    details: Agency;
  };
}

const SearchNavbar: React.FC<SearchNavbarProps> = ({ agency }) => {
  const t = useTranslations('Search');

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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setHeaderContent]);

  const renderTitle = () => {
    if (agency) {
      return (
        <>
          <div className="flex items-center gap-1">
            <Link href={'/'}>
              <div className="font-medium text-dim-500 text-sm">Home</div>
            </Link>
            <div>
              <RightArrow className="stroke-[#A1A1AA]" />
            </div>
            <div className="font-medium text-black-800 text-sm">
              {agency.acronym.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center pb-6 pt-3 text-2xl text-left">
            <div className="flex-shrink-0 flex items-center justify-center relative h-[42px] w-[42px]">
              <AgencyLogoImporter currentAgency={agency.details} />
            </div>
            <div
              id="search-navbar-title"
              className="font-poppins text-black-900 font-semibold text-2xl px-3"
            >
              <AgencyName agency={agency.details} />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div
          id="search-navbar-title"
          className="font-poppins pb-6 text-2xl font-semibold text-[#482D7C] dark:text-[#FFFFFF] text-center"
        >
          {t('title')}
        </div>
      );
    }
  };

  return (
    <div
      className={`flex items-center bg-gradient-radial from-[#D4C0FF] to-[#F4EFFF] dark:from-[#4F1FB4] dark:to-[#201636] py-2 h-56`}
    >
      <div className="container flex flex-col">
        {renderTitle()}
        <div
          className={`relative flex ${!agency ? 'justify-center w-full' : ''}`}
        >
          {showInputNavbar && (
            <InputNavbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              displayAllMatches={displayAllMatches}
              setDisplayAllMatches={setDisplayAllMatches}
              agencyUUID={agency?.uuid}
            />
          )}
        </div>
        {!agency && (
          <div className="flex items-center justify-center mt-4">
            <Info className="text-[#766695]" />
            <div className="px-2 text-center text-sm font-medium text-[#766695]">
              {t('reminder')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchNavbar;
