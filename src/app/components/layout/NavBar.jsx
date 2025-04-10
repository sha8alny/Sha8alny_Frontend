"use client";

import { usePathname } from "next/navigation";
import NavbarContainer from "./NavBarContainer";


function Navbar() {
  const pathName = usePathname();
  if (pathName === "/signup" || pathName === "/signin" || pathName === "/complete-profile") {
    return null;
  }
  return <NavbarContainer />;
}

export default Navbar;