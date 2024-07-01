"use client";

import { searchQuestions } from "@/actions/searchServices";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Info from "@/icons/info";
import Search from "@/icons/search";
import React, { useState } from "react";

const SearchNavbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to hold the search query

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value); // Update the search query state
  };

  return (
    <nav className="bg-gradient-radial from-[#D4C0FF] to-[#F4EFFF] py-2 dark:from-[#4F1FB4] dark:to-[#201636]">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between px-5 py-5">
        <div className="font-poppins py-6 text-2xl font-semibold text-[#482D7C] dark:text-white">
          One stop for all your government questions
        </div>
      </div>
      <Command className="border-outline-200 shadow-button mx-auto rounded-full border lg:w-[800px]">
        <CommandInput
          className="rounded-full"
          placeholder="Search by keyword or agency name (eg. MOH, MOT)"
          value={searchQuery}
        />
        {searchQuery.length > 0 ? (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem>I CANT FIND WHAT IM LOOKING FOR</CommandItem>
              {/* Add more CommandItem components based on search results */}
            </CommandGroup>
          </CommandList>
        ) : null}
      </Command>
      <div className="flex items-center justify-center">
        <Info className="text-[#766695]" />
        <div className="px-1 py-3 text-center text-sm font-medium text-[#766695]">
          You must search among existing questions before you are allowed to ask
          a new one!
        </div>
      </div>
    </nav>
  );
};

export default SearchNavbar;
