'use client';
import { createContext, useState, useCallback } from 'react';

export const context = createContext({
  headerMessage: 'hai',
  setHeaderMessage: (message: string) => {},
});

const ContextSearchBar = ({ children }: { children: React.ReactNode }) => {
  const [headerMessage, setHeaderMessage] = useState('hai');

  const updateHeaderMessage = useCallback((message: string) => {
    setHeaderMessage(message);
  }, []);

  return (
    <context.Provider
      value={{ headerMessage, setHeaderMessage: updateHeaderMessage }}
    >
      {children}
    </context.Provider>
  );
};

export default ContextSearchBar;
