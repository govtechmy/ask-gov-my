"use client";

import React, { forwardRef } from "react";
import Search from "@/icons/search";
import JataNegaraIcon from "@/icons/jatanegaraicon";
import Close from "@/icons/close";
import RightArrow from "@/icons/rightarrow";
import AskQuestion from "./AskQuestion";
import { useRouter } from "@/lib/i18n";
import { useTranslations } from "next-intl";
import { cn } from "@askgovmy/utils";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandLoading,
  PopoverAnchor,
  PopoverContent,
  PopoverRoot,
} from "@askgovmy/ui";
import { useSearchBar } from "@/components/context/SearchBarContext";

interface SearchBarProps {
  className?: string;
  agencyUUID?: string;
  hideResultsPopup?: boolean;
  scrollOnFocus?: boolean;
  onClear?: () => void;
}

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

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    { className, agencyUUID, hideResultsPopup, scrollOnFocus, onClear },
    ref
  ) => {
    const {
      query,
      isSearching,
      results,
      isResultsPopupOpen,
      search,
      closeResultsPopup,
      clearSearchBar,
    } = useSearchBar();
    const router = useRouter();
    const t = useTranslations("Search");

    const handleSearchIconClick = () => {
      if (query.length > 0) {
        router.push(`/searchresults?query=${query}`);
        closeResultsPopup();
      }
    };

    const handleInputValueChange = (value: string) => {
      search(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && query.length > 0) {
        router.push(`/searchresults?query=${query}`);
        closeResultsPopup();
        return;
      }
      if (event.key === "Escape") {
        closeResultsPopup();
        return;
      }
    };

    return (
      <Command shouldFilter={false} className={cn("w-full", className)} loop>
        <PopoverRoot open={isResultsPopupOpen}>
          <PopoverAnchor asChild>
            <div
              className={cn(
                `flex items-center border-outline-200 h-11 shadow-button border px-3 py-2 bg-white w-full relative gap-2`,
                isResultsPopupOpen
                  ? "rounded-b-none rounded-t-3xl"
                  : "rounded-full"
              )}
            >
              <CommandInput
                ref={ref}
                containerClassName="flex-1"
                className="border-none shadow-none p-0 scroll-mt-[80px]"
                placeholder={t(agencyUUID ? "search_agency" : "search")}
                value={query}
                onValueChange={handleInputValueChange}
                onKeyDown={handleKeyDown}
                hideSearchIcon
                onFocus={(e) => {
                  if (!scrollOnFocus) return;
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              />
              {query.length > 0 && (
                <p className="text-xs text-dim-500 hidden md:block">
                  {t("press_enter")} &nbsp;
                  <span className="font-semibold">{t("enter_key")} &nbsp;</span>
                  {t("display_matches")}
                </p>
              )}
              {query.length > 0 && (
                <div
                  className="hover:cursor-pointer"
                  onClick={() => {
                    clearSearchBar();
                    onClear?.();
                  }}
                >
                  <Close />
                </div>
              )}
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-b from-[#B379FF] to-[#702FF9] to-[60.94%] hover:cursor-pointer"
                onClick={handleSearchIconClick}
              >
                <Search className="text-white" />
              </div>
            </div>
          </PopoverAnchor>
          <PopoverContent
            className={cn(
              "border-t-[1px] rounded-t-none rounded-b-3xl bg-[#FFFFFF] dark:bg-[#1D1D21] shadow-lg w-[var(--radix-popover-trigger-width)] max-h-[min(var(--radix-popover-content-available-height),400px)] overflow-y-auto p-0",
              hideResultsPopup && "hidden"
            )}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={closeResultsPopup}
            align="start"
            sideOffset={0}
            avoidCollisions={false}
          >
            <CommandList className="max-h-full">
              {isSearching && !results.length && (
                <CommandLoading>
                  <p className="py-2 text-center">{t("searching")}</p>
                </CommandLoading>
              )}
              {!isSearching && (
                <CommandEmpty>
                  <p className="py-2 text-center">{t("no_results")}</p>
                </CommandEmpty>
              )}
              {/* Hacky: A hidden first item so cmdk does not focus on the first item by default */}
              <CommandItem value="-" className="hidden" />
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  className="flex rounded-md items-center hover:bg-outline-200 h-auto cursor-pointer border-b px-3"
                  onSelect={() =>
                    router.push(
                      `/${result.agency.acronym.toLowerCase()}/${result.id}`
                    )
                  }
                >
                  <div className="grow text-lg">
                    <span className="font-medium text-black-700">
                      {highlightText(result.question, query)}
                    </span>
                    <span className="mt-1 font-normal text-dim-500 line-clamp-3">
                      {highlightText(result.answer!.text, query)}
                    </span>
                  </div>
                  <div className="hidden md:flex">
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
                </CommandItem>
              ))}
            </CommandList>
            <AskQuestion />
          </PopoverContent>
        </PopoverRoot>
      </Command>
    );
  }
);

export default SearchBar;
