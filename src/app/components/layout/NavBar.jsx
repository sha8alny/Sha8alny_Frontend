"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import NavbarPresentation, {
  NavBarPresentationSkeleton,
} from "./NavBarPresentation";
import { fetchUserProfile } from "@/app/services/userProfile";
import { useQuery } from "@tanstack/react-query";

/**
 * Navbar component that handles the application's navigation bar functionality.
 * This component fetches user profile data, handles theme toggling, and navigation.
 * It displays a skeleton loader during data fetching and proper error states.
 *
 * @component
 * @returns {JSX.Element} The rendered NavBar component, showing either the full NavbarPresentation
 * or the NavBarPresentationSkeleton based on the loading/error state of data fetching
 */
export default function Navbar() {
  const pathName = usePathname();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // TODO: Replace with actual username from auth context
  const username = "ziadhesham";

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => fetchUserProfile(username),
  });

  const handleNavigation = (path) => {
    router.push(path);
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
    />
  );
}
