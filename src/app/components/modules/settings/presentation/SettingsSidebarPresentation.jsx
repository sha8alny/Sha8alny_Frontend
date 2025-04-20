import React, { useEffect } from "react";
import { Separator } from "@/app/components/ui/Separator";

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
 * @param {React.RefObject} props.carouselRef - Reference to the carousel element.
 * @returns {JSX.Element} The rendered component.
 */
const SettingsSidebarPresentation = ({
  profilePictureUrl,
  settings,
  highlight,
  handleChangeSetting,
  carouselRef,
}) => {
  useEffect(() => {
    if (carouselRef.current && window.innerWidth < 1024) {
      const activeElement = carouselRef.current.children[highlight];
      if (activeElement) {
        activeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'center' 
        });
      }
    }
  }, [highlight, carouselRef]);

  return (
    <>
      <div className="md:hidden h-fit w-full bg-foreground sticky top-0 z-10 shadow-md">
        <div className="flex items-center px-4 py-3">
          <img
            src={profilePictureUrl}
            alt="profile"
            className="rounded-full h-8 w-8 mr-3"
          />
          <h1 className="text-primary text-xl font-sans font-bold tracking-tight">
            Settings
          </h1>
        </div>
        
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide py-3 px-4 gap-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {settings.map((setting) => (
            <button
             data-testid={setting.name + "-mobile"}
              key={setting.id}
              className={`flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                highlight === setting.id
                  ? "bg-secondary text-white"
                  : "bg-foreground text-text border border-primary/20 hover:bg-secondary/20"
              }`}
              onClick={() => handleChangeSetting(setting.id, setting.name)}
            >
              <span className="mr-2">{setting.icon}</span>
              {setting.name}
            </button>
          ))}
        </div>
      </div>

      <aside className="hidden md:flex flex-col h-auto sticky top-16 min-w-[290px] bg-foreground max-h-screen overflow-y-auto">
        <div className="flex flex-row gap-2 mt-3 items-center ml-4 p-2 ">
          <img
            src={profilePictureUrl}
            alt="profile"
            className="rounded-full h-8 w-8"
          />
          <h1 className="text-primary text-2xl font-sans font-bold tracking-tight">
            Settings
          </h1>
        </div>

        <div className="flex flex-col gap-8 mt-9 items-start w-full pb-8">
          {settings.map((setting) => (
            <div
              key={setting.id}
              data-testid={setting.name}
              className="flex flex-row items-center gap-2 w-full"
            >
              <button
                className={`text-primary font-sans font-semibold text-md pl-2 pb-2 flex items-center w-full pr-2 cursor-pointer ${
                  highlight === setting.id &&
                  "text-secondary duration-150 border-l-4 border-secondary pl-6"
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
    </>
  );
};

SettingsSidebarPresentation.displayName = "SettingsSidebarPresentation";

export default SettingsSidebarPresentation;