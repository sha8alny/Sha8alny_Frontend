"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import NavbarPresentation from "./NavBarPresentation";
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
    staleTime: 300000, // 5 minutes
  });

  const handleNavigation = (path) => {
    router.push(path);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading profile</div>;
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
