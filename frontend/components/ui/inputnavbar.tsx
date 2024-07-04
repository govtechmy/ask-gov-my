import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { searchQuestions } from '@/actions/searchServices';
import { AGENCY_TO_UUID } from '@/lib/agency';
import Search from '@/icons/search';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import Close from '@/icons/close';
import RightArrow from '@/icons/rightarrow';

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
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsTyping(true);
    setShowNoResults(false); // Reset no results message on input change
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
      setIsTyping(false);
      setShowNoResults(results.length === 0); // Show no results if results array is empty
    } else {
      setSearchResults([]);
      setIsTyping(false);
      setShowNoResults(false); // Reset no results message if query is empty
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query: string) => fetchSearchResults(query), 1000), // ms delay
    [],
  );

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsTyping(false);
    setShowNoResults(false); // Reset no results message on clear
  };

  useEffect(() => {
    debouncedFetchSearchResults(searchQuery);
  }, [searchQuery, debouncedFetchSearchResults]);

  return (
    <div className="flex items-center border-outline-200 shadow-button rounded-full border px-4 py-2 bg-white w-[800px] relative">
      <input
        className="flex-1 border-none outline-none px-2 py-1"
        placeholder="Search by keyword or agency name (eg. MOH, MOT)"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      {searchQuery.length > 0 && (
        <div className="absolute right-10 bg-transparent flex text-dim-500 items-center">
          <div className="font-normal text-xs" style={{ lineHeight: '18px' }}>
            Press &nbsp;
          </div>
          <div
            className="font-semibold text-xs "
            style={{ lineHeight: '18px' }}
          >
            ENTER &nbsp;
          </div>
          <div
            className="font-normal text-xs pr-2"
            style={{ lineHeight: '18px' }}
          >
            to display all matches
          </div>
          <div className="pr-4 hover:cursor-pointer" onClick={clearSearch}>
            <Close />
          </div>
        </div>
      )}
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-b from-[#B379FF] to-[#702FF9] to-[60.94%] p-1 ml-2">
        <Search className="text-white" />
      </div>
      {searchQuery.length > 0 && (
        <div className="absolute top-full left-0 mt-2 rounded-md bg-white shadow-lg w-full z-10 overflow-y-auto max-h-60">
          {isSearching ? (
            <div className="px-4 py-2 text-center">Searching...</div>
          ) : (
            <>
              {searchResults.length === 0 && showNoResults && (
                <div className="px-4 py-2 text-center">No results found.</div>
              )}
              {searchResults.length > 0 && (
                <ul>
                  {searchResults.slice(0, 20).map((result, index) => {
                    // take 20 result max
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
                              <RightArrow />
                            </div>
                          </div>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InputNavbar;
