import { createContext, useContext, useState } from "react";

const IsOpenContext = createContext();

export const IsOpenProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <IsOpenContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </IsOpenContext.Provider>
  );
};

export const useIsOpen = () => {
  return useContext(IsOpenContext);
};
