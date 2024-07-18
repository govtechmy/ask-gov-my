'use client';
import { createContext, useState, useCallback } from 'react';

type contextvalue = {
  headerContent: string;
  setHeaderContent: (content: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
  displayAllMatches: boolean;
  setDisplayAllMatches: (display: boolean) => void;
};

export const context = createContext<contextvalue>({
  headerContent: '',
  setHeaderContent: (content: string) => {},
  searchQuery: '',
  setSearchQuery: (query: string) => {},
  searchResults: [],
  setSearchResults: (results: any[]) => {},
  displayAllMatches: false,
  setDisplayAllMatches: (display: boolean) => {},
});

const ContextSearchBar = ({ children }: { children: React.ReactNode }) => {
  const [headerContent, setHeaderContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [displayAllMatches, setDisplayAllMatches] = useState<boolean>(false);

  const updateHeaderContent = useCallback((content: string) => {
    setHeaderContent(content);
  }, []);

  return (
    <context.Provider
      value={{
        headerContent,
        setHeaderContent: updateHeaderContent,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        displayAllMatches,
        setDisplayAllMatches,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default ContextSearchBar;
