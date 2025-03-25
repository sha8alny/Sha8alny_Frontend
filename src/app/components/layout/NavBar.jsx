"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import NavbarPresentation, { NavBarPresentationSkeleton } from "./NavBarPresentation";
import { fetchUserProfile } from "@/app/services/userProfile";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const pathName = usePathname();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  
  // TODO: Replace with actual username from auth context
  const username = "ziadhesham";

  const { data: userProfile, isLoading, isError } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => fetchUserProfile(username),
  });

  const handleNavigation = (path) => {
    router.push(path);
  };

  if (isLoading) {
    return <NavBarPresentationSkeleton
    isLoading={true}
    theme={theme}
    toggleTheme={toggleTheme}
    currentPath={pathName}
    navigateTo={handleNavigation} />;
  }

  if (isError) {
    return <NavBarPresentationSkeleton
    isLoading={false}
    theme={theme}
    toggleTheme={toggleTheme}
    currentPath={pathName}
    navigateTo={handleNavigation}/>;
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
