"use client";

import React, { forwardRef } from "react";
import { Link } from "@/lib/i18n";
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
  ({ className, agencyUUID, hideResultsPopup }, ref) => {
    const {
      query,
      isSearching,
      results,
      isResultsPopupOpen,
      search,
      closeResultsPopup,
    } = useSearchBar();
    const router = useRouter();
    const t = useTranslations("Search");

    const handleSearchIconClick = () => {
      if (query.length > 0) {
        router.push(`/searchresults?query=${query}`);
      }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      search(event.target.value);
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

    const clearSearch = () => {
      closeResultsPopup();
    };

    return (
      <PopoverRoot open={isResultsPopupOpen}>
        <PopoverAnchor asChild>
          <div
            id="inputnavbar"
            className={cn(
              `flex items-center border-outline-200 h-11 shadow-button border pl-3 pr-2 py-2 bg-white w-full relative `,
              isResultsPopupOpen
                ? "rounded-b-none rounded-t-3xl"
                : "rounded-full",
              className
            )}
          >
            <input
              ref={ref}
              className="flex-1 border-none outline-none px-2 py-1 bg-inherit w-full"
              placeholder={t(agencyUUID ? "search_agency" : "search")}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {query.length > 0 && (
              <div className="hidden md:flex absolute right-10 bg-transparent text-dim-500 items-center">
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
                <div
                  className="pr-4 hover:cursor-pointer"
                  onClick={clearSearch}
                >
                  <Close />
                </div>
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
            "border-t-[1px] rounded-t-none rounded-b-3xl bg-[#FFFFFF] dark:bg-[#1D1D21] shadow-lg w-[var(--radix-popover-trigger-width)] max-h-96 overflow-y-auto",
            hideResultsPopup && "hidden"
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="start"
          sideOffset={0}
        >
          <div className="overflow-y-auto max-h-60">
            <Command shouldFilter={false}>
              <CommandList>
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
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    className="flex rounded-md items-center pr-2 pl-4 py-2 last:border-0 hover:bg-outline-200 h-auto max-h-[60px]"
                  >
                    <Link
                      className="grow"
                      href={`/${result.agency.acronym.toLowerCase()}/${result.id}`}
                    >
                      <span className="font-medium text-sm text-black-700 line-clamp-1 ">
                        {highlightText(result.question, query)}
                      </span>
                      <span className="mt-1 font-normal text-sm text-dim-500 line-clamp-1">
                        Answer: {highlightText(result.answer!.text, query)}
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
  }
);

export default SearchBar;
