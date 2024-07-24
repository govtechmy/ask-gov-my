// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface ActiveDropdownContextProps {
//   activeDropDown: boolean;
//   setActiveDropdown: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const ActiveDropdownContext = createContext<
//   ActiveDropdownContextProps | undefined
// >(undefined);

// export const ActiveDropdownProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [activeDropDown, setActiveDropdown] = useState(false);

//   return (
//     <ActiveDropdownContext.Provider
//       value={{ activeDropDown, setActiveDropdown }}
//     >
//       {children}
//     </ActiveDropdownContext.Provider>
//   );
// };

// export const useActiveDropdown = () => {
//   const context = useContext(ActiveDropdownContext);
//   if (!context) {
//     throw new Error(
//       'useActiveDropdown must be used within an ActiveDropdownProvider',
//     );
//   }
//   return context;
// };
