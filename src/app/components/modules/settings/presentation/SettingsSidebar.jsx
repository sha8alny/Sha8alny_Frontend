"use client";

import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
/**
 * SettingsSidebar component renders a sidebar with different settings options.
 * @param {Object} props - The component props.
 * @param {function} props.setActiveSetting - Function to set the active setting.
 * @param {string} props.profilePictureUrl - user's profile pic.
 * @returns {JSX.Element} The rendered component.
 */
const SettingsSidebar = ({ children, setActiveSetting ,profilePictureUrl}) => {
  const searchParams = useSearchParams();
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      const settingIndex = settings.findIndex(s => s.name === section);
      if (settingIndex !== -1) {
        setHighlight(settingIndex);
      }
    }
  }, [searchParams]);

  const settings = [
    { name: "Account Preferences", id: 0, icon: <PersonIcon /> },
    { name: "Sign in & Security", id: 1, icon: <SecurityIcon /> },

  ];

  const handleChangeSetting = (id, name) => {
    setHighlight(id);
    setActiveSetting(name);
  };

  return (
    <aside className="bg-foreground flex flex-col lg:h-full lg:w-[390px]  ">
      <div className="flex flex-row gap-2 mt-3 items-center ml-4 p-2">
        <img
          src={profilePictureUrl}
          alt="profile"
          className="rounded-full h-8 w-8 "
        />
        <h1 className="text-primary text-3xl font-sans font-semibold">
          Settings
        </h1>
      </div>
      <div className="flex md:flex-col sm:flex-row gap-8 mt-8 items-start overflow-x-scroll md:overflow-hidden w-max">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex flex-row items-center gap-2 w-full"
          >
            <button
              key={setting.id}
              className={`text-primary font-sans font-semibold text-[1.3rem] pl-2 pb-2  flex items-center w-full md:pr-2 cursor-pointer ${
                highlight === setting.id &&
                "text-secondary duration-150 md:border-l-4 md:border-secondary md:pl-6 "
              }`}
              onClick={() => handleChangeSetting(setting.id, setting.name)}
            >
              <span
                className={`text-primary ${
                  highlight === setting.id && "text-secondary duration-150"
                }`}
              >
                {setting.icon}
              </span>
              <span className="pl-2 mt-1">{setting.name}</span>
            </button>
          </div>
        ))}
      </div>
      {children}
    </aside>
  );
};

SettingsSidebar.displayName = "SettingsSidebar";

export default SettingsSidebar;
