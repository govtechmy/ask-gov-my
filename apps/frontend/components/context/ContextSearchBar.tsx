"use client";
import { Question } from "@/types/types";
import { createContext, useState } from "react";

type contextvalue = {
  navbarSearchIsVisible: boolean;
  showNavbarSearch: () => void;
  hideNavbarSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Question[];
  setSearchResults: (results: Question[]) => void;
};

export const context = createContext<contextvalue>({
  navbarSearchIsVisible: false,
  showNavbarSearch: () => {},
  hideNavbarSearch: () => {},
  searchQuery: "",
  setSearchQuery: (query: string) => {},
  searchResults: [],
  setSearchResults: (results: Question[]) => {},
});

const ContextSearchBar = ({ children }: { children: React.ReactNode }) => {
  const [navbarSearchIsVisible, setNavbarSearchIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const showNavbarSearch = () => setNavbarSearchIsVisible(true);
  const hideNavbarSearch = () => setNavbarSearchIsVisible(false);

  return (
    <context.Provider
      value={{
        navbarSearchIsVisible,
        showNavbarSearch,
        hideNavbarSearch,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default ContextSearchBar;
