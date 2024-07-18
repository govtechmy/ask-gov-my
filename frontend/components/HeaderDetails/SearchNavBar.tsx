'use client';

import { useContext, useEffect, useState } from 'react';
import Info from '@/icons/info';
import InputNavbar from '../ui/inputnavbar';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { context } from '../ContextSearchBar';

const SearchNavbar: React.FC = () => {
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
    <div
      id="navbar"
      className="bg-gradient-radial from-[#D4C0FF] to-[#F4EFFF] dark:from-[#4F1FB4] dark:to-[#201636] py-2 h-56 flex flex-col items-center"
    >
      <div
        id="search-navbar-title"
        className="font-poppins pb-6 pt-10 text-2xl font-semibold text-[#482D7C] dark:text-[#FFFFFF] text-center"
      >
        {t('title')}
      </div>
      <div className="relative flex justify-center w-full">
        <InputNavbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          displayAllMatches={displayAllMatches}
          setDisplayAllMatches={setDisplayAllMatches}
        />
      </div>
      <div className="flex items-center justify-center mt-4">
        <Info className="text-[#766695]" />
        <div className="px-2 text-center text-sm font-medium text-[#766695]">
          {t('reminder')}
        </div>
      </div>
    </div>
  );
};

export default SearchNavbar;
