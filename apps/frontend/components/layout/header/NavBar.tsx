"use client";
import React, { Suspense, useState } from "react";
import { Link } from "@/lib/i18n";
import ThemeToggle from "./theme-toggle";
import LocaleSwitch from "./locale-switch";
import Asklogo from "@/icons/asklogo";
import SearchBar from "../../common/Header/SearchBar";
import { StyledDisplay } from "@/components/ui/display";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  SearchIcon,
} from "@askgovmy/ui";
import { useSearchBar } from "@/components/context/SearchBarContext";

interface NavBarProps {
  isAdmin?: boolean;
  alwaysShowSearch?: boolean;
  agencyAcronym?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  isAdmin = false,
  alwaysShowSearch = false,
  agencyAcronym,
}) => {
  const { isNavbarSearchInputVisible } = useSearchBar();
  const showSearch = alwaysShowSearch || isNavbarSearchInputVisible;
  const [openSearchPopover, setOpenSearchPopover] = useState(false);

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

            {showSearch && <SearchBar className="mx-3 hidden lg:flex" />}

            <div className="flex gap-3 items-center">
              {showSearch && (
                <PopoverRoot
                  open={openSearchPopover}
                  onOpenChange={setOpenSearchPopover}
                >
                  <PopoverTrigger className="lg:hidden">
                    <SearchIcon />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-screen bg-transparent border-none px-1 h-full"
                    align="center"
                  >
                    <SearchBar
                      className="shadow-2xl bg-transparent rounded-full"
                      onClear={() => setOpenSearchPopover(false)}
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

export default NavBar;
