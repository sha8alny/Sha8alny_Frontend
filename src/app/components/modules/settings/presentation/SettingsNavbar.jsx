/**
 * SettingsNavbar component renders a navbar for settings page.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.profilePictureUrl - user's profile pic.
 * @returns {JSX.Element} The rendered component.
 */

const SettingsNavbar = ({ profilePictureUrl}) => {
  return (
    <nav className="flex flex-row bg-foreground p-4 border-b-[1px] border-gray-600">
      <button className="text-primary font-sans font-semibold text-2xl flex flex-row">
        SHA<p className="text-secondary">غ</p>LNY
      </button>
      <button className="ml-auto">
        <img
          src={profilePictureUrl}
          alt="profile"
          className="rounded-full h-8 w-8 ml-auto"
        />
      </button>
    </nav>
  );
};

SettingsNavbar.displayName = "SettingsNavbar";
export default SettingsNavbar;
