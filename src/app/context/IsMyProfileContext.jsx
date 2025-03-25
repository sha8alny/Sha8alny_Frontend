import React, { createContext, useContext, useState } from 'react';

const IsMyProfileContext = createContext();

export const IsMyProfileProvider = ({ children }) => {
    const [isMyProfile, setIsMyProfile] = useState(false);

    return (
        <IsMyProfileContext.Provider value={{ isMyProfile, setIsMyProfile }}>
            {children}
        </IsMyProfileContext.Provider>
    );
};

export const useIsMyProfile = () => {
    return useContext(IsMyProfileContext);
};