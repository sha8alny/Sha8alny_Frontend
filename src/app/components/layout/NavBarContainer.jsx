import { useTheme } from "@/app/context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import NavbarPresentation, {
  NavBarPresentationSkeleton,
} from "./NavBarPresentation";
import { useQuery } from "@tanstack/react-query";

import { useState } from "react";
import { fetchSidebarInfo } from "@/app/services/fetchSideBarInfo";
import { handleLogout } from "@/app/services/userManagement";

/**
 * @namespace layout
 * @module layout
 */

/**
 * Navbar component that handles the application's navigation bar functionality.
 * This component fetches user profile data, handles theme toggling, and navigation.
 * It displays a skeleton loader during data fetching and proper error states.
 *
 * @component
 * @returns {JSX.Element} The rendered NavBar component, showing either the full NavbarPresentation
 * or the NavBarPresentationSkeleton based on the loading/error state of data fetching
 */
function NavbarContainer() {
    const pathName = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const {
      data: userProfile,
      isLoading,
      isError,
    } = useQuery({
      queryKey: ["sidebarInfo","notifications"],
      queryFn: () => fetchSidebarInfo(),
      staleTime: 1000 * 30, 
    });
  
    const handleNavigation = (path) => {
      router.push(path);
    };

    const handleLogOut = () => {
      handleLogout();
    }
  
  
    const handleSearch = (e) => {
      if (e.key === "Enter" || e.type === "click") {
        const query = searchQuery.trim();
        if (query) {
          handleNavigation(`/search/all?query=${encodeURIComponent(query)}`);
          setShowMobileSearch(false);
        }
      }
    };
    if (isLoading) {
      return (
        <NavBarPresentationSkeleton
          isLoading={true}
          theme={theme}
          toggleTheme={toggleTheme}
          currentPath={pathName}
          navigateTo={handleNavigation}
        />
      );
    }
  
    if (isError || !userProfile) {
      return (
        <NavBarPresentationSkeleton
          isLoading={false}
          theme={theme}
          toggleTheme={toggleTheme}
          currentPath={pathName}
          navigateTo={handleNavigation}
          open={open}
          setOpen={setOpen}
        />
      );
    }
    return (
      <NavbarPresentation
        userInfo={userProfile}
        theme={theme}
        toggleTheme={toggleTheme}
        currentPath={pathName}
        navigateTo={handleNavigation}
        open={open}
        setOpen={setOpen}
        handleLogOut={handleLogOut}
        setShowMobileSearch={setShowMobileSearch}
        showMobileSearch={showMobileSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
    );
  }
  
  export default NavbarContainer;