"use client";

import { searchQuestions } from "@/actions/questionServices";
import { Question } from "@/types/types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useTransition,
  useEffect,
  useRef,
  RefObject,
} from "react";

type Context = {
  query: string;
  results: Question[];
  isSearching: boolean;
  isResultsPopupOpen: boolean;
  isNavbarSearchInputVisible: boolean;
  headerSearchInputRef: RefObject<HTMLInputElement>;
  search: (query: string) => void;
  closeResultsPopup: () => void;
} | null;

const SearchBarContext = createContext<Context>(null);

const SEARCH_RESULTS_PAGE = 1;
const SEARCH_RESULTS_LIMIT = 2;

function useHeaderSearchInputVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // We should only have at most one entry
        if (entries.length > 1) {
          throw Error("Multiple entries in intersection observer.");
        }

        const entry = entries.at(0);
        if (!entry) return;
        setIsVisible(entry.isIntersecting);
      },
      { root: null }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return { ref, isVisible };
}

export function SearchBarContextProvider({ children }: PropsWithChildren) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Question[]>([]);
  const [isResultsPopupOpen, setIsResultsPopupOpen] = useState(false);
  const [isSearching, startTranstion] = useTransition();
  const { ref: headerSearchInputRef, isVisible: isHeaderSearchInputVisible } =
    useHeaderSearchInputVisibility();

  const search = (query: string) => {
    setQuery(query);
    if (!query.length) {
      setIsResultsPopupOpen(false);
      setResults([]);
      return;
    }
    setIsResultsPopupOpen(true);
    startTranstion(async () => {
      const { results } = await searchQuestions(
        query,
        SEARCH_RESULTS_PAGE,
        SEARCH_RESULTS_LIMIT
      );
      setResults(results);
    });
  };

  const closeResultsPopup = () => {
    setIsResultsPopupOpen(false);
    setResults([]);
  };

  useEffect(() => {
    closeResultsPopup();
  }, [isHeaderSearchInputVisible]);

  return (
    <SearchBarContext.Provider
      value={{
        query,
        results,
        isSearching,
        isResultsPopupOpen,
        isNavbarSearchInputVisible:
          headerSearchInputRef.current !== null && !isHeaderSearchInputVisible,
        headerSearchInputRef,
        search,
        closeResultsPopup,
      }}
    >
      {children}
    </SearchBarContext.Provider>
  );
}

export function useSearchBar(): NonNullable<Context> {
  const context = useContext(SearchBarContext);
  if (!context) {
    throw Error(
      "useSearchBar must be used within a SearchBarContext provider."
    );
  }
  return context;
}
