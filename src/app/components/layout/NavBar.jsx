"use client";

import { usePathname } from "next/navigation";
import NavbarContainer from "./NavBarContainer";

function Navbar() {
  const pathName = usePathname();
  const PUBLIC_PATHS = [
    "/login",
    "/signin",
    "/signup",
    "/register",
    "/forget-password",
    "/reset-password",
    "/complete-profile",
    "/verify-email",
    "/error",
    "/about",
    "/privacy-policy",
    "/cookie-policy",
    "/terms",
    "/user-agreement",
    '/moodrnfr',
  , '/home'];
  if (PUBLIC_PATHS.some((path) => pathName.startsWith(path))) {
    return null;
  }
  return <NavbarContainer />;
}

export default Navbar;
