"use client";
import React, { Suspense, useContext } from "react";
import { Link } from "@/lib/i18n";
import ThemeToggle from "./theme-toggle";
import LocaleSwitch from "./locale-switch";
import Asklogo from "@/icons/asklogo";
import { context } from "@/components/context/ContextSearchBar";
import InputNavbar from "../../common/SearchNavbar/inputnavbar";
import { StyledDisplay } from "@/components/ui/display";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  SearchIcon,
} from "@askgovmy/ui";

interface HeaderProps {
  isAdmin?: boolean;
  alwaysShowSearch?: boolean;
  agencyAcronym?: string;
}

const BaseHeader: React.FC<HeaderProps> = ({
  isAdmin = false,
  alwaysShowSearch = false,
  agencyAcronym,
}) => {
  const {
    navbarSearchIsVisible,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
  } = useContext(context);

  const showSearch = alwaysShowSearch || navbarSearchIsVisible;

  return (
    <div id="header" className={`sticky top-0 z-50 ${isAdmin ? "" : "w-full"}`}>
      <div
        className={`w-full bg-white ${isAdmin ? "border-[1px] border-outline-200" : "p-2 border-[1px] border-outline-200 h-16"} flex items-center`}
      >
        <div className={`${isAdmin ? "p-2" : "container"} flex w-full`}>
          <div className="flex justify-between w-full items-center">
            <Link href={agencyAcronym ? `/${agencyAcronym}` : "/"}>
              <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center hover:cursor-pointer">
                <Asklogo />
                <div className="flex">
                  Ask
                  {agencyAcronym ? (
                    <div className="text-[#702FF9] dark:text-[#9E70FF]">
                      {agencyAcronym.toUpperCase()}
                    </div>
                  ) : (
                    <div className="">MyGov</div>
                  )}
                </div>
                {isAdmin && (
                  <StyledDisplay variant={"nameHeader"}>ADMIN</StyledDisplay>
                )}
              </div>
            </Link>

            {showSearch && (
              <InputNavbar
                className="mx-3 hidden lg:flex"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
              />
            )}

            <div className="flex gap-3 items-center">
              {showSearch && (
                <PopoverRoot>
                  <PopoverTrigger className="lg:hidden">
                    <SearchIcon />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-screen bg-transparent border-none px-4 h-full"
                    align="center"
                  >
                    <InputNavbar
                      className="shadow-lg"
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                    />
                  </PopoverContent>
                </PopoverRoot>
              )}
              <ThemeToggle />
              <Suspense>
                <LocaleSwitch />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseHeader;
