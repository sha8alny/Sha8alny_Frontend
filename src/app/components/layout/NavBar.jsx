"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import NavbarPresentation from "./NavBarPresentation";
import { fetchUserProfile } from "@/app/services/userProfile";
import { useQuery } from "@tanstack/react-query";

/**
 *  Navbar component renders the navigation bar.
 * @returns {JSX.Element} The rendered layout component.
 */
export default function Navbar() {
  const pathName = usePathname();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [current, setCurrent] = useState(pathName);

  const handleSelection = (name, router, setCurrent = null) => {
    if (setCurrent) setCurrent(name);
    switch (name) {
      case "Home":
        router.push("/");
        break;
      case "Network":
        // Handle Network click
        break;
      case "Briefcase":
        // Handle Briefcase click
        break;
      case "MessageCircle":
        // Handle MessageCircle click
        break;
      case "Bell":
        // Handle Bell click
        break;
      case "Profile":
        router.push(`/profile/${userInfo.username}`);
        break;
      default:
        break;
    }
  };

  // TODO: Replace with actual username from auth context
  const username = "johnsmith";

  const {
      data: userProfile,
      isLoading,
      isError,
    } = useQuery({
      queryKey: ["userProfile", username],
      queryFn: () => fetchUserProfile(username),
    });

  if (isLoading){
    return <div>Loading...</div>;
  }

  return (
    <NavbarPresentation
      userInfo={userProfile}
      toggleTheme={toggleTheme}
      router={router}
      current={current}
      setCurrent={setCurrent}
      handleSelection={handleSelection}
    />
  );
}
