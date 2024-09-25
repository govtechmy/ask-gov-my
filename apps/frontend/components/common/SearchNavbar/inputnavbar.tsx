'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { searchQuestions } from '@/actions/searchServices';
import Search from '@/icons/search';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import Close from '@/icons/close';
import RightArrow from '@/icons/rightarrow';
import AskQuestion from './AskQuestion';
import { useRouter } from '@/lib/i18n';
import { useTranslations } from 'next-intl';
import { getDynamicAgencyMap } from '@/actions/questionServices';

interface InputNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
  displayAllMatches: boolean;
  setDisplayAllMatches: (display: boolean) => void;
  agencyUUID?: string;
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="text-[#702FF9] dark:text-[#9E70FF]">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const InputNavbar: React.FC<InputNavbarProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  displayAllMatches,
  setDisplayAllMatches,
  agencyUUID,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [hiddenDisplay, setHiddendisplay] = useState(true);
  const [agencyMap, setAgencyMap] = useState<Record<string, string>>({});
  const router = useRouter();
  const t = useTranslations('Search');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInfoClick = () => {
    if (searchQuery.trim().length > 0) {
      router.push(`/searchresults?query=${searchQuery}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsTyping(true);
    setShowNoResults(false);
    setHiddendisplay(true);
    debouncedFetchSearchResults(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery.trim().length > 0) {
      setDisplayAllMatches(true);
      router.push(`/searchresults?query=${searchQuery}`);
      setSearchResults([]);
      setHiddendisplay(false);
      inputRef.current?.blur();
    }
  };

  const fetchSearchResults = async (query: string) => {
    if (query.length > 0) {
      setIsSearching(true);
      const results = await searchQuestions(query);
      setSearchResults(results);
      setIsSearching(false);
      setIsTyping(false);
      setShowNoResults(results.length === 0); // show no results if results array is empty
    } else {
      setSearchResults([]);
      setIsTyping(false);
      setShowNoResults(false); // reset no results message if query is empty
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
    setShowNoResults(false); // reset no results message on clear
  };

  // useEffect(() => {
  //   debouncedFetchSearchResults(searchQuery);
  // }, [searchQuery, debouncedFetchSearchResults]);

  useEffect(() => {
    const fetchAgencyMap = async () => {
      const map = await getDynamicAgencyMap();
      setAgencyMap(map);
    };

    fetchAgencyMap();
  }, []);

  return (
    <div
      id="inputnavbar"
      className={`flex items-center border-outline-200 h-11 shadow-button border pl-3 pr-2 py-2 bg-[#FFFFFF] dark:bg-[#1D1D21] w-[800px] relative ${searchQuery.length > 0 && hiddenDisplay ? 'rounded-b-none rounded-t-3xl' : 'rounded-full'}`}
    >
      <input
        ref={inputRef}
        className="flex-1 border-none outline-none px-2 py-1 bg-inherit w-[740px]"
        placeholder={t(agencyUUID ? 'search_agency' : 'search')}
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      {searchQuery.length > 0 && (
        <div className="absolute right-10 bg-transparent flex text-dim-500 items-center">
          <div className="font-normal text-xs" style={{ lineHeight: '18px' }}>
            {t('press_enter')} &nbsp;
          </div>
          <div
            className="font-semibold text-xs "
            style={{ lineHeight: '18px' }}
          >
            {t('enter_key')} &nbsp;
          </div>
          <div
            className="font-normal text-xs pr-2"
            style={{ lineHeight: '18px' }}
          >
            {t('display_matches')}
          </div>
          <div className="pr-4 hover:cursor-pointer" onClick={clearSearch}>
            <Close />
          </div>
        </div>
      )}
      <div
        className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-b from-[#B379FF] to-[#702FF9] to-[60.94%] hover:cursor-pointer"
        onClick={handleInfoClick}
      >
        <Search className="text-white" />
      </div>
      {searchQuery.length > 0 && hiddenDisplay && (
        <div className="absolute top-full left-0 border-t-[1px] rounded-b-3xl bg-[#FFFFFF] dark:bg-[#1D1D21] shadow-lg w-full max-h-96 overflow-y-auto">
          <div className="overflow-y-auto max-h-60 pl-2 pr-3 pt-2">
            {/* Wrapper for scrollbar */}
            {isSearching ? (
              <div className="px-4 py-2 text-center">{t('searching')}</div>
            ) : (
              <>
                {searchResults.length === 0 && showNoResults && (
                  <div className="px-4 py-2 text-center">{t('no_results')}</div>
                )}
                {searchResults.length > 0 && (
                  <ul>
                    {searchResults.slice(0, 20).map((result, index) => {
                      // take 20 result max
                      const agencyAcronym = Object.keys(agencyMap).find(
                        key => agencyMap[key] === result.agency.id.toString(),
                      );

                      return (
                        <div
                          key={index}
                          className="flex rounded-md items-center pr-2 pl-4 py-2 last:border-0 hover:bg-outline-200 max-h-[60px] max-w-[780px]"
                        >
                          <Link
                            className="grow"
                            href={`/${agencyAcronym?.toLowerCase()}/${result.id}`}
                          >
                            <span className="font-medium text-sm text-black-700 line-clamp-1 ">
                              {highlightText(result.question, searchQuery)}
                            </span>
                            <span className="mt-1 font-normal text-sm text-dim-500 line-clamp-1">
                              Answer:{' '}
                              {highlightText(result.answer, searchQuery)}
                            </span>
                          </Link>
                          <span className="on hover:cursor-pointer pl-3">
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
                        </div>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </div>
          <AskQuestion />
        </div>
      )}
    </div>
  );
};

export default InputNavbar;
