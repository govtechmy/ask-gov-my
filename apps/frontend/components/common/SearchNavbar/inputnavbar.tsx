"use client";

import React, { useState, useCallback, useRef } from "react";
import { Link } from "@/lib/i18n";
import { searchQuestions } from "@/actions/questionServices";
import Search from "@/icons/search";
import JataNegaraIcon from "@/icons/jatanegaraicon";
import Close from "@/icons/close";
import RightArrow from "@/icons/rightarrow";
import AskQuestion from "./AskQuestion";
import { useRouter } from "@/lib/i18n";
import { useTranslations } from "next-intl";
import { Question } from "@/types/types";
import { cn } from "@askgovmy/utils";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandLoading,
  PopoverAnchor,
  PopoverContent,
  PopoverRoot,
} from "@askgovmy/ui";

interface InputNavbarProps {
  className?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Question[];
  setSearchResults: (results: Question[]) => void;
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
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="text-[#702FF9] dark:text-[#9E70FF]">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const InputNavbar: React.FC<InputNavbarProps> = ({
  className,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  agencyUUID,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsPopup, setShowResultsPopup] = useState(false);
  const router = useRouter();
  const t = useTranslations("Search");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInfoClick = () => {
    if (searchQuery.trim().length > 0) {
      router.push(`/searchresults?query=${searchQuery}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setShowResultsPopup(true);
    debouncedFetchSearchResults(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim().length > 0) {
      router.push(`/searchresults?query=${searchQuery}`);
      setSearchResults([]);
      setShowResultsPopup(false);
      inputRef.current?.blur();
    }
  };

  const fetchSearchResults = async (query: string) => {
    if (query.length > 0) {
      setIsSearching(true);
      const results = await searchQuestions(query);
      setSearchResults(results.results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query: string) => fetchSearchResults(query), 1000), // ms delay
    []
  );

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <PopoverRoot
      open={searchQuery.length > 0 && showResultsPopup}
      onOpenChange={setShowResultsPopup}
    >
      <PopoverAnchor asChild>
        <div
          id="inputnavbar"
          className={cn(
            `flex items-center border-outline-200 h-11 shadow-button border pl-3 pr-2 py-2 bg-white w-full relative `,
            searchQuery.length > 0 && showResultsPopup
              ? "rounded-b-none rounded-t-3xl"
              : "rounded-full",
            className
          )}
        >
          <input
            ref={inputRef}
            className="flex-1 border-none outline-none px-2 py-1 bg-inherit w-full"
            placeholder={t(agencyUUID ? "search_agency" : "search")}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          {searchQuery.length > 0 && (
            <div className="absolute right-10 bg-transparent flex text-dim-500 items-center">
              <div
                className="font-normal text-xs"
                style={{ lineHeight: "18px" }}
              >
                {t("press_enter")} &nbsp;
              </div>
              <div
                className="font-semibold text-xs "
                style={{ lineHeight: "18px" }}
              >
                {t("enter_key")} &nbsp;
              </div>
              <div
                className="font-normal text-xs pr-2"
                style={{ lineHeight: "18px" }}
              >
                {t("display_matches")}
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
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="border-t-[1px] rounded-t-none rounded-b-3xl bg-[#FFFFFF] dark:bg-[#1D1D21] shadow-lg w-[var(--radix-popover-trigger-width)] max-h-96 overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="start"
        sideOffset={0}
      >
        <div className="overflow-y-auto max-h-60">
          <Command shouldFilter={false}>
            <CommandList>
              {isSearching && (
                <CommandLoading>
                  <p className="py-2 text-center">{t("searching")}</p>
                </CommandLoading>
              )}
              <CommandEmpty>
                <p className="py-2 text-center">{t("no_results")}</p>
              </CommandEmpty>
              {searchResults.map((result) => (
                <CommandItem
                  key={result.id}
                  className="flex rounded-md items-center pr-2 pl-4 py-2 last:border-0 hover:bg-outline-200 h-auto max-h-[60px]"
                >
                  <Link
                    className="grow"
                    href={`/${result.agency.acronym.toLowerCase()}/${result.id}`}
                  >
                    <span className="font-medium text-sm text-black-700 line-clamp-1 ">
                      {highlightText(result.question, searchQuery)}
                    </span>
                    <span className="mt-1 font-normal text-sm text-dim-500 line-clamp-1">
                      Answer: {highlightText(result.answer!.text, searchQuery)}
                    </span>
                  </Link>
                  <span className="on hover:cursor-pointer pl-3">
                    <div className="flex">
                      <div className="pr-1.5">
                        <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A] h-5 w-5"></JataNegaraIcon>
                      </div>
                      <div className="font-normal text-sm text-black-800">
                        {result.agency.acronym}
                      </div>
                      <div className="px-1">
                        <RightArrow />
                      </div>
                    </div>
                  </span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
        <AskQuestion />
      </PopoverContent>
    </PopoverRoot>
  );
};

export default InputNavbar;
