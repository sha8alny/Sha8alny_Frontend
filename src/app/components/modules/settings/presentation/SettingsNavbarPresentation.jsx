"use client";
/**
 * SettingsNavbarPresentation component renders the navigation bar for the settings page.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.profilePictureUrl - The URL of the user's profile picture.
 * @param {string} props.headline - The headline or status of the user.
 * @param {string} props.name - The name of the user.
 * @param {boolean} props.isTooltipVisible - Flag to determine if the tooltip is visible.
 * @param {function} props.handleHomeNavigation - Function to handle navigation to the home page.
 * @param {function} props.handleProfileClick - Function to handle profile button click.
 * @param {function} props.handleViewProfile - Function to handle viewing the profile.
 * @param {Object} props.tooltipRef - Ref object for the tooltip element.
 * @param {Object} props.profileButtonRef - Ref object for the profile button element.
 * @param {function} props.handleSignOut - Function to handle signing out.
 */


const SettingsNavbarPresentation = ({
  profilePictureUrl,
  headline,
  name,
  isTooltipVisible,
  handleHomeNavigation,
  handleProfileClick,
  handleViewProfile,
  tooltipRef,
  profileButtonRef,
  handleSignOut,
}) => {
  return (
    <nav className="flex flex-row bg-foreground p-4 border-b-[1px] border-gray-600">
      <button
        onClick={handleHomeNavigation}
        className="text-primary font-sans font-semibold text-2xl flex flex-row cursor-pointer"
      >
        SHA<p className="text-secondary">غ</p>LNY
      </button>
      <div className="ml-auto relative">
        <button
          onClick={handleProfileClick}
          className="cursor-pointer"
          ref={profileButtonRef}
        >
          <img
            src={profilePictureUrl}
            alt="profile"
            className="rounded-full h-8 w-8"
          />
        </button>
        {isTooltipVisible && (
          <div
            className="absolute right-0 mt-2 w-60 bg-foreground rounded-lg shadow-2xl p-4"
            ref={tooltipRef}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <img
                  src={profilePictureUrl}
                  alt="profile-tooltip"
                  className="rounded-full h-12 w-12 mb-2"
                />
                <div>
                  <p className="text-sm font-semibold text-text">{name}</p>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {headline}
                  </p>
                </div>
              </div>
              <div className="h-[0.08rem] w-full bg-gray-500"></div>
              <button
                className="cursor-pointer text-text hover:underline"
                onClick={handleViewProfile}
              >
                View profile
              </button>
              <div className="h-[0.08rem] w-full bg-gray-500"></div>
              <button
                className="cursor-pointer text-text hover:underline"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SettingsNavbarPresentation;