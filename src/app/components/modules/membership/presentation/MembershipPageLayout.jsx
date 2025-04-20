"use client";

import SettingsNavbarContainer from "../../settings/container/SettingsNavbarContainer";

/**
 * @namespace membership
 * @module membership
 */
/**
 * MembershipPageLayout component
 *
 * This component serves as a layout for the membership page. It includes a 
 * SettingsNavbar component and renders any children passed to it.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 *
 * @returns {JSX.Element} The rendered MembershipPageLayout component.
 */


const MembershipPageLayout = ({ children }) => {
  return (
    <div className="bg-background  text-text font-sans">
      {children}
    </div>
  );
};

export default MembershipPageLayout;
