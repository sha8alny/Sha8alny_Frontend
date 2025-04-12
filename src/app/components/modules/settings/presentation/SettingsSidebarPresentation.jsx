import React from "react";
/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsSidebarPresentation component renders the sidebar for the settings page.
 *
 * @param {Object} props - The component props.
 * @param {string} props.profilePictureUrl - The URL of the profile picture.
 * @param {Array} props.settings - The list of settings.
 * @param {number} props.highlight - The index of the highlighted setting.
 * @param {function} props.handleChangeSetting - Function to handle changing the active setting.
 * @returns {JSX.Element} The rendered component.
 */
const SettingsSidebarPresentation = ({
  profilePictureUrl,
  settings,
  highlight,
  handleChangeSetting,
}) => {
  return (
    <aside className="bg-foreground flex flex-col lg:h-full lg:w-[390px] ">
      <div className="flex flex-row gap-2 mt-3 items-center ml-4 p-2">
        <img
          src={profilePictureUrl}
          alt="profile"
          className="rounded-full h-8 w-8"
        />
        <h1 className="text-primary text-3xl font-sans font-semibold">
          Settings
        </h1>
      </div>
      <div className="flex md:flex-col sm:flex-row gap-8 mt-8 items-start overflow-x-auto w-full">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex flex-row items-center gap-2 w-full"
          >
            <button
              key={setting.id}
              className={`text-primary font-sans font-semibold text-[1.3rem] pl-2 pb-2 flex items-center w-full md:pr-2 cursor-pointer ${
                highlight === setting.id &&
                "text-secondary duration-150 md:border-l-4 md:border-secondary md:pl-6"
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
    </aside>
  );
};

SettingsSidebarPresentation.displayName = "SettingsSidebarPresentation";

export default SettingsSidebarPresentation;
