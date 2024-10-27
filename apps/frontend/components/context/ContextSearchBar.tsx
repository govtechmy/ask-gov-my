"use client";
import { createContext, useState } from "react";

type contextvalue = {
  headerContent: string;
  setHeaderContent: (content: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
};

export const context = createContext<contextvalue>({
  headerContent: "",
  setHeaderContent: (content: string) => {},
  searchQuery: "",
  setSearchQuery: (query: string) => {},
  searchResults: [],
  setSearchResults: (results: any[]) => {},
});

const ContextSearchBar = ({ children }: { children: React.ReactNode }) => {
  const [headerContent, setHeaderContent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  return (
    <context.Provider
      value={{
        headerContent,
        setHeaderContent,
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
