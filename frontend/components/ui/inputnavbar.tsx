'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { searchQuestions } from '@/actions/searchServices';
import { AGENCY_TO_UUID } from '@/lib/agency';
import Search from '@/icons/search';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import ArrowRight from '@/icons/arrowright';

interface InputNavbarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: any[];
  setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
  displayAllMatches: boolean;
  setDisplayAllMatches: React.Dispatch<React.SetStateAction<boolean>>;
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const InputNavbar: React.FC<InputNavbarProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  displayAllMatches,
  setDisplayAllMatches,
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setDisplayAllMatches(true);
    }
  };

  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  const fetchSearchResults = async (query: string) => {
    if (query.length > 0) {
      setIsSearching(true);
      const results = await searchQuestions(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query: string) => fetchSearchResults(query), 300), // 300 milliseconds delay
    [],
  );

  useEffect(() => {
    debouncedFetchSearchResults(searchQuery);
  }, [searchQuery, debouncedFetchSearchResults]);

  return (
    <div className="flex items-center border-outline-200 rounded-full border px-4 py-2 bg-white w-[800px] relative">
      <input
        className="flex-1 border-none outline-none px-2 py-1"
        placeholder="Search by keyword or agency name (eg. MOH, MOT)"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-b from-[#B379FF] to-[#702FF9] to-[60.94%] p-1 ml-2">
        <Search className="text-white" />
      </div>
      {searchQuery.length > 0 && (
        <div className="absolute top-full left-0 mt-2 rounded-md bg-white shadow-lg w-full z-10">
          {displayAllMatches && (
            <div className="px-4 py-2 text-center text-gray-500">
              Press ENTER to display all matches
            </div>
          )}
          {!isSearching && searchResults.length === 0 ? (
            <div className="px-4 py-2 text-center">No results found.</div>
          ) : (
            <ul>
              {searchResults.map((result, index) => {
                const agencyAcronym = Object.keys(AGENCY_TO_UUID).find(
                  key => AGENCY_TO_UUID[key] === result.agency.toString(),
                );

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between border-b pr-2 pl-4 py-2 last:border-0 hover:bg-gray-100"
                  >
                    <Link
                      href={`/${agencyAcronym?.toLowerCase()}/${result.id}`}
                    >
                      <span className="block font-medium text-sm text-black-700 truncate max-w-[600px]">
                        {result.question}
                      </span>
                      <span className="mt-1 block font-normal text-sm text-dim-500 truncate max-w-[600px]">
                        {result.answer}
                      </span>
                    </Link>
                    <span className="">
                      <div className="flex">
                        <div className="pr-1.5">
                          <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A] h-5 w-5"></JataNegaraIcon>
                        </div>
                        <div className="font-normal text-sm text-black-800">
                          {agencyAcronym}
                        </div>
                        <div className="px-1">
                          <ArrowRight></ArrowRight>
                        </div>
                      </div>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default InputNavbar;
